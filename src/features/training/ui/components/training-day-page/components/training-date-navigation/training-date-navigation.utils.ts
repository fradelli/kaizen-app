import type { CivilDate } from "../../../../../domain/training-day.types";

export function createTrainingDateHref(civilDate: CivilDate): string {
  return `/treino?date=${encodeURIComponent(civilDate)}`;
}
