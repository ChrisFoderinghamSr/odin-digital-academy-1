import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {chromium} from 'playwright';

// Test fixtures belong in the disposable local database used by CI.
const url = new URL(process.env.DATABASE_URL);
assert.ok(['127.0.0.1','localhost'].includes(url.hostname) && url.pathname === '/academy_test');
const db = new PrismaClient({adapter:new PrismaPg({connectionString:url.href})});
const tag = randomUUID();
const password = randomUUID();
const hash = await bcrypt.hash(password,10);
const browser = await chromium.launch();
const origin = 'http://localhost:3000';

async function signIn(role) {
  const page = await browser.newPage();
  await page.goto(origin+'/login');
  await page.locator('[name=email]').fill(role+tag+'@example.test');
  await page.locator('[name=password]').fill(password);
  await page.locator('form button[type=submit]').click();
  await page.waitForURL('**/norse-one/dashboard');
  return page;
}

try {
  const dir=await mkdtemp(join(tmpdir(),'academy-roster-'));
  const roster={year:'Setup '+tag,yearStart:'2026-08-01',yearEnd:'2027-06-01',term:'FALL',courseCode:'setup-'+tag,
    courseName:'Setup course',subject:'Setup '+tag,level:'setup-'+tag,room:'Setup room',
    teacher:{email:'t'+tag+'@example.test',firstName:'Setup',lastName:'Teacher',employeeId:'T'+tag,passwordEnv:'QA_TEACHER'},
    students:[{email:'s'+tag+'@example.test',firstName:'Setup',lastName:'Student',studentNumber:'S'+tag,passwordEnv:'QA_STUDENT'}]};
  try {
    const path=join(dir,'roster.json');
    await writeFile(path,JSON.stringify(roster));
    for(let attempt=0;attempt<2;attempt++) execFileSync(process.execPath,['scripts/provision-classroom.mjs',path],
      {env:{...process.env,QA_TEACHER:randomUUID(),QA_STUDENT:randomUUID()},stdio:'inherit'});
    assert.equal(await db.enrollment.count({where:{student:{studentNumber:'S'+tag}}}),1);
  } finally { await rm(dir,{recursive:true,force:true}); }
  const user = role => db.user.create({data:{email:role+tag+'@example.test',firstName:role,lastName:'Fixture',role,passwordHash:hash}});
  const teacher = await user('TEACHER');
  const learner = await user('STUDENT');
  const family = await db.family.create({data:{familyName:tag}});
  const student = await db.studentProfile.create({data:{userId:learner.id,familyId:family.id,studentNumber:tag,firstName:'Learner',lastName:'Fixture',academicLevel:'GRADE_5'}});
  const staff = await db.staffProfile.create({data:{userId:teacher.id,employeeId:tag,title:'Instructor'}});
  const level = await db.gradeLevel.create({data:{code:tag,name:'Grade 5',sortOrder:5}});
  const year = await db.academicYear.create({data:{name:tag,startDate:new Date('2026-08-01'),endDate:new Date('2027-06-01')}});
  const semester = await db.semester.create({data:{name:'Fall',semester:'FALL',yearId:year.id}});
  const subject = await db.subject.create({data:{name:tag}});
  const course = await db.course.create({data:{code:tag,name:'Programming',gradeLevelId:level.id,subjectId:subject.id,semesterId:semester.id,instructorId:staff.id}});
  await db.classroom.create({data:{name:'Lab',gradeLevelId:level.id,courseId:course.id,teacherId:staff.id,students:{create:{studentId:student.id}}}});
  const guardian = await user('PARENT');
  await db.parentProfile.create({data:{userId:guardian.id,familyId:family.id,relationship:'Guardian',verified:true}});
  await user('ADMINISTRATOR');
  await db.enrollment.create({data:{studentId:student.id,academicYearId:year.id,semesterId:semester.id,gradeLevelId:level.id}});
  await db.curriculum.create({data:{title:'Course guide',courseId:course.id,gradeLevelId:level.id,semesterId:semester.id,published:true,
    units:{create:{title:'Functions',durationWeeks:1,sequence:1,resources:{create:{title:'JavaScript reference',type:'GUIDE',url:'https://developer.mozilla.org/'}}}}}});
  const review = await signIn('TEACHER');
  await review.goto(origin+'/norse-one/review');
  await review.getByLabel('Title',{exact:true}).fill('Functions '+tag);
  await review.getByLabel('Instructions').fill('Explain a parameter.');
  await review.getByLabel('Points possible').fill('10');
  await review.getByRole('button',{name:'Publish assignment'}).click();
  await review.getByText('Functions '+tag,{exact:false}).first().waitFor();
  const page = await signIn('STUDENT');
  await page.goto(origin+'/norse-one/assignments');
  await page.locator('a[href^="/norse-one/assignments/"]').first().click();
  const response = page.locator('textarea');
  await response.fill('A parameter names an input.');
  await page.getByRole('button',{name:'Save Draft'}).click();
  await page.getByText('Your draft has been saved.').waitFor();
  await page.reload();
  await page.waitForFunction(()=>document.querySelector('textarea')?.value === 'A parameter names an input.');
  await page.getByRole('button',{name:/submit/i}).click();
  await page.getByText('Your assignment has been submitted successfully.').waitFor();
  await review.reload();
  await review.getByLabel('Points out of 10').fill('9');
  await review.getByLabel('Feedback').fill('Good explanation.');
  await review.getByRole('button',{name:'Save grade'}).click();
  await review.getByText('No submissions await review.').waitFor();
  await page.goto(origin+'/norse-one/grades');
  await page.getByText('90%',{exact:true}).waitFor();
  await page.getByText('Good explanation.').waitFor();
  await review.goto(origin+'/norse-one/attendance');
  await review.getByLabel('Date',{exact:true}).fill('2026-11-12');
  await review.getByRole('button',{name:'Save attendance'}).click();
  await review.getByText(/2026-11-12.*PRESENT/).waitFor();
  const parent = await signIn('PARENT');
  await parent.goto(origin+'/norse-one/attendance');
  await parent.getByText(/2026-11-12.*PRESENT/).waitFor();
  await parent.goto(origin+'/norse-one/enrollment');
  await parent.getByText('ENROLLED',{exact:true}).waitFor();
  await page.goto(origin+'/norse-one/curriculum');
  await page.getByText('Course guide',{exact:true}).waitFor();
  await page.goto(origin+'/norse-one/resources');
  assert.equal(await page.getByRole('link',{name:'Open resource'}).getAttribute('href'),'https://developer.mozilla.org/');
  await review.goto(origin+'/norse-one/messages');
  await review.getByLabel('Recipient academy email').fill(learner.email);
  await review.getByLabel('Subject',{exact:true}).fill('Feedback ready');
  await review.locator('textarea').fill('Review your new grade.');
  await review.getByRole('button',{name:'Send message'}).click();
  await review.getByRole('heading',{name:'Feedback ready'}).waitFor();
  await page.goto(origin+'/norse-one/messages');
  await page.getByRole('heading',{name:'Feedback ready'}).waitFor();
  await parent.goto(origin+'/norse-one/admissions');
  await parent.getByLabel('Student first name').fill('Future');
  await parent.getByLabel('Student last name').fill('Learner');
  await parent.getByLabel('Requested grade').fill('Grade 6');
  await parent.getByRole('button',{name:'Submit application'}).click();
  await parent.getByText(/Grade 6.*SUBMITTED/).waitFor();
  const admin=await signIn('ADMINISTRATOR');
  await admin.goto(origin+'/norse-one/admissions');
  await admin.getByLabel('Decision').selectOption('ACCEPTED');
  await admin.getByRole('button',{name:'Record decision'}).click();
  await admin.getByText(/Grade 6.*ACCEPTED/).waitFor();
  await parent.reload();
  await parent.getByText(/Grade 6.*ACCEPTED/).waitFor();
} finally {
  await browser.close();
  await db.$disconnect();
}
