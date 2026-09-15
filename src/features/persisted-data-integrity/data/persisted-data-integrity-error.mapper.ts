import { PlanDefinitionImportError } from "../../plan-definition-import/domain/plan-definition-import.error";
import { PersistedDataIntegrityError } from "../domain/persisted-data-integrity.error";
import type { PersistedDataIntegrityErrorCode } from "../domain/persisted-data-integrity.types";

export function mapPersistedDataIntegrityError(error: unknown): PersistedDataIntegrityErrorCode {
  if (error instanceof PersistedDataIntegrityError) return error.code;
  if (error instanceof PlanDefinitionImportError)
    return error.code === "SOURCE_INVALID" || error.code === "SOURCE_CONFLICT"
      ? "SOURCE_INVALID"
      : "SOURCE_UNAVAILABLE";
  return "INTEGRITY_UNAVAILABLE";
}
