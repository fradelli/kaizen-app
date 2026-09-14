import type {
  PlanDefinitionImportEnvironment,
  PlanDefinitionImportReport,
} from "../domain/plan-definition-import.types";
import type { PlanDefinitionImportDependencies } from "./import-versioned-plan-definitions.types";
export async function importVersionedPlanDefinitions(
  dependencies: PlanDefinitionImportDependencies,
  environment: PlanDefinitionImportEnvironment,
): Promise<PlanDefinitionImportReport> {
  const snapshot = await dependencies.readSnapshot();
  dependencies.validateSnapshot(snapshot);
  return dependencies.repository.persistSnapshot(snapshot, environment);
}
