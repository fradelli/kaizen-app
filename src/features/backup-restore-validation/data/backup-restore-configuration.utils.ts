import { BackupRestoreValidationError } from "../domain/backup-restore-validation.error";
import type {
  BackupRestoreConfiguration,
  BackupRestoreDatabaseTarget,
} from "../domain/backup-restore-validation.types";

function readPort(value: string | undefined, fallback: number): number {
  const port = value === undefined || value === "" ? fallback : Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65_535)
    throw new BackupRestoreValidationError("CONFIGURATION_INVALID");
  return port;
}

function createTarget(
  service: BackupRestoreDatabaseTarget["service"],
  database: BackupRestoreDatabaseTarget["database"],
  port: number,
  password: string,
): BackupRestoreDatabaseTarget {
  const url = new URL(`postgresql://kaizen_backup@127.0.0.1:${port}/${database}`);
  url.password = password;
  return { service, database, user: "kaizen_backup", port, connectionString: url.toString() };
}

export function readBackupRestoreConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): BackupRestoreConfiguration {
  const password = environment.BACKUP_DATABASE_PASSWORD;
  if (!password || password.length < 12)
    throw new BackupRestoreValidationError("CONFIGURATION_INVALID");
  const sourcePort = readPort(environment.BACKUP_SOURCE_DATABASE_PORT, 5434);
  const restorePort = readPort(environment.BACKUP_RESTORE_DATABASE_PORT, 5435);
  if (
    sourcePort === restorePort ||
    [5432, 5433].includes(sourcePort) ||
    [5432, 5433].includes(restorePort)
  )
    throw new BackupRestoreValidationError("CONFIGURATION_INVALID");
  return {
    source: createTarget("database-backup-source", "kaizen_backup_source", sourcePort, password),
    restore: createTarget(
      "database-backup-restore",
      "kaizen_backup_restore",
      restorePort,
      password,
    ),
  };
}
