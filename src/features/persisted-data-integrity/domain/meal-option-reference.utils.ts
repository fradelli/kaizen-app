export type MealOptionReference = Readonly<{ mealId: string; optionId: string }>;

export function parseMealOptionReference(reference: string): MealOptionReference {
  const separator = reference.indexOf(".");
  return { mealId: reference.slice(0, separator), optionId: reference.slice(separator + 1) };
}
