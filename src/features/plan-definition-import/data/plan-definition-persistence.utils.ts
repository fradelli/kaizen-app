import "server-only";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type { CreatedDefinitionCounts } from "./plan-definition-persistence.types";
export function recordCreatedDefinition(created: CreatedDefinitionCounts, name: string): void {
  created[name] = (created[name] ?? 0) + 1;
}
export function throwSourceConflict(): never {
  throw new PlanDefinitionImportError("SOURCE_CONFLICT");
}
