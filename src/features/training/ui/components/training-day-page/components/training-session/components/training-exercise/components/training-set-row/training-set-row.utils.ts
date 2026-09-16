import type { TrainingSetDto } from "@/features/training/application/training-dto";
import type { TrainingMeasurementType } from "@/features/training/domain/training-day.types";

const MEASUREMENT_LABELS = {
  repetitions: "repetições",
  seconds: "segundos",
  contacts: "contatos",
} as const;

export function formatTrainingSetResult(
  set: TrainingSetDto,
  measurementType: TrainingMeasurementType,
): string {
  if (set.status === "skipped") return "Série não realizada";

  if (measurementType === "per_side") {
    const sides = [
      set.leftValue === null ? null : `Esquerdo: ${set.leftValue}`,
      set.rightValue === null ? null : `Direito: ${set.rightValue}`,
    ].filter((value): value is string => value !== null);
    const directions = set.directionValues
      ? Object.entries(set.directionValues)
          .sort(([first], [second]) => first.localeCompare(second))
          .map(([direction, value]) => `${direction}: ${value}`)
      : [];
    const values = [...sides, ...directions];

    return values.length ? values.join(" · ") : "Resultado ainda não registrado";
  }

  if (set.value === null) return "Resultado ainda não registrado";

  return `${set.value} ${MEASUREMENT_LABELS[measurementType]}`;
}

export function formatTrainingSetLoad(set: TrainingSetDto, loadUnit: string | null): string {
  if (set.loadKg === null) return "Carga não registrada";
  return loadUnit ? `${set.loadKg} ${loadUnit}` : set.loadKg;
}
