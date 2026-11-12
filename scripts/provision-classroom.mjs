import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// Run from the operator environment. Provide new-account passwords there, never in the roster.
const input = JSON.parse(await readFile(process.argv[2], 'utf8'));
const required = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Missing '+field);
  return value.trim();
};
for (const k of ['year','yearStart','yearEnd','courseCode','courseName','subject','level','room']) required(input[k], k);
if (!['FALL','SPRING'].includes(input.term)) throw new Error('term must be FALL or SPRING');
const startDate = new Date(input.yearStart), endDate = new Date(input.yearEnd);
if (!Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime()) || endDate <= startDate) throw new Error('Invalid academic year dates.');
if (!input.teacher || !Array.isArray(input.students) || !input.students.length) throw new Error('Provide a teacher and at least one student.');
const db = new PrismaClient({adapter:new PrismaPg({connectionString:required(process.env.DATABASE_URL,'DATABASE_URL')})});
async function account(tx, person, role) {
  const email=required(person.email,'email').toLowerCase();
  const found = await tx.user.findFirst({where:{email:{equals:email,mode:'insensitive'}}});
  if(found) {
    if(found.role!==role || found.status!=='ACTIVE') throw new Error('Existing account has a different role or is inactive.');
    return found;
  }
  const password=process.env[required(person.passwordEnv,'passwordEnv')];
  if (!password || password.length < 14 || Buffer.byteLength(password)>72) throw new Error('New accounts require an individual password of 14–72 bytes.');
  return tx.user.create({data:{email,firstName:required(person.firstName,'firstName'),lastName:required(person.lastName,'lastName'),role,passwordHash:await bcrypt.hash(password,12)}});
}
try {
  await db.$transaction(async tx=>{
    await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(771425601)`;
    const teacher=await account(tx,input.teacher,'TEACHER');
    const staff=await tx.staffProfile.upsert({where:{userId:teacher.id},create:{userId:teacher.id,employeeId:required(input.teacher.employeeId,'employeeId'),title:'Instructor'},update:{}});
    const year=await tx.academicYear.upsert({where:{name:input.year},update:{},create:{name:input.year,startDate,endDate}});
    const term=await tx.semester.upsert({where:{yearId_semester:{yearId:year.id,semester:input.term}},update:{},create:{name:input.term,semester:input.term,yearId:year.id}});
    const level=await tx.gradeLevel.upsert({where:{code:input.level},update:{},create:{code:input.level,name:input.level,sortOrder:input.sortOrder??0}});
    const subject=await tx.subject.upsert({where:{name:input.subject},update:{},create:{name:input.subject}});
    const course=await tx.course.upsert({where:{code:input.courseCode},update:{},create:{code:input.courseCode,name:input.courseName,subjectId:subject.id,gradeLevelId:level.id,semesterId:term.id,instructorId:staff.id}});
    if(course.instructorId!==staff.id || course.semesterId!==term.id || course.gradeLevelId!==level.id || course.subjectId!==subject.id) throw new Error('Course code already belongs to another course configuration.');
    let room=await tx.classroom.findFirst({where:{courseId:course.id,name:input.room}});
    if(!room) room=await tx.classroom.create({data:{courseId:course.id,name:input.room,teacherId:staff.id,gradeLevelId:level.id}});
    if(!room.active || room.teacherId!==staff.id) throw new Error('Classroom is inactive or belongs to a different teacher.');
    if(input.administrator) await account(tx,input.administrator,'ADMINISTRATOR');
    for(const person of input.students) {
      const user=await account(tx,person,'STUDENT');
      const guardian=person.guardian ? await account(tx,person.guardian,'PARENT') : null;
      const parent=guardian && await tx.parentProfile.findUnique({where:{userId:guardian.id}});
      let student=await tx.studentProfile.findUnique({where:{userId:user.id}});
      if(student && parent && student.familyId!==parent.familyId) throw new Error('Student and guardian belong to different families.');
      const familyId=student?.familyId ?? parent?.familyId ?? (await tx.family.create({data:{familyName:user.lastName}})).id;
      if(guardian && !parent) await tx.parentProfile.create({data:{userId:guardian.id,familyId,relationship:'Guardian',verified:true}});
      if(!student) student=await tx.studentProfile.create({data:{userId:user.id,firstName:user.firstName,lastName:user.lastName,familyId,studentNumber:required(person.studentNumber,'studentNumber'),academicLevel:level.code,enrollmentStatus:'ENROLLED',enrollmentDate:new Date()}});
      if(student.studentNumber!==person.studentNumber) throw new Error('Existing student number differs from the roster.');
      const enrollment=await tx.enrollment.findFirst({where:{studentId:student.id,semesterId:term.id,academicYearId:year.id}});
      if(enrollment && (enrollment.status!=='ENROLLED'||enrollment.gradeLevelId!==level.id)) throw new Error('Review existing enrollment before changing placement.');
      if(!enrollment) await tx.enrollment.create({data:{studentId:student.id,academicYearId:year.id,semesterId:term.id,gradeLevelId:level.id}});
      await tx.classroomStudent.upsert({where:{classroomId_studentId:{classroomId:room.id,studentId:student.id}},update:{},create:{classroomId:room.id,studentId:student.id}});
    }
  },{timeout:120000});
  console.log('Classroom roster provisioned.');
} finally { await db.$disconnect(); }
