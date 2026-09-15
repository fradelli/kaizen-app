import "server-only";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type {
  CreatedDefinitionCounts,
  CreatedDefinitionName,
} from "../domain/plan-definition-import.types";
export function recordCreatedDefinition(
  created: CreatedDefinitionCounts,
  name: CreatedDefinitionName,
): void {
  created[name] = (created[name] ?? 0) + 1;
}
export function throwSourceConflict(): never {
  throw new PlanDefinitionImportError("SOURCE_CONFLICT");
}
