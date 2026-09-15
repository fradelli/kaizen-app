import type {
  PlanDefinitionSource,
  JsonValue,
} from "../../plan-definition-import/domain/plan-definition-import.types";
import type { NutritionPlan } from "../../plan-definition-import/domain/plan-definition-source.types";
import type { PersistedDefinitionSnapshot, IntegrityIssue } from "./persisted-data-integrity.types";
import {
  compareDefinitionFields,
  compareDefinitionCount,
  findSourceBatch,
  civilDateTimestamp,
} from "./definition-parity.utils";

export function validateNutritionPlanParity(
  source: PlanDefinitionSource,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const plan = source.document as unknown as NutritionPlan;
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
  const meals = persisted.meals.filter((entry) => entry.nutritionPlanVersionId === version.id);
  const options = persisted.options.filter((entry) => entry.nutritionPlanVersionId === version.id);
  compareDefinitionCount(meals.length, plan.meals.length, source.path, "meals", issues);
  compareDefinitionCount(
    options.length,
    plan.meals.reduce((count, meal) => count + meal.options.length, 0),
    source.path,
    "options",
    issues,
  );
  for (const [index, definition] of plan.meals.entries()) {
    const meal = meals.find((entry) => entry.mealId === definition.id);
    compareDefinitionFields(
      meal,
      {
        ordinal: index + 1,
        label: definition.label,
        required: definition.required,
        defaultTime: definition.default_time
          ? `1970-01-01T${definition.default_time}:00.000Z`
          : null,
        useWhen: definition.use_when ?? null,
        timingRules: plan.timing_rules.filter((entry) => entry.meal_id === definition.id),
      },
      source.path,
      "meals",
      issues,
    );
    if (!meal) continue;
    const mealOptions = options.filter((entry) => entry.mealDefinitionId === meal.id);
    compareDefinitionCount(
      mealOptions.length,
      definition.options.length,
      source.path,
      "mealOptions",
      issues,
    );
    for (const [ordinal, option] of definition.options.entries()) {
      const referenceMeal = option.reference_option?.split(".")[0];
      const referenceOption = option.reference_option?.split(".")[1];
      const referenceMealId = meals.find((entry) => entry.mealId === referenceMeal)?.id;
      const referenceId = options.find(
        (entry) => entry.mealDefinitionId === referenceMealId && entry.optionId === referenceOption,
      )?.id;
      compareDefinitionFields(
        mealOptions.find((entry) => entry.optionId === option.id),
        {
          ordinal: ordinal + 1,
          label: option.label,
          useWhen: option.use_when ?? null,
          followUpRule: option.follow_up_rule ?? null,
          referenceOptionId: option.reference_option ? (referenceId ?? null) : null,
          items: option.reference_option ? null : ((option.items ?? null) as JsonValue),
          unknowns: (option.unknowns ?? null) as JsonValue,
        },
        source.path,
        "mealOptions",
        issues,
      );
    }
  }
  const dayTypes = persisted.dayTypes.filter(
    (entry) => entry.nutritionPlanVersionId === version.id,
  );
  compareDefinitionCount(dayTypes.length, plan.day_types.length, source.path, "dayTypes", issues);
  const allLinks = persisted.dayTypeMeals.filter(
    (entry) => entry.nutritionPlanVersionId === version.id,
  );
  compareDefinitionCount(
    allLinks.length,
    plan.day_types.reduce((count, day) => count + day.meal_ids.length, 0),
    source.path,
    "dayTypeMeals",
    issues,
  );
  for (const [index, day] of plan.day_types.entries()) {
    const actual = dayTypes.find((entry) => entry.dayTypeId === day.id);
    const band = plan.energy_bands[day.energy_band_id];
    compareDefinitionFields(
      actual,
      {
        ordinal: index + 1,
        label: day.label,
        energyBandId: day.energy_band_id,
        minimumKcal: band.minimum_kcal,
        maximumKcal: band.maximum_kcal,
        energyBandStatus: band.status,
        minimumModules: day.carbohydrate_modules.minimum,
        maximumModules: day.carbohydrate_modules.maximum,
        mealRule: day.meal_rule,
      },
      source.path,
      "dayTypes",
      issues,
    );
    if (!actual) continue;
    const links = allLinks.filter((entry) => entry.dayTypeId === actual.id);
    compareDefinitionCount(links.length, day.meal_ids.length, source.path, "dayTypeMeals", issues);
    for (const [ordinal, mealId] of day.meal_ids.entries())
      compareDefinitionFields(
        links.find((entry) => entry.ordinal === ordinal + 1),
        {
          mealId: meals.find((entry) => entry.mealId === mealId)?.id ?? null,
        },
        source.path,
        "dayTypeMeals",
        issues,
      );
  }
}
