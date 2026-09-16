import type { CivilDate } from "../../../domain/training-day.types";

export function formatTrainingDateLabel(civilDate: CivilDate): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${civilDate}T00:00:00.000Z`));
}
