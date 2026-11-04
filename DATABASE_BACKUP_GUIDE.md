# GramAI Twin Database Backup and Restore Guide

## Scope

The application uses PostgreSQL. These commands are operational examples; validate them against the installed PostgreSQL client version and the target environment. Do not put database passwords in command arguments, source files, or this guide. Use a protected local credential mechanism or the hosting provider's secret manager.

## Create a backup

1. Confirm the target database name and host with the database operator.
2. Choose a protected destination with sufficient space and access controls.
3. Run `pg_dump` from PowerShell:

   ```powershell
   pg_dump --format=custom `
     --host=$env:DB_HOST `
     --port=$env:DB_PORT `
     --username=$env:DB_USER `
     --dbname=$env:DB_NAME `
     --file=".\gramai_twin_backup.dump"
   ```

4. Confirm the command succeeded and the file is non-empty. Record the backup timestamp, database identifier, operator, and applicable retention policy without recording credentials.
5. Encrypt and transfer the backup only through approved protected storage. Restrict access because the database may contain personal data and audit records.

## Verify a backup safely

Perform restore checks in a separate, empty verification database. Confirm the target name before creating it. Never use `pg_restore --clean` against a live database.

```powershell
createdb --host=$env:DB_HOST --port=$env:DB_PORT --username=$env:DB_USER gramai_twin_restore_check
pg_restore --no-owner --host=$env:DB_HOST --port=$env:DB_PORT --username=$env:DB_USER --dbname=gramai_twin_restore_check .\gramai_twin_backup.dump
```

Run application readiness checks and representative read-only queries against that verification database. Coordinate with an operator to remove the verification database when the test is complete; do not remove a database based only on a guessed name.

## Restore procedure

1. Obtain explicit approval, identify the exact destination, and preserve a fresh backup of its current state.
2. Prefer restoring to a new database and validating it before planning any cutover.
3. For an approved restore to an empty target, use:

   ```powershell
   pg_restore --no-owner --host=$env:DB_HOST --port=$env:DB_PORT --username=$env:DB_USER --dbname=$env:DB_NAME .\gramai_twin_backup.dump
   ```

4. Verify schema, migration state, representative application reads, private-file references, and the health/readiness endpoints before resuming writes.
5. Keep the prior database and backup until the responsible operator confirms the restore and retention plan.

## Migration and recovery notes

- The repository has six explicit additive SQL migrations and a CLI migration command. The project does not currently use Alembic or provide an automated rollback command.
- Back up and verify recovery before applying a migration. Apply and validate migrations in staging first.
- The application has a separate private file-storage directory for uploaded documents. A database backup alone does not back up those files; coordinate a consistent protected backup of the configured storage volume.
- Tests use in-memory SQLite and do not verify PostgreSQL backup/restore behavior.
