import type { PlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-import.types";
import type { IntegrityIssue, PersistedDefinitionSnapshot } from "./persisted-data-integrity.types";
import {
  civilDateTimestamp,
  compareDefinitionCount,
  compareDefinitionFields,
  findSourceBatch,
} from "./definition-parity.utils";
import { validateMealDefinitionParity } from "./meal-definition-integrity.rules";
import { validateNutritionDayTypeParity } from "./nutrition-day-type-integrity.rules";

export function validateNutritionPlanParity(
  source: PlanDefinitionSource<"nutrition_plan">,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const plan = source.document;
  const batch = findSourceBatch(persisted.batches, source.path, source.sha256);
  const versions = persisted.nutritionPlans.filter(
    (entry) => entry.planId === plan.plan_id && entry.version === plan.version,
  );
  compareDefinitionCount(versions.length, 1, source.path, "nutritionPlans", issues);
  const version = versions[0];
  compareDefinitionFields(
    version,
    {
      planId: plan.plan_id,
      version: plan.version,
      importBatchId: batch?.id ?? null,
      lifecycleStatus: plan.lifecycle_status,
      professionalStatus: plan.professional_status,
      sourceCreatedOn: civilDateTimestamp(plan.created_at),
      sourceUpdatedOn: civilDateTimestamp(plan.last_updated),
      effectiveFrom: civilDateTimestamp(plan.effective_from),
      effectiveUntil: plan.effective_until ? civilDateTimestamp(plan.effective_until) : null,
      timezone: plan.timezone,
    },
    source.path,
    "nutritionPlans",
    issues,
  );
  if (!version) return;
  validateMealDefinitionParity(source, version, persisted, issues);
  validateNutritionDayTypeParity(source, version, persisted, issues);
}
