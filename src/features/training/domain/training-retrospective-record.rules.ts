import type { TrainingActivityType } from "./training-day.types";

export function supportsRetrospectiveTrainingRecord(type: TrainingActivityType): boolean {
  return type === "sport_practice" || type === "specific_training";
}
