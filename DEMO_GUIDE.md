# GramAI Twin Demonstration Guide

## Safety and preparation

Use an isolated demo environment and database only. Do not enable sample seeding on a database containing existing users or records. Use fictional test identities and documents, and do not enter citizen personal information.

The sample villages are demonstration records, not validated live observations. The crop-health model uses synthetic data; flood and water results are illustrative rules. There is no external government portal, SMS, email, satellite, or external application-submission integration.

1. Create a separate empty PostgreSQL database and configure a backend environment for it.
2. Apply the reviewed migrations and create an initial administrator interactively, following [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
3. If demonstration village records are desired, enable `SEED_SAMPLE_VILLAGES=true` only for this empty demo database's initial startup, then disable it. Confirm the intended database before starting.
4. Sign in as the administrator and create separate test users for the required roles, each with a valid geographic scope.
5. Configure the required application and grievance workflows. For scheme demonstrations, use only a scheme whose information has been checked against an official source; clearly label any non-official test content as demonstration-only.

## Walkthrough

1. **Administrator — system health and access:** open System Monitoring, confirm database readiness, and review the test-user roles/scopes in User Administration.
2. **Administrator — model and data:** open AI Model Registry to see the single available crop-health demonstration model and its missing evaluation metadata. Review village records and note that measurement timestamps are unavailable.
3. **Sarpanch — village information:** sign in with the scoped Sarpanch account. Check that the dashboard, village map, reports, and village management expose only the assigned village. Attempting an out-of-scope record should not reveal it.
4. **Citizen — scheme catalogue:** sign in with the Local Villager account, inspect available published schemes, and read the eligibility guidance. Eligibility guidance is not an approval.
5. **Citizen — application:** if an authorized, source-verified scheme and its workflow are configured, submit an application using fictional data and a harmless test document. The application is submitted to the GramAI Twin internal workflow only.
6. **Citizen — grievance:** submit a fictional test grievance in a category whose workflow is configured. Use a demo location and harmless test attachment.
7. **Officer — review:** sign in as the responsible scoped officer, open the relevant queues, and perform only actions permitted by the configured workflow. An internal status is not a decision or submission by an external government department.
8. **Citizen — notifications:** return to the citizen account and check the in-app notification for the internal application/grievance update. No SMS or email is sent.
9. **Authorized user — advisory prediction:** open AI Predictions for an authorized village and enter clearly marked demonstration values. Review the submitted inputs, timestamp, method, source, limitations, and advisory explanation. Do not interpret outputs as a validated forecast.
10. **Administrator — audit and report:** inspect audit activity and export the current village report. The report is a snapshot; it has no historical measurement period because village timestamps are not stored.

## Expected limitations

- The demo does not include a validated AI evaluation score, prediction history, live sensor feed, or AI map overlay.
- If no verified scheme or configured workflow is available, stop at that step rather than inventing government information or claiming an application was accepted.
- Do not use the demonstration workflow to make real eligibility, service-priority, or public-safety decisions.
