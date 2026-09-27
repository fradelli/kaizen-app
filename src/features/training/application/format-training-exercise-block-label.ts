import type { TrainingExercisePrescriptionSnapshot } from "../domain/training-day.types";

export function formatTrainingExerciseBlockLabel(
  block: TrainingExercisePrescriptionSnapshot["block"],
): string | null {
  if (!block || block.mode !== "alternating") return null;
  return `Bloco ${block.ordinal}${block.position === 1 ? "A" : "B"}`;
}
