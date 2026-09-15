import type {
  BackupArtifact,
  BackupRestoreValidationReport,
  RecoveryCanaryIdentity,
  RecoverySnapshot,
} from "../domain/backup-restore-validation.types";

export type LocalBackupRestoreValidationDependencies = Readonly<{
  startEnvironment(): Promise<void>;
  prepareSource(): Promise<{ commit: string; canary: RecoveryCanaryIdentity }>;
  assertSourceIntegrity(commit: string): Promise<void>;
  readSourceSnapshot(canary: RecoveryCanaryIdentity): Promise<RecoverySnapshot>;
  createBackup(): Promise<BackupArtifact>;
  assertRestoreTargetEmpty(): Promise<void>;
  restoreBackup(artifact: BackupArtifact): Promise<void>;
  assertRestoredMigrationsCurrent(): Promise<void>;
  readRestoredSnapshot(canary: RecoveryCanaryIdentity): Promise<RecoverySnapshot>;
  assertRestoredIntegrity(commit: string): Promise<void>;
  readPostgresVersion(): Promise<string>;
  cleanup(): Promise<void>;
  now(): number;
}>;

export type LocalBackupRestoreValidation = (
  dependencies: LocalBackupRestoreValidationDependencies,
) => Promise<BackupRestoreValidationReport>;
