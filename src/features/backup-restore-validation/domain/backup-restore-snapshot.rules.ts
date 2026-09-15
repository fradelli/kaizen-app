import { BackupRestoreValidationError } from "./backup-restore-validation.error";
import type { RecoverySnapshot } from "./backup-restore-validation.types";

export function assertRecoverySnapshotsMatch(
  source: RecoverySnapshot,
  restored: RecoverySnapshot,
): void {
  if (JSON.stringify(source) !== JSON.stringify(restored))
    throw new BackupRestoreValidationError("VALIDATION_FAILED");
}
