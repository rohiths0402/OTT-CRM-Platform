# Loop CRM Backend — Modular Monolith

This package extends the existing authentication and roles apps. It intentionally excludes your `.env`, credentials and virtual environment.

## Architecture

- `authentication`, `roles`: existing identity foundation.
- `core`: shared timestamp model, pagination and role permissions.
- `subscribers`: subscriber profiles and subscriptions.
- `verification`: KYC applications and review workflow.
- `finance`: wallet ledger and atomic balance updates.
- `rewards`: points ledger and atomic redemption.
- `content`: titles and genres.
- `playback`: viewing sessions and playback events.
- `advertising`: advertisers, campaigns and ad events.
- `communication`: in-app notifications.
- `analytics`: daily metrics and streaming telemetry.
- `command_center`: dashboard read APIs.

This is a modular monolith: each business domain is isolated, but the deployment and database remain one Django application.

## Setup

1. Back up your MySQL database.
2. Copy `.env.example` to `.env` and enter credentials locally.
3. Activate your existing virtual environment and install requirements.
4. Run `python manage.py check`.
5. Review migrations before applying: `python manage.py makemigrations` then `python manage.py migrate`.
6. Run `python manage.py test`.

## API routes

- `/api/auth/` — existing authentication routes.
- `/api/subscribers/` — subscriber, subscription and plan routers.
- `/api/kyc/applications/` — KYC applications and `/{id}/review/`.
- `/api/notifications/` — current user's notifications and `/{id}/mark_read/`.
- `/api/command-center/overview/?days=30` — platform overview.
- `/api/command-center/content/top-titles/?days=30` — top titles.
- `/api/command-center/streaming/health/` — latest telemetry in the last 24 hours.

## Important implementation notes

- Wallet and reward services use database transactions and row locks. Never update balances directly from API views.
- Top-title aggregation is performed by MySQL using `GROUP BY`, `SUM` and `ORDER BY`, avoiding loading all playback events into Python.
- The dashboard returns only metrics supported by ingested operational data. Concurrent viewer, CDN and playback health metrics require real telemetry ingestion. Do not populate production dashboards with invented demo numbers.
- Wallet/reward APIs, payments, email/SMS/push delivery, Kafka, Celery, Redis caching, exports, and additional analytics endpoints are intentionally not represented as completed integrations in this starter implementation. Their domain boundaries are scaffolded for the next implementation phase.
- Existing migration 0001 has the historical `oles` field typo. Migration 0002 renames it to `roles`. Review `python manage.py sqlmigrate authentication 0002` and back up your DB before applying.
