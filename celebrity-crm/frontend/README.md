# Rajini - Celebrity CRM (frontend)

React + Vite + Tailwind CSS v4.

## Run on Windows

From the repository root in PowerShell:

```powershell
Set-Location .\celebrity-crm\frontend
npm install
npm run dev
```

Open http://localhost:5173. Use Node.js 20.19+ or 22.12+.

## Mock mode

`VITE_USE_MOCK=true` skips the backend and Firebase.

- Email login: any valid email with password `Celeb@123`
- Mobile OTP and forgot password OTP: any valid number or email, code `123456`

Brand deals, contracts, incoming settlements and payment history use sample
data and reset when the dashboard is refreshed. Profile details are saved in
the browser's signed-in account. "Make a payment" opens a UPI app link; the
transfer itself is authorized in that app, and a UTR is needed to add it to the
session's Sent history. The signature pad is a visual demo, not a legally
binding e-signature service.

Set `VITE_USE_MOCK=false` and fill the Firebase and Google values to use the real backend.

## Backend contract

Every login request also carries `rememberMe` (boolean). When true, issue a long lived cookie (for example 30 days), otherwise a session cookie.

- POST /auth/login           { email, password, rememberMe }   -> { user } + httpOnly cookie
- POST /auth/otp/firebase    { idToken, rememberMe }           -> { user } + httpOnly cookie
- POST /auth/google          { code, rememberMe }              -> { user } + httpOnly cookie
- POST /auth/logout                                            -> 200

Forgot password:

- POST /auth/password/forgot { identifier, channel }           -> 200 if the account exists in the database. channel is EMAIL or MOBILE. For EMAIL the backend emails a 6 digit code. For MOBILE the frontend sends the SMS through Firebase after this check passes.
- POST /auth/password/verify { channel, identifier, otp }      -> { resetToken } for EMAIL
- POST /auth/password/verify { channel, identifier, idToken }  -> { resetToken } for MOBILE (verify the Firebase token and match the phone number)
- POST /auth/password/reset  { resetToken, newPassword }       -> 200. Validate the rules again on the server, store a BCrypt hash, end old sessions.

Change password (signed in, from the Security tab):

- POST /auth/password/change { currentPassword, newPassword } -> 200. Check the current password, validate the rules, store a BCrypt hash.

Password rules: at least 6 characters, one capital letter, one number, one special character.

Errors return `{ "message": "..." }` and the message is shown to the user.