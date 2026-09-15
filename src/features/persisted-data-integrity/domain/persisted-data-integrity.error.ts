import type { PersistedDataIntegrityErrorCode } from "./persisted-data-integrity.types";

export class PersistedDataIntegrityError extends Error {
  constructor(readonly code: PersistedDataIntegrityErrorCode) {
    super(`Auditoria de integridade persistida falhou: ${code}.`);
    this.name = "PersistedDataIntegrityError";
  }
}
