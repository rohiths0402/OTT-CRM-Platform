# Celebrity CRM

Celebrity profiles, talent managers, contracts, brand endorsements, shooting schedules, OTT projects, payments and performance analytics.

## Tech

- Backend: Spring Boot, Java 21, Spring Security (session login), Spring Session JDBC, JPA/Hibernate, MySQL 8, Maven
- Frontend: React (Vite), Tailwind CSS, framer-motion, axios
- Backend port 8083, frontend port 5173

## Run

Backend (folder `backend`):

1. Create a MySQL database named `celebrity_crm`.
2. Add your own database password and keys in `src/main/resources/secrets.properties` (this file is not committed).
3. Run `mvn spring-boot:run`. The tables are created automatically on first start.

Frontend (folder `frontend`):

1. Create `.env` with `VITE_API_URL=http://localhost:8083/api`
2. Run `npm install` and then `npm run dev`

Every table is keyed by `user_id`, so each login only sees its own data.

## Database tables

| Table | What it stores |
| --- | --- |
| staff_users | Logins (name, email, password hash, role) |
| celebrity_profiles | Profile details and primary manager |
| profile_photos | Profile photo |
| schedule_events | Shoots, meetings, brand events and offers, with call and wrap times, pickup and look details |
| projects | Films and series with status, progress, money and poster |
| project_members | Team members of a project |
| contracts | Contracts with status, terms, and the signature (signed_by, signed_at, signature_data) |
| deals | Brand deals |
| payments | Money to receive, with status and settlement details |
| sent_payments | Payments sent to other people |
| notifications | In-app notifications |
| photos | Uploaded photos |
| team_members | Team contacts (agents, publicists and others) |
| manager_tasks | Follow-up tasks for managers |
| spring_session, spring_session_attributes | Login sessions |

## API

All endpoints except login need a signed-in session.

Auth, `/api/auth`
- `POST /login`, `POST /logout`, `GET /me`
- `POST /password/forgot`, `/password/verify`, `/password/reset`, `/password/change`
- `POST /otp/send`, `/otp/verify`, `/otp/firebase`
- `POST /google`

Dashboard and profile
- `GET /api/dashboard`
- `GET /api/profile`, `PUT /api/profile`

Schedule, `/api/schedule`
- `GET`, `POST`, `PUT /{id}`, `DELETE /{id}`
- `PUT /{id}/accept`, `PUT /{id}/decline`

Projects, `/api/projects`
- `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}`

Contracts, `/api/contracts`
- `GET`, `POST`, `PUT /{id}`, `DELETE /{id}`
- `PUT /{id}/sign`

Brand deals, `/api/deals`
- `GET`, `POST`, `PUT /{id}`, `DELETE /{id}`

Payments, `/api/payments`
- `GET`, `PUT /{id}/settle`
- `GET /sent`, `POST /sent`
- Razorpay test mode: `POST /{id}/razorpay/order`, `POST /{id}/razorpay/verify`

Talent managers, `/api/managers`
- `GET /team`, `POST /team`, `DELETE /team/{id}`
- `GET /tasks`, `POST /tasks`, `PUT /tasks/{id}/toggle`, `DELETE /tasks/{id}`

Performance analytics
- `GET /api/analytics` returns money received, pending payments, brand pipeline, deal list and project and contract counts

Notifications, `/api/notifications`
- `GET`, `PUT /{id}/read`, `PUT /read-all`

Photos, `/api/photos`
- `GET`, `POST` (multipart), `GET /{id}/image`, `DELETE /{id}`

## Security notes

- Passwords are stored as BCrypt hashes.
- Keys and passwords (database, Google, mail, Razorpay) are kept in `secrets.properties`, which is not committed.
- Razorpay is used in test mode only.