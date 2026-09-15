import { assertRecoverySnapshotsMatch } from "../domain/backup-restore-snapshot.rules";
import type { BackupRestoreValidationReport } from "../domain/backup-restore-validation.types";
import type { LocalBackupRestoreValidationDependencies } from "./validate-local-backup-restore.types";

export async function validateLocalBackupRestore(
  dependencies: LocalBackupRestoreValidationDependencies,
): Promise<BackupRestoreValidationReport> {
  let operationFailed = false;
  try {
    await dependencies.startEnvironment();
    const { commit, canary } = await dependencies.prepareSource();
    await dependencies.assertSourceIntegrity(commit);
    const sourceSnapshot = await dependencies.readSourceSnapshot(canary);
    const postgresVersion = await dependencies.readPostgresVersion();
    const backupStartedAt = dependencies.now();
    const artifact = await dependencies.createBackup();
    const backupDurationMs = dependencies.now() - backupStartedAt;
    await dependencies.assertRestoreTargetEmpty();
    const restoreStartedAt = dependencies.now();
    await dependencies.restoreBackup(artifact);
    const restoreDurationMs = dependencies.now() - restoreStartedAt;
    await dependencies.assertRestoredMigrationsCurrent();
    await dependencies.assertRestoredIntegrity(commit);
    const restoredSnapshot = await dependencies.readRestoredSnapshot(canary);
    assertRecoverySnapshotsMatch(sourceSnapshot, restoredSnapshot);
    return {
      result: "valid",
      commit,
      postgresVersion,
      dumpFormat: "custom",
      dumpSizeBytes: artifact.sizeBytes,
      dumpSha256: artifact.sha256,
      backupDurationMs,
      restoreDurationMs,
      entityCounts: restoredSnapshot.entityCounts,
      workspaceCounts: restoredSnapshot.workspaceCounts,
      migrations: "current",
      persistedIntegrity: "valid",
      identitiesPreserved: true,
    };
  } catch (error) {
    operationFailed = true;
    throw error;
  } finally {
    try {
      await dependencies.cleanup();
    } catch (cleanupError) {
      if (!operationFailed) throw cleanupError;
    }
  }
}
