# 🛡️ ODIN DIGITAL ACADEMY

### Full-Stack Learning Management System

Odin Digital Academy is a full-stack Learning Management System (LMS) built with modern web technologies. The application demonstrates authentication, PostgreSQL database integration, curriculum management, assignments, grades, attendance, messaging, admissions, resources, and protected student experiences.

## Release status

The student, instructor and family portals use PostgreSQL records. The Academy coursework GitHub Actions workflow runs a fresh migration, builds the application and exercises instructor publishing, draft reload, final submission and grading using two browser sessions. Check the result for the release commit before deploying it.

## 🧰 Technology Stack

- Next.js 16
- React
- TypeScript
- JavaScript
- HTML5
- CSS
- PostgreSQL
- Prisma ORM 7.9.1
- Auth.js / NextAuth
- Node.js
- npm
- Git
- GitHub
- Turbopack
- AWS Amplify

## 🎓 Core Features

### Public Website

- Home
- About
- Admissions
- Application
- Public navigation

### Authentication

- Credential login
- Session handling
- CSRF protection
- Protected routes
- Logout

### Norse One Student Environment

- Dashboard
- Learning
- Assignments
- Grades
- Curriculum
- Attendance
- Messages
- Family
- Resources

### APIs

- Authentication API
- Curriculum API
- Dynamic curriculum API
- Assignment submission API

## Account and deployment setup

Provide DATABASE_URL to the application, DIRECT_URL to Prisma migrations, and a random AUTH_SECRET to the server. Set AUTH_URL to the public HTTPS origin. From the release checkout run `npm ci`, `npx prisma generate`, `npx prisma migrate deploy`, `npm run build` and `npm start`. Configure these values in the hosting service through its protected environment configuration.

Each user needs an ACTIVE User row with an individual bcrypt password hash. A learner needs a linked StudentProfile and classroom membership. Link an instructor's StaffProfile to the course and classroom. A verified ParentProfile links the guardian to the family. The previous shared demo password does not grant access to these records. The browser smoke test creates isolated fixtures only in a disposable local database.

## 🗄️ Database

PostgreSQL provides the application database.

Prisma provides:

- Schema management
- Database relationships
- Migrations
- Prisma Client
- Database configuration

## Hosted verification

Check the public login, a teacher-created assignment, student draft reload, instructor grading and the student's grade page on the deployed hostname. Verify database connectivity, account provisioning and persistence across a restart.

## 👨‍💻 Developer

**Christian Foderingham**

Full-Stack Developer | IT Professional | U.S. Military Veteran

### Development Focus

- Full-stack development
- Front-end engineering
- Back-end engineering
- Database development
- Authentication
- API development
- Systems architecture
- Debugging
- Git/GitHub
- Cloud deployment

## 📜 License

Copyright © 2026 Christian Foderingham.

The Odin Digital Academy source code is not released under an open-source license unless otherwise specified.

Third-party dependencies remain subject to their respective licenses.

---

# 🛡️ ODIN DIGITAL ACADEMY

**Build. Learn. Develop. Advance.**

© 2026 Christian Foderingham — All Rights Reserved.

### Provision accounts and an enrolled classroom

Run `node scripts/provision-classroom.mjs /private/path/roster.json` from the release checkout after migration. Use an operator-controlled roster outside the repository. It assigns guardian access, so verify the family relationship before importing. Use a distinct password environment variable for each new user. Repeating an import preserves an existing account's password. Use distinct course codes per term.

```json
{
  "year": "2026–27", "yearStart": "2026-08-01", "yearEnd": "2027-06-01", "term": "FALL",
  "courseCode": "JS-F26", "courseName": "JavaScript", "subject": "Programming", "level": "GRADE_5", "room": "Lab",
  "teacher": {"email":"instructor@example.test","firstName":"Example","lastName":"Instructor","employeeId":"T01","passwordEnv":"TEACHER_INITIAL_PASSWORD"},
  "students": [{"email":"learner@example.test","firstName":"Example","lastName":"Learner","studentNumber":"S01","passwordEnv":"STUDENT_INITIAL_PASSWORD",
    "guardian":{"email":"guardian@example.test","firstName":"Example","lastName":"Guardian","passwordEnv":"GUARDIAN_INITIAL_PASSWORD"}}]
}
```

An optional `administrator` uses the same email, name and passwordEnv fields as a guardian. Classroom provisioning does not send invitation emails.
