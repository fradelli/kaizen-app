import type { PlanDefinitionImportErrorCode } from "./plan-definition-import.types";

export class PlanDefinitionImportError extends Error {
  constructor(readonly code: PlanDefinitionImportErrorCode) {
    super(`Importação canônica falhou: ${code}.`);
    this.name = "PlanDefinitionImportError";
  }
}
