import "server-only";
import type {
  ImportTransaction,
  CreatedDefinitionCounts,
} from "./plan-definition-persistence.types";
import { recordCreatedDefinition, throwSourceConflict } from "./plan-definition-persistence.utils";
import type { PlanDefinitionSource } from "../domain/plan-definition-import.types";
import type { MealOption } from "../domain/plan-definition-source.types";
import { toPrismaJson, toMealTime, mapNutritionPlanVersion } from "./plan-definition.mapper";
export async function persistNutritionPlanDefinition(
  tx: ImportTransaction,
  source: PlanDefinitionSource<"nutrition_plan">,
  batchId: string,
  created: CreatedDefinitionCounts,
): Promise<string> {
  const plan = source.document;
  const existing = await tx.nutritionPlanVersion.findUnique({
    where: { planId_version: { planId: plan.plan_id, version: plan.version } },
  });
  if (existing) {
    if (existing.importBatchId !== batchId) throwSourceConflict();
    return existing.id;
  }
  const version = await tx.nutritionPlanVersion.create({
    data: mapNutritionPlanVersion(source, batchId),
  });
  recordCreatedDefinition(created, "nutritionPlans");
  const meals = new Map<string, string>();
  const pending: { key: string; option: MealOption; mealId: string; ordinal: number }[] = [];
  for (const [index, meal] of plan.meals.entries()) {
    const row = await tx.mealDefinition.create({
      data: {
        nutritionPlanVersionId: version.id,
        mealId: meal.id,
        ordinal: index + 1,
        label: meal.label,
        defaultTime: toMealTime(meal.default_time),
        required: meal.required,
        useWhen: meal.use_when ?? null,
        timingRules: toPrismaJson(plan.timing_rules.filter((rule) => rule.meal_id === meal.id)),
      },
    });
    meals.set(meal.id, row.id);
    recordCreatedDefinition(created, "meals");
    pending.push(
      ...meal.options.map((option, i) => ({
        key: `${meal.id}.${option.id}`,
        option,
        mealId: row.id,
        ordinal: i + 1,
      })),
    );
  }
  const options = new Map<string, string>();
  while (pending.length) {
    const index = pending.findIndex(
      (entry) => !entry.option.reference_option || options.has(entry.option.reference_option),
    );
    if (index < 0) throwSourceConflict();
    const [entry] = pending.splice(index, 1);
    const reference = entry.option.reference_option
      ? options.get(entry.option.reference_option)
      : undefined;
    const row = await tx.mealOptionDefinition.create({
      data: {
        nutritionPlanVersionId: version.id,
        mealDefinitionId: entry.mealId,
        optionId: entry.option.id,
        ordinal: entry.ordinal,
        label: entry.option.label,
        useWhen: entry.option.use_when ?? null,
        followUpRule: entry.option.follow_up_rule ?? null,
        ...(reference
          ? { referenceOptionId: reference }
          : { items: toPrismaJson(entry.option.items ?? []) }),
        ...(entry.option.unknowns ? { unknowns: toPrismaJson(entry.option.unknowns) } : {}),
      },
    });
    options.set(entry.key, row.id);
    recordCreatedDefinition(created, "mealOptions");
  }
  for (const [index, day] of plan.day_types.entries()) {
    const band = plan.energy_bands[day.energy_band_id];
    const row = await tx.nutritionDayTypeDefinition.create({
      data: {
        nutritionPlanVersionId: version.id,
        dayTypeId: day.id,
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
    });
    recordCreatedDefinition(created, "nutritionDayTypes");
    for (const [ordinal, meal] of day.meal_ids.entries()) {
      const mealId = meals.get(meal);
      if (!mealId) throwSourceConflict();
      await tx.nutritionDayTypeMeal.create({
        data: {
          nutritionPlanVersionId: version.id,
          dayTypeId: row.id,
          mealId,
          ordinal: ordinal + 1,
        },
      });
      recordCreatedDefinition(created, "dayTypeMeals");
    }
  }
  return version.id;
}
