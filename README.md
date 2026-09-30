# Job Portal (MERN)
Roles: candidate, employer, admin. Features: job listings/applications, resume parsing + job matching, dashboards, admin moderation.

## Run
```
cd server && cp .env.example .env && npm i && npm run dev     # :5000
cd client && npm i && npm run dev                              # :5173
```
Create an admin: register normally, then in MongoDB set `role: "admin"` on that user.
New jobs are "pending" until an admin approves them.

LinkedIn profile import: on LinkedIn open your profile, click More > Save to PDF, then upload that PDF as your resume. Skills are parsed automatically.
