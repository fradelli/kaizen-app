import { describe, expect, it } from "vitest";
import { PlanDefinitionImportError } from "../../plan-definition-import/domain/plan-definition-import.error";
import { PersistedDataIntegrityError } from "../domain/persisted-data-integrity.error";
import { mapPersistedDataIntegrityError } from "./persisted-data-integrity-error.mapper";

describe("taxonomia pública da auditoria persistida", () => {
  it.each([
    [new PersistedDataIntegrityError("CLI_INVALID"), "CLI_INVALID"],
    [new PersistedDataIntegrityError("TEST_DATABASE_INVALID"), "TEST_DATABASE_INVALID"],
    [new PlanDefinitionImportError("SOURCE_INVALID"), "SOURCE_INVALID"],
    [new PlanDefinitionImportError("SOURCE_CONFLICT"), "SOURCE_INVALID"],
    [new PlanDefinitionImportError("IMPORT_UNAVAILABLE"), "SOURCE_UNAVAILABLE"],
    [new Error("detalhe privado"), "INTEGRITY_UNAVAILABLE"],
  ] as const)("mapeia %s para %s", (error, expected) => {
    expect(mapPersistedDataIntegrityError(error)).toBe(expected);
  });
});
