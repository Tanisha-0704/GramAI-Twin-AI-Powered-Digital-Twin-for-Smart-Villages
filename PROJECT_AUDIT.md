# GramAI Twin Project Audit

## Scope and verification

Reviewed the backend application, its six SQL migration files and API tests; the React application routes, API client, pages and shared components; project manifests; and the existing setup/deployment notes. Dependency folders, generated build output, the local database, `.env` contents, and private uploaded documents were not inspected.

Verification after the changes in this audit:

- Backend: `..\.venv\Scripts\python.exe -m pytest -q` — **49 passed**, with three dependency deprecation warnings.
- Frontend: `npm run lint` — **passed**.
- Frontend: `npm run build` — **passed** without the previous >500 kB chunk warning after route-level code splitting; the largest emitted page chunk is about 405 kB.
- The backend-local `venv` does not contain pytest; the repository-level virtual environment does and was used for the successful test run.
- No frontend test runner or browser/UI test suite is configured.

## Implemented

- FastAPI backend and React/Vite frontend with an API client configured through `VITE_API_BASE_URL`.
- Server-side session authentication, Argon2id password hashing, CSRF checks, cookie configuration, login throttling, and five roles with geographic scope checks.
- Village CRUD, scoped village/map/report reads, CSV import validation and duplicate skipping, and transactional inserts.
- GIS village and authorized grievance views; government schemes, eligibility guidance, bookmarks, applications and private documents; grievance workflows and private attachments.
- In-app notifications, administrator audit/monitoring pages, role-specific route guards, and an AI assistant that receives the authenticated user's authorized village records.
- One crop-health classifier loaded from a checked-in artifact and documented synthetic training data. Flood-risk and water-scarcity screening use explicit illustrative rules.
- Prediction responses now include the generated UTC time, submitted parameters, method, data source, result explanation, and uncertainty limitation; results remain on-demand and are not persisted.
- An administrator-only model registry lists the single available crop-health classifier and reports its synthetic dataset, unrecorded training date/version, and unavailable evaluation metrics without fabricating values.
- An administrator-only data-quality summary reports current village counts, invalid and duplicate records, missing required text values, and the latest import audit time/counts. Uploaded filename and upstream source are not retained.
- Village reports now identify their current-snapshot period/source and return missing average water as `null`; the frontend displays an explicit no-data state.
- Frontend page routes are code-split, and the production build no longer emits the prior >500 kB bundle warning.
- Standalone deployment, backup, production checklist, demonstration, and model-evaluation guides were added.
- Six additive, explicit SQL migrations. Existing schema changes are not automatically applied at startup; fresh-database village bootstrap remains in the application.
- A 49-test backend suite covers authentication, authorization, village CRUD, schemes, applications, grievances, notifications, audit, import, reports, predictions, chat, readiness, CORS, model registry access, and import-quality summaries.

## Incomplete relative to the requested product scope

- Prediction is on-demand and not persisted. The form accepts user-entered environmental values; it does not establish that they are current sensor observations. There is no prediction-history API or GIS prediction layer.
- AI predictions cover one synthetic-data crop classifier and two illustrative rules. Public-service, electricity, road, and broader water/disaster models are not supported by the current data. The current model registry is descriptive only; training/evaluation metrics are not retained as a versioned evaluation report.
- GIS has registered village locations and an authorized grievance layer, but no available AI prediction layers. Saved village flood/crop labels are not timestamped observations or forecasts.
- Reports currently provide a live village snapshot and CSV export with explicit period/source labels. There are no date-range filters, application/grievance/officer/prediction reports, charts, or PDF export. Village records have no observation/update timestamps, so historical reporting cannot be implemented honestly without new data.
- CSV import does not offer a preview. The data-quality page reports aggregate checks and latest import time/counts, but cannot identify the uploaded filename/upstream source or inspect historical changes.
- The database has no electricity, historical environmental observations, or model/prediction history tables. Water is represented as a percentage and should not be treated as a measured volume.
- There are six hand-managed SQL migrations, not an Alembic revision framework. New operational documentation is in `DEPLOYMENT_GUIDE.md`, `DATABASE_BACKUP_GUIDE.md`, `PRODUCTION_CHECKLIST.md`, `DEMO_GUIDE.md`, and `AI_MODEL_EVALUATION.md`.
- No live deployment, production database, external government submission, messaging provider, satellite service, or validated production AI model is configured.

## Broken or fragile findings

- No broken API route was confirmed in the active route table. The monitoring frontend path matches the administrator-only backend endpoint.
- The initial audit found an unreachable chat page with invalid relative imports, two unused duplicate chatbot implementations, and an empty predictions page. These were removed after confirming there were no references; active routes remain `AIAssistant.jsx` and `AIPrediction.jsx`.
- No broken API route was confirmed in the active route table. Frontend/browser navigation is not covered by automated UI tests.

## Duplicate functionality

- The unreachable duplicate chat implementations, associated exclusive stylesheet, and empty prediction page were removed. The active pages are `AIAssistant.jsx` and `AIPrediction.jsx`.
- Backend ORM models are intentionally split by domain (`db_models`, `auth_models`, `scheme_models`, and others); no duplicate database table definition was established by this audit.

## Security review

### Controls observed

- Authentication identity and role are checked by FastAPI rather than trusted from React state. Role and geographic-scope restrictions are tested for sensitive reads and writes.
- Session tokens are opaque and stored hashed; unsafe browser requests require CSRF validation; login is rate-limited; production configuration requires secure cookies and shared Redis-backed rate limiting.
- CORS requires explicit origins; private application/grievance uploads have size/type checks and private download routes; missing malware scanning is represented as `NOT_SCANNED`.
- Chat and map data are scoped server-side. The assistant prompt treats stored values as untrusted data and does not receive uploaded private documents.
- `.env.example` contains placeholders and the frontend template warns that `VITE_*` values are public.

### Residual concerns

- The optional upload scanner may be unconfigured, leaving files marked `NOT_SCANNED`; production storage permissions, scanning, quotas, backups, and monitoring remain operator responsibilities.
- Shared API request quotas for chat, prediction, and CSV import are documented as deployment-layer work; only login has an application-level rate limit.
- The hand-run migration process needs a reviewed, versioned migration framework and an operational rollback/restore procedure before production use.
- Repository metadata was unavailable in the workspace, so tracked-file status and secret-history exposure could not be verified. No `.env` values were read.

## Database concerns

- PostgreSQL is the configured application database. Tests use an isolated in-memory SQLite database and do not validate production PostgreSQL migrations or operational behavior.
- `VillageDB` has no record timestamp, source, or measurement timestamp. This prevents defensible freshness metrics and historical reports.
- CSV import checks duplicates in application code and skips duplicates, but the village table does not enforce a unique normalized `(name, district, state)` key; concurrent imports can still race.
- Schema evolution is through six explicit SQL scripts and a command-line migration utility rather than Alembic. Do not run migrations against a live database without an approved backup and operator authorization.
- Existing records are not deleted by the inspected migration workflow. No production database operation was performed.

## Remaining recommended work

1. Add observation timestamps, data-source provenance, and safe import preview before implementing historical filters or freshness claims.
2. Plan prediction history, model version/evaluation artifacts, and GIS prediction layers only after their data ownership, retention, validation, and access rules are defined.
3. Add report categories and frontend/browser role-based tests; backend test coverage does not replace end-to-end UI verification.
4. Consider a reviewed Alembic migration framework and enforce normalized village uniqueness after safely assessing existing records.
5. Complete the production checklist and verify PostgreSQL migrations, upload scanning/storage, and backup restoration in staging before deployment.
