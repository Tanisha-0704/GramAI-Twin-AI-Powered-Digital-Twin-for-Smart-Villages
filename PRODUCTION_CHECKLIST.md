# GramAI Twin Production Checklist

Do not treat this checklist as proof of deployment. Mark an item complete only after recording the responsible operator and verification evidence.

## Environment and access

- [ ] Production PostgreSQL is provisioned with a least-privilege application account.
- [ ] Secrets are supplied by a protected runtime secret manager; no credentials are committed or embedded in the frontend.
- [ ] `APP_ENV=production`, `AUTH_COOKIE_SECURE=true`, and exact HTTPS origins are configured.
- [ ] `AUTH_RATE_LIMIT_STORAGE_URI` points to shared Redis; Redis availability and failure behavior are monitored.
- [ ] The public frontend build uses the correct HTTPS `VITE_API_BASE_URL`.
- [ ] HTTPS, reverse-proxy headers, secure cookies, CSRF, CORS, and SPA fallback behavior have been verified.
- [ ] The first administrator was created interactively; no default or shared administrator password exists.
- [ ] Each role has a named owner and only the required village/block/district scope.

## Database and files

- [ ] SQL migrations were reviewed, backed up, and applied by an authorized operator.
- [ ] Migration behavior was tested against a staging PostgreSQL database with a representative backup.
- [ ] Backup encryption, retention, access, and restore drills are documented and verified.
- [ ] Private upload storage is persistent, access-controlled, excluded from static hosting, and included in backup/restore planning.
- [ ] Upload size/type limits, malware-scanner configuration, and the `NOT_SCANNED` state are understood and monitored.
- [ ] No destructive cleanup or demo seeding is enabled on a database containing real records.

## Security and operations

- [ ] Gateway or application-layer request quotas cover login, chat, predictions, CSV import, and uploads.
- [ ] Logs exclude passwords, session/CSRF tokens, private document contents, and unnecessary personal data.
- [ ] Database, API, Redis, disk, upload, and backup failures trigger actionable alerts without exposing internal details.
- [ ] `GET /health` and `GET /health/ready` are monitored from appropriate networks.
- [ ] Dependency and artifact review, vulnerability response, and patch procedures are established.
- [ ] AI-provider use and data transfer have been approved; no private application documents are supplied to the assistant.

## Data, AI, and user experience

- [ ] Village values, coordinates, units, and source records are verified by an authorized data owner.
- [ ] Synthetic demonstration data is excluded from production records.
- [ ] The crop-health model is labeled synthetic and unvalidated; no fabricated metric or automated government decision is presented.
- [ ] Flood and water results are labeled illustrative rules, not forecasts or scientific risk assessments.
- [ ] Missing measurement dates are visible; no stale registry value is presented as a live observation.
- [ ] Scheme information is checked against official sources by authorized reviewers before publication.
- [ ] The application makes no claim that an external application, complaint, or government referral was submitted unless a real integration confirms it.

## Release validation

- [ ] Backend tests pass in the intended release environment.
- [ ] Frontend lint and production build pass; the current bundle-size warning has been reviewed.
- [ ] Role-based access has been manually verified for villager, Sarpanch, Block Officer, Higher Official, and System Administrator accounts.
- [ ] Login/logout, forms, uploads, notifications, map, reports, and error/empty states have been checked in supported browsers and mobile layouts.
- [ ] A staged backup restore and incident rollback exercise has completed.
- [ ] Deployment URL, owner, release version, incident contact, and maintenance window are recorded.
