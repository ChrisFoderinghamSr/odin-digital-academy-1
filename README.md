# Odin Digital Academy

Norse One is the academy’s learning and admissions portal. Next.js serves the pages and server actions. Auth.js supplies the session, and Prisma uses PostgreSQL for identities, academic records and submissions.

## Run locally

Use Node 24 or newer and PostgreSQL. Set the variables below in the runtime environment. Prisma CLI loads `.env` using `prisma.config.ts`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Runtime connection for the application. |
| `DIRECT_URL` | Direct connection for Prisma migrations and client generation. |
| `AUTH_SECRET` | Private random signing secret shared by the app and the recovery-link tool. |
| `AUTH_URL` | Canonical HTTPS origin for this environment. |
| `ACADEMY_SUPPORT_EMAIL` | Monitored mailbox displayed on the contact page. |

```sh
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Apply migrations to a fresh development database first. For an existing installation, compare the migration history and schema before deploying. Production secrets belong in the hosting environment.

## Accounts and coursework

Login uses the password hash of an active database user. The old shared demo password and sample IDs have been retired. Provision real accounts before switching traffic. Database accounts created without a password hash require a credential before sign-in.

- **Operator** — Run `node scripts/provision-account.mjs` from a trusted terminal with `ACCOUNT_EMAIL`, `ACCOUNT_PASSWORD`, `ACCOUNT_ROLE`, `FIRST_NAME`, `LAST_NAME` and `DATABASE_URL` supplied through the environment. A new guardian receives a household ID. Supply that `FAMILY_ID` and an `ACADEMIC_LEVEL` when creating a student. Supply an existing family ID only after verifying the relationship.
- **Teacher** — A staff profile must be assigned to an active classroom with enrolled members. The dashboard publishes coursework to that roster, records attendance, sends messages and grades submitted work. Configure the academic year, semester, grade level, subject, course, classroom and membership records before opening a course.
- **Student** — Open Assignments, save a draft, reload it and submit. A submitted answer is locked. A grade records the instructor’s points, the percentage and feedback. Learning and resources follow classroom membership.
- **Guardian** — Sign in with a provisioned parent account, apply for a student and check the household’s admission status. Admission and enrollment are separate records.
- **Administrator** — Review pending applications from the dashboard. Access to decisions and curriculum actions follows the account’s permissions.
- **Recovery** — After independently verifying an account owner, an operator runs `node scripts/issue-recovery-link.mjs account@example.org` in a trusted terminal. Deliver the private link through the academy’s verified channel. The link expires in 15 minutes. Resetting a password invalidates the link and prior sessions.

## Verification and release

```sh
npm run lint
npm run test:workflows
npm run build
```

The workflow test applies the project migration to an isolated PostgreSQL-compatible engine. It exercises student-scoped queries, draft persistence, final submission retries, rejected edits, grading and recovery. The route tests supply controlled sessions. Browser sign-in, real mail delivery and Amplify deployment require separate staging checks.

Before release, sign in to staging as a guardian, teacher, student and administrator. Publish and grade one assignment, check attendance and inbox delivery, submit and review a family application, and test account recovery. Confirm the configured host can reach PostgreSQL and the support mailbox is monitored.

## History

The first commit was [10b2452](https://github.com/ChrisFoderinghamSr/odin-digital-academy-1/commit/10b24525826e9c465925818d777ecd8d2897d522) on August 13, 2026 (UTC). Source headers identify when each file first appeared in Git. The explanations and workflow changes were added in November 2026.

[Previous development-release notes](https://github.com/ChrisFoderinghamSr/odin-digital-academy-1/blob/862770f717525ff04b14a7d278e47862a7579904/README.md)

© 2026 Christian Foderingham. All rights reserved.

## Developer and license

Christian Foderingham — Full-Stack Developer, Software Developer Instructor and U.S. military veteran.

Copyright © 2026 Christian Foderingham. The Odin Digital Academy source code is not released under an open-source license unless otherwise specified. Third-party dependencies remain subject to their respective licenses.
