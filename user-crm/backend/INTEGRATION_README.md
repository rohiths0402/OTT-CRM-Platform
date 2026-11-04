# Loop CRM backend + frontend integration

## Local development

Keep your existing `backend/.env` and database credentials. Do not copy secrets into source control.

### Backend (Windows CMD)

```cmd
cd backend
env\Scripts\activate.bat
python manage.py check
python manage.py showmigrations
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

The backend uses MySQL from `.env`. Back up `loop_crm` before applying the included customer identity and notification migrations.

### Frontend (Windows CMD)

```cmd
cd frontend
copy .env.example .env
npm install
npm run dev
```

The frontend `.env` should contain:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCK_API=false
```

CORS allows both `http://localhost:5173` and `http://127.0.0.1:5173`.

## Employee authentication

- `POST /api/auth/login/` accepts `{ "email": "...", "password": "...", "remember_me": true }`.
- The role is inferred from the highest active role if omitted; the backend returns `access`, `refresh`, `role`, and `user`.
- The frontend stores JWTs and refreshes the access token after a 401 when the refresh token is still valid.
- `POST /api/auth/logout/` blacklists the refresh token.

## CRM endpoints

| Module | Endpoint | Methods |
|---|---|---|
| Subscribers | `/api/subscribers/` | GET, POST, GET detail, PUT/PATCH, DELETE |
| Subscription plans | `/api/plans/` | GET, POST, PUT/PATCH, DELETE |
| Subscriptions | `/api/subscriptions/` | GET, POST, PUT/PATCH, DELETE |
| KYC applications | `/api/kyc/applications/` | GET, POST, detail, PUT/PATCH, DELETE |
| KYC review | `/api/kyc/applications/{id}/review/` | POST |
| Wallets | `/api/admin/wallets/` | GET |
| Wallet adjustment | `/api/admin/wallets/{id}/adjust/` | POST |
| Reward accounts | `/api/admin/rewards/accounts/` | GET |
| Reward adjustment | `/api/admin/rewards/accounts/{id}/adjust/` | POST |
| Viewing sessions | `/api/admin/viewing-sessions/` | GET |
| Engagement analytics | `/api/admin/analytics/engagement/?days=30` | GET |
| Advertising analytics | `/api/admin/analytics/advertising/?days=30` | GET |
| Audience analytics | `/api/admin/analytics/audience/?days=30` | GET |
| Broadcast campaigns | `/api/admin/broadcast/campaigns/` | GET, POST |
| Roles | `/api/admin/roles/` | GET, POST, PUT/PATCH, DELETE |
| Employee role assignments | `/api/admin/employee-roles/` | GET, POST, DELETE |
| Audit logs | `/api/admin/audit-logs/` | GET |
| Command Center overview | `/api/command-center/overview/?days=30` | GET |
| Top content | `/api/command-center/content/top-titles/?days=30` | GET |
| Streaming health | `/api/command-center/streaming/health/` | GET |

All admin APIs require an employee JWT. Access is additionally restricted by role permissions.

## Important behavior and current scope

- The frontend's subscriber, KYC, wallet, rewards, engagement, viewing, broadcast, roles, audit, and dashboard summary services use the backend rather than mock business records.
- List services request all pages in batches of up to 500 records so seeded datasets are not silently limited to the first 25 rows.
- Wallet and reward changes are recorded as transactions and create audit events. The UI exposes adjustment actions; it does not expose arbitrary wallet/reward creation.
- Broadcast currently sends immediately to all subscribers. Scheduled delivery and audience segmentation are not implemented; the UI states this before sending.
- Revenue totals are not shown as real data because the current schema does not provide a verified subscription-payment/settlement ledger. The dashboard labels these metrics unavailable instead of displaying fabricated totals.
- Roles are role-based access groups. A fine-grained per-feature permission matrix is not implemented yet.
- Customer registration/login is separate from employee login. Do not use customer tokens for employee/admin endpoints.

## Verification status

The source files pass Python syntax compilation and the edited frontend source passes JSX/JavaScript parsing. The modified frontend feature modules pass ESLint. Full Vite production build, Django system checks, migrations, MySQL queries, JWT login, and live HTTP endpoint tests must still be run in the user's Windows environment because this packaging environment does not have the project's Windows-native Node dependencies, Django runtime, or access to the user's MySQL database.
