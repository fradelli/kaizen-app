import type { PlanDefinitionImportErrorCode } from "./plan-definition-import.types";

export class PlanDefinitionImportError extends Error {
  constructor(
    readonly code: PlanDefinitionImportErrorCode,
    options?: ErrorOptions,
  ) {
    super(`Importação canônica falhou: ${code}.`, options);
    this.name = "PlanDefinitionImportError";
  }
}
