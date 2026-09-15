import type { BackupRestoreFailureCode } from "./backup-restore-validation.types";

export class BackupRestoreValidationError extends Error {
  constructor(readonly code: BackupRestoreFailureCode) {
    super(`Validação de backup e restauração falhou: ${code}.`);
    this.name = "BackupRestoreValidationError";
  }
}
