import type { PlanDefinitionImportEnvironment } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  IntegrityIssue,
  PersistedDataIntegrityReport,
} from "../domain/persisted-data-integrity.types";
import { validateImportProvenance } from "../domain/import-provenance-integrity.rules";
import { validateReviewedExerciseParity } from "../domain/reviewed-exercise-integrity.rules";
import { validateTrainingPlanParity } from "../domain/training-plan-integrity.rules";
import { validateNutritionPlanParity } from "../domain/nutrition-plan-integrity.rules";
import type { PersistedDataIntegrityDependencies } from "./validate-persisted-data.types";
import { validateImportedSourceCommits } from "./validate-imported-source-commits";

export async function validatePersistedData(
  dependencies: PersistedDataIntegrityDependencies,
  environment: PlanDefinitionImportEnvironment = "local",
): Promise<PersistedDataIntegrityReport> {
  const canonical = await dependencies.readCanonicalSnapshot();
  dependencies.validateCanonicalSnapshot(canonical);
  const persisted = await dependencies.readPersistedSnapshot();
  const counts = {
    batches: persisted.batches.length,
    exercises: persisted.exercises.length,
    trainingPlans: persisted.trainingPlans.length,
    sessions: persisted.sessions.length,
    prescriptions: persisted.prescriptions.length,
    nutritionPlans: persisted.nutritionPlans.length,
    meals: persisted.meals.length,
    options: persisted.options.length,
    dayTypes: persisted.dayTypes.length,
    dayTypeMeals: persisted.dayTypeMeals.length,
    activations: persisted.activations.length,
  };
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
      if (source.kind === "training_plan")
        validateTrainingPlanParity(source, canonical, persisted, issues);
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
