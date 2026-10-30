# Rajini - Celebrity CRM (frontend)

React + Vite + Tailwind CSS v4.

## Setup

```
npm create vite@latest . -- --template react
npm install react-router-dom lucide-react react-icons axios @react-oauth/google
npm install tailwindcss @tailwindcss/vite
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Mock mode

`VITE_USE_MOCK=true` skips the backend. Use any 10 digit mobile number starting 6-9 and OTP `123456`.
Email login: any valid email with password `Celeb@123`.
Google button works in mock mode too once `VITE_GOOGLE_CLIENT_ID` is set.

## Backend contract (for the Spring Boot developer)

- POST /auth/login { email, password } -> { user } and sets an httpOnly session cookie
- POST /auth/otp/send { mobile } -> 200
- POST /auth/otp/verify { mobile, otp } -> { user } and sets an httpOnly session cookie
- POST /auth/google { code } -> { user } and sets an httpOnly session cookie
- POST /auth/logout -> 200

Only invited celebrities and managers should be allowed to sign in. Return `{ "message": "..." }` on errors.
