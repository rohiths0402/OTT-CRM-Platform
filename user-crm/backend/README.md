# Loop CRM Backend

Django REST Framework modular monolith for OTT customer operations and the internal CRM command center.

## Identity separation

- `apps.authentication`: existing CRM employee accounts, roles and employee JWT endpoints.
- `apps.customers`: independent OTT customer accounts, customer registration/login and customer-scoped JWT authentication.
- `apps.subscribers`: OTT subscriber lifecycle, connected to exactly one customer (or a legacy employee-linked row retained for migration compatibility).

Customer JWTs must be sent to `/api/customer/*` and customer KYC endpoints. Employee JWTs continue to be used for `/api/auth/*`, CRM subscriber administration, KYC review, notifications and Command Center APIs.

## Setup (Windows CMD)

```cmd
copy .env.example .env
```

Edit `.env` locally with your database credentials and a new secret key. Do not commit `.env`.

```cmd
env\Scripts\activate.bat
python -m pip install -r requirements.txt
python manage.py check
python manage.py migrate
python manage.py test
python manage.py runserver
```

Back up your existing database before migrations. Do not run `makemigrations` blindly; the package includes `customers.0001_initial`, `subscribers.0002_customer_identity`, and `communication.0002_customer_notifications`.

## API quick reference

### CRM employee APIs (existing auth preserved)

- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `POST /api/auth/users/` (Super Admin)
- `/api/subscribers/`, `/api/subscriptions/`, `/api/plans/`
- `/api/kyc/applications/` and `/api/kyc/applications/{id}/review/`
- `/api/notifications/`
- `/api/command-center/overview/?days=30`
- `/api/command-center/content/top-titles/?days=30`
- `/api/command-center/streaming/health/`

### OTT customer APIs

All customer endpoints below (except registration/login and public content) use the customer access token in `Authorization: Bearer <token>`.

- `POST /api/customer/register/` — accepts `email`, `fullName`, `phone`, `password`; creates Customer, Subscriber, Wallet and RewardAccount atomically.
- `POST /api/customer/login/` — accepts `email`, `password`.
- `GET/PATCH /api/customer/me/`
- `GET /api/customer/wallet/` — own balance and recent ledger entries (read-only).
- `GET /api/customer/rewards/` — own points and ledger entries (read-only).
- `GET /api/customer/subscriptions/` — own subscription history.
- `POST /api/customer/subscriptions/purchase/` — body `{ "planId": 1 }`; charges the wallet and activates a plan in one database transaction. This is wallet-funded, not a payment-gateway integration.
- `GET /api/customer/viewing-history/` — own viewing history.
- `GET/POST /api/kyc/my-application/` — own KYC applications.
- `GET /api/customer/notifications/` and `POST /api/customer/notifications/{id}/read/`.
- `GET /api/content/titles/` — published content catalogue.

## API naming

Customer-facing JSON uses camelCase (`fullName`, `planId`, `watchedSeconds`). Django/Python internals use standard snake_case. Existing employee auth request/response contracts are preserved.

## Current boundaries / production work still required

This code package is an integration baseline, not a production certification. Before public launch, add email/OTP verification and password reset, customer refresh-token rotation/revocation, payment gateway and signed webhook settlement, secure KYC object storage and malware scanning, trusted playback-event ingestion, provider integrations for email/SMS/push, audit coverage, monitoring, rate-limit review, load tests, deployment secrets and backups. Wallet balance changes must only be performed by trusted payment/settlement services; no customer-facing API permits arbitrary credits.

The Command Center only reports data present in operational tables. Streaming telemetry and ad events must be ingested from real systems; no demo values are fabricated.
