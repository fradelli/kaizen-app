import type { PlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  IntegrityIssue,
  PersistedDefinitionSnapshot,
  PersistedNutritionPlan,
} from "./persisted-data-integrity.types";
import { compareDefinitionCount, compareDefinitionFields } from "./definition-parity.utils";
import { parseMealOptionReference } from "./meal-option-reference.utils";

export function validateMealDefinitionParity(
  source: PlanDefinitionSource<"nutrition_plan">,
  version: PersistedNutritionPlan,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const plan = source.document;
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
      const reference = option.reference_option
        ? parseMealOptionReference(option.reference_option)
        : undefined;
      const referenceMealId = meals.find((entry) => entry.mealId === reference?.mealId)?.id;
      const referenceId = options.find(
        (entry) =>
          entry.mealDefinitionId === referenceMealId && entry.optionId === reference?.optionId,
      )?.id;
      compareDefinitionFields(
        mealOptions.find((entry) => entry.optionId === option.id),
        {
          ordinal: ordinal + 1,
          label: option.label,
          useWhen: option.use_when ?? null,
          followUpRule: option.follow_up_rule ?? null,
          referenceOptionId: reference ? (referenceId ?? null) : null,
          items: reference ? null : (option.items ?? null),
          unknowns: option.unknowns ?? null,
        },
        source.path,
        "mealOptions",
        issues,
      );
    }
  }
}
