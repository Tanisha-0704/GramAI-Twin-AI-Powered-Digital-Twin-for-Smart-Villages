# GramAI Twin Frontend

GramAI Twin is a React and Vite frontend for village records, map exploration, predictions, and the AI assistant.

## Configuration and access

Set `VITE_API_BASE_URL` in `.env.local` to the backend's public API origin. The value is public because Vite embeds `VITE_*` variables in the browser bundle; never put API keys or other secrets in frontend variables.

The login chooser is at `/`, with dedicated portal entry points at `/login/villager`, `/login/sarpanch`, `/login/block-officer`, `/login/higher-official`, and `/login/admin`. All five use the same authentication provider and `/auth/login` endpoint. A requested portal is only checked against the role loaded from the database; it never grants permissions. Every role uses the existing shared `/dashboard`, which is populated by the authenticated user's backend-enforced geographic scope. Login uses an HttpOnly session cookie; the API enforces authentication and CSRF checks. Administrator-created and reset passwords are temporary and require a change at `/change-password` before other authenticated features are available. Password recovery is not self-service: contact an administrator, who can perform the existing account reset workflow; no email/SMS delivery is configured. Usernames are trimmed and case-insensitive; accepted characters are ASCII letters, digits, `.`, `_`, and `-` (3-128 characters). There is no public registration. Create the first administrator through the backend's `python -m app.auth_admin create-admin` command after applying its auth migration. Do not expose the application publicly until HTTPS, secure cookies, a production origin allowlist, and request throttling are configured.

## User administration

The System Administrator's User Administration navigation opens `/admin/users`. It uses the existing `/auth/users` endpoints for database-backed role/status statistics, geographic filters, pagination, profile details, account lifecycle changes, and audit activity. Account creation requires a confirmed initial password and forces its change at first sign-in. Role and geographic validation and all privileged actions are enforced by the backend. The platform currently uses fixed server-side roles rather than per-user editable permission grants. Password resets are manual administrator-set resets because no email delivery or reset-token provider is configured; reset operations revoke active sessions and force a new password at the next sign-in.

## AI Model Registry

System Administrators open AI Model Registry at `/admin/models`. The page uses the database-backed `/admin/ai/models` API for statistics, search and filtering, pagination, model details, artifact health, evaluation results, and version history. It can register versions only for implementations already allowlisted by the backend, run the trusted crop-health holdout evaluation, and activate or deactivate versions with audit logging. New versions require explicit administrator approval; classification models also need a stored holdout evaluation before approval. No model files can be uploaded or selected by filesystem path. The current crop-health classifier is trained on synthetic demonstration data; its holdout metrics are not field validation. Flood-risk and water-scarcity entries are rule-based screens, not ML forecasts. Gemini configuration is shown without a network probe or a claim that the service is reachable. Prediction results are not persisted and no history is fabricated. Version records presently reference the same trusted artifact.

## Village profiles

The digital-twin profile displays the village record fields currently returned by the backend: identity, population, recorded water percentage, crop-status label, flood-risk classification, and coordinates. The profile shows the source and indicates that observation dates are not provided by the API.

Infrastructure records, historical observations, satellite analysis, and saved prediction results are not currently available. Profile follow-ups are simple rules applied to saved flood-risk and crop-status labels; they are not AI predictions and do not produce a combined risk score or confidence estimate. The on-demand crop-health endpoint uses a demo model trained on synthetic data and is not a validated real-world forecast.

The authenticated prediction form submits `village`, `water`, `rainfall`, `temperature`, `humidity`, `soil_moisture`, and `crop` to `POST /prediction/`. Crop choices match the model's synthetic training classes: Bajra, Maize, Mustard, Rice, and Wheat. Prediction results show the supplied input values, generation time, method, data-source limitations, and an explanation. The crop-health confidence is not scientifically estimated; flood and water results are illustrative threshold rules. System administrators can inspect the available model and evaluation metadata in AI Model Registry, and review aggregate village validation/import counts in Data Quality. Neither page fabricates missing evaluation metrics or import provenance.

Reports are current registry snapshots and explicitly indicate that measurement timestamps are unavailable. Historical date filters are not supported by the current data model.

## Government schemes

The administrator's Government Schemes navigation item opens `/schemes/manage`, backed by the existing authenticated `/schemes/manage` API and PostgreSQL scheme tables. The management view provides database-derived status counts, server-side search/filter/sort/pagination, draft creation, editing, reviewer assignment, source verification workflow, publication, unpublishing, and archival. Archival is a soft lifecycle transition; scheme/application history is not deleted. The citizen catalogue remains available at `/schemes` and displays only verified, published records.

Authorized Block Officers, Higher Officials, and System Administrators use the separate `/schemes/review` workspace for scoped queues, review history, filters, and lifecycle statistics. An assigned Higher Official can approve verification, return a scheme to Draft for correction, or reject it into a distinct terminal Rejected state. A Block Officer can add review notes but cannot decide verification. Only a System Administrator can publish, unpublish, or archive. Workflow changes create in-app notifications and shared audit/revision records. Scheme details and benefits must be entered from verified official sources; no sample schemes are presented as actual government programs.

## Notifications

The Notifications navigation opens the authenticated notification centre. It supports category/read-state filters, search, sorting, pagination, read/unread actions, mark-all-read, and per-user dismissal. Related scheme, application, and grievance pages are checked through their authenticated APIs before opening. The header preview and sidebar badge use the same backend unread count; counts refresh every 30 seconds and when the page regains focus. Real-time push delivery is not configured.

## Updates and activity

Authenticated users can read administrator-published system updates from System Updates. System administrators use Updates & Activity to search and filter the existing append-only audit timeline, inspect allowlisted event details, export the current filtered set as CSV, and create, edit, publish, or archive announcements. Publishing an announcement creates a persistent in-app notification for each active account. The activity timeline contains only events actually recorded by the backend; prediction inputs and results are not persisted.

## System monitoring

System Monitoring is available to System Administrators and refreshes every 30 seconds while the page is visible, with manual refresh and 15-minute, 1-hour, and 24-hour API/error windows. It displays measured host/process resource snapshots, a read-only database probe, bounded API request samples, sanitized errors, integrated service checks, threshold alerts, and current database record counts. Resource/error/alert telemetry is held in bounded memory by each backend process and is not shared across replicas. CPU/memory history charts and error resolution actions are not shown because those histories and workflows are not implemented. AI provider availability is not probed and no external API credits are consumed.

## Development

Install frontend dependencies with `npm install`. If `.env.local` does not already exist, copy `.env.example` to it; otherwise add/update `VITE_API_BASE_URL` without overwriting existing local settings. Then start the Vite development server with `npm run dev`. The API client defaults to `http://localhost:8000`; use the same site hostname for the frontend and API during local cookie-based development.

Run `npm run lint` for ESLint checks and `npm run build` to create the production bundle.
