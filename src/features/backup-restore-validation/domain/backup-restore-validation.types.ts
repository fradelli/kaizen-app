export type BackupRestoreFailureCode =
  | "CONFIGURATION_INVALID"
  | "DOCKER_UNAVAILABLE"
  | "MIGRATION_FAILED"
  | "SOURCE_PREPARATION_FAILED"
  | "BACKUP_FAILED"
  | "RESTORE_FAILED"
  | "VALIDATION_FAILED"
  | "CLEANUP_FAILED";

export type BackupRestoreDatabaseTarget = Readonly<{
  service: "database-backup-source" | "database-backup-restore";
  database: "kaizen_backup_source" | "kaizen_backup_restore";
  user: "kaizen_backup";
  port: number;
  connectionString: string;
}>;

export type BackupRestoreConfiguration = Readonly<{
  source: BackupRestoreDatabaseTarget;
  restore: BackupRestoreDatabaseTarget;
}>;

export type RecoveryCanaryIdentity = Readonly<{
  workspaceId: string;
  pairingRateLimitId: string;
  trainingAssignmentId: string;
  trainingExecutionId: string;
  exerciseExecutionId: string;
  setExecutionId: string;
  nutritionAssignmentId: string;
  mealExecutionId: string;
}>;

export type RecoverySnapshot = Readonly<{
  entityCounts: Readonly<Record<string, number>>;
  workspaceCounts: Readonly<Record<string, number>>;
  activePlans: readonly string[];
  canaryRows: readonly string[];
}>;

export type BackupArtifact = Readonly<{
  path: string;
  sizeBytes: number;
  sha256: string;
}>;

export type BackupRestoreValidationReport = Readonly<{
  result: "valid";
  commit: string;
  postgresVersion: string;
  dumpFormat: "custom";
  dumpSizeBytes: number;
  dumpSha256: string;
  backupDurationMs: number;
  restoreDurationMs: number;
  entityCounts: Readonly<Record<string, number>>;
  workspaceCounts: Readonly<Record<string, number>>;
  migrations: "current";
  persistedIntegrity: "valid";
  identitiesPreserved: true;
}>;
