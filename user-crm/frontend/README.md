# Loop User CRM Frontend

React + Vite frontend for the Loop User CRM workspace.

## Requirements

- Node.js 20.19+ (or a compatible newer LTS release)
- npm

## Run locally

From this directory (the folder containing `package.json`):

```bash
npm install
npm run dev
```

Build the production bundle:

```bash
npm run build
```

## Environment

Create a `.env` file if you want to point login and password-reset requests to a different backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_AUTH_LOGIN_PATH=/auth/login/
VITE_AUTH_FORGOT_PASSWORD_PATH=/auth/password-reset/
```

The login and password-reset forms call the configured API. The CRM modules currently use clearly illustrative frontend mock data; they are not connected to live subscriber, KYC, wallet, reward, viewing or advertising endpoints.

## Included modules

- Dashboard
- Subscriber Management
- KYC Verification
- Wallet Management
- Reward Points
- User Engagement
- Viewing History
- OTT Ad Analytics
- Campaign Management
- Notifications
- Roles & Permissions
- Audit Logs
- Settings

The admin modules share a reusable table page with client-side search, status filtering, pagination, record details, CSV export and local mock add-row interactions. KYC rows also include mock approve/reject actions. Settings changes are local to the current page session and are not persisted to a backend.

## Authentication notes

- Successful `admin` and `super_admin` logins redirect to `/admin` (the dashboard).
- `employee` logins redirect to `/employee`.
- The authenticated user is kept in browser storage according to the Remember me selection.
- Sign out clears the stored user and returns to `/login`.

Backend token/session handling must be aligned with the actual API response and security design before production deployment.
