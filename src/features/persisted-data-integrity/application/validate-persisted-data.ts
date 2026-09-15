import type { PlanDefinitionImportEnvironment } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  IntegrityIssue,
  PersistedDataIntegrityReport,
} from "../domain/persisted-data-integrity.types";
import { validateImportProvenance } from "../domain/import-provenance-integrity.rules";
import {
  validateReviewedExerciseParity,
  validateTrainingPlanParity,
} from "../domain/training-definition-integrity.rules";
import { validateNutritionPlanParity } from "../domain/nutrition-definition-integrity.rules";
import type { PersistedDataIntegrityDependencies } from "./validate-persisted-data.types";
import { validateImportedSourceCommits } from "./validate-imported-source-commits";

export async function validatePersistedData(
  dependencies: PersistedDataIntegrityDependencies,
  environment: PlanDefinitionImportEnvironment = "local",
): Promise<PersistedDataIntegrityReport> {
  const canonical = await dependencies.readCanonicalSnapshot();
  dependencies.validateCanonicalSnapshot(canonical);
  const persisted = await dependencies.readPersistedSnapshot();
  const counts = Object.fromEntries(
    Object.entries(persisted).map(([entity, definitions]) => [entity, definitions.length]),
  );
  const issues: IntegrityIssue[] = [];
  const empty = Object.values(counts).every((count) => count === 0);
  if (!empty) {
    validateImportProvenance(canonical, persisted, environment, issues);
    await validateImportedSourceCommits(
      canonical,
      persisted,
      dependencies.readSnapshotAtCommit,
      issues,
    );
    validateReviewedExerciseParity(canonical, persisted, issues);
    for (const source of canonical.sources) {
      if (source.kind === "training_plan") validateTrainingPlanParity(source, persisted, issues);
      if (source.kind === "nutrition_plan") validateNutritionPlanParity(source, persisted, issues);
    }
  }
  return {
    result: empty ? "not-imported" : issues.length ? "invalid" : "valid",
    commit: canonical.commit,
    scope: "canonical-plan-definitions",
    counts,
    issues,
  };
}
