import assert from 'node:assert/strict';
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
} finally {
  await browser.close();
  await db.$disconnect();
}
