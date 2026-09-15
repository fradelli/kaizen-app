import type { PlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  IntegrityIssue,
  PersistedDefinitionSnapshot,
  PersistedNutritionPlan,
} from "./persisted-data-integrity.types";
import { compareDefinitionCount, compareDefinitionFields } from "./definition-parity.utils";

export function validateNutritionDayTypeParity(
  source: PlanDefinitionSource<"nutrition_plan">,
  version: PersistedNutritionPlan,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const plan = source.document;
  const meals = persisted.meals.filter((entry) => entry.nutritionPlanVersionId === version.id);
  const dayTypes = persisted.dayTypes.filter(
    (entry) => entry.nutritionPlanVersionId === version.id,
  );
  const links = persisted.dayTypeMeals.filter(
    (entry) => entry.nutritionPlanVersionId === version.id,
  );
  compareDefinitionCount(dayTypes.length, plan.day_types.length, source.path, "dayTypes", issues);
  compareDefinitionCount(
    links.length,
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
    const dayLinks = links.filter((entry) => entry.dayTypeId === actual.id);
    compareDefinitionCount(
      dayLinks.length,
      day.meal_ids.length,
      source.path,
      "dayTypeMeals",
      issues,
    );
    for (const [ordinal, mealId] of day.meal_ids.entries())
      compareDefinitionFields(
        dayLinks.find((entry) => entry.ordinal === ordinal + 1),
        { mealId: meals.find((entry) => entry.mealId === mealId)?.id ?? null },
        source.path,
        "dayTypeMeals",
        issues,
      );
  }
}
