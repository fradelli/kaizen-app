import type {
  PlanDefinitionSnapshot,
  PlanDefinitionImportEnvironment,
  PlanDefinitionImportReport,
} from "../domain/plan-definition-import.types";
export interface PlanDefinitionImportRepository {
  persistSnapshot(
    snapshot: PlanDefinitionSnapshot,
    environment: PlanDefinitionImportEnvironment,
  ): Promise<PlanDefinitionImportReport>;
}
export type PlanDefinitionImportDependencies = {
  readSnapshot: () => Promise<PlanDefinitionSnapshot>;
  validateSnapshot: (snapshot: PlanDefinitionSnapshot) => void;
  repository: PlanDefinitionImportRepository;
};
