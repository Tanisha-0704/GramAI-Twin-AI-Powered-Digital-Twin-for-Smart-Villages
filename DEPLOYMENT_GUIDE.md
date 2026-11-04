# GramAI Twin Deployment Guide

## Deployment status

This repository contains no verified production deployment. The steps below are an operator checklist, not evidence that a hosting provider, domain, production database, or external service is configured. The backend is FastAPI, the frontend is a Vite static build, and the database is PostgreSQL. There is no required Docker setup.

## 1. Prepare the backend

1. Provision PostgreSQL and a least-privilege application account. Keep database credentials in the hosting provider's secret manager.
2. Configure the backend environment using `gramai-twin-backend/.env.example` as the variable reference:
   - Set `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and `DB_NAME`.
   - Set `APP_ENV=production`.
   - Set `CORS_ALLOWED_ORIGINS` to the exact HTTPS frontend origin; do not use `*`.
   - Set `AUTH_COOKIE_SECURE=true` and choose `AUTH_COOKIE_SAMESITE` to match the deployment topology.
   - Set `AUTH_RATE_LIMIT_STORAGE_URI` to a shared `redis://` or `rediss://` service.
   - Configure a persistent private `APPLICATION_STORAGE_ROOT` and malware scanner for uploaded documents.
   - Configure `GEMINI_API_KEY` only if the optional Gemini service is approved for the data being sent.
   - Keep `SEED_SAMPLE_VILLAGES=false`.
3. Install backend requirements in the deployment environment:

   ```powershell
   cd E:\gramai\gramai-twin-backend
   python -m pip install -r requirements.txt
   ```

4. Back up the target database, review the additive SQL migration set, and obtain operator approval before applying it. From the backend directory:

   ```powershell
   python -m app.auth_admin migrate
   ```

   This is an explicit schema operation. Do not run it automatically at application startup or against a production database without approval and a verified backup.
5. Create the initial administrator interactively:

   ```powershell
   python -m app.auth_admin create-admin
   ```

   Use a private terminal and a unique password. There is no default administrator credential.
6. Start the ASGI application behind a TLS-terminating reverse proxy:

   ```powershell
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```

   Configure the process manager, health monitoring, restart policy, request-size limits, and log retention in the hosting environment. Do not expose the backend directly without HTTPS and network controls.

7. Verify `GET /health` and `GET /health/ready` from the intended network. Readiness must report the database as available after migrations.

## 2. Build and host the frontend

1. Configure `VITE_API_BASE_URL` as the public HTTPS API origin before building. This is a public browser setting; never put private keys in `VITE_*` variables.
2. Build the static frontend:

   ```powershell
   cd E:\gramai\gramai-twin-frontend
   npm ci
   $env:VITE_API_BASE_URL = "https://api.example.invalid"
   npm run lint
   npm run build
   ```

3. Publish `dist/` on a static HTTPS host. Configure SPA fallback routing to `index.html`, and configure the backend CORS allowlist to the exact frontend origin.
4. Confirm cookies work across the chosen frontend/API hostnames and that `Secure`, `SameSite`, CSRF, and reverse-proxy origin behavior match the deployment.

## 3. Operational safeguards

- Configure database backup and restore drills using [DATABASE_BACKUP_GUIDE.md](./DATABASE_BACKUP_GUIDE.md).
- Complete [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) before exposing the service publicly.
- Apply future migrations through a reviewed change window with backup, staging verification, and rollback/restore planning.
- Set request quotas for chat, predictions, and CSV import at the gateway or hosting layer; the current application rate limit is for login.
- Keep uploaded application and grievance files on a private persistent volume. Do not serve that volume as static content.
- Treat AI results as advisory. The crop-health model is trained on synthetic demonstration data; the flood and water screens are illustrative rules.
- The scheme workflow records internal review. No external government portal, email/SMS delivery, satellite feed, or external application submission is configured.

## 4. Rollback

There is no automated schema rollback framework. If a deployment or migration fails, stop writes, preserve logs, and follow the approved database restore plan against a verified backup. Do not drop tables or restore over a live database without explicit operator approval.
