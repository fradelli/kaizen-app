import type { TrainingExercisePrescriptionSnapshot } from "../domain/training-day.types";
import { TrainingProjectionError } from "../domain/training-projection.error";

export function parseTrainingExerciseBlock(
  row: Readonly<{
    blockId: string | null;
    blockMode: string | null;
    blockOrdinal: number | null;
    blockPosition: number | null;
  }>,
): TrainingExercisePrescriptionSnapshot["block"] {
  if (
    [row.blockId, row.blockMode, row.blockOrdinal, row.blockPosition].every(
      (value) => value === null,
    )
  )
    return null;
  if (
    !row.blockId ||
    (row.blockMode !== "single" && row.blockMode !== "alternating") ||
    row.blockOrdinal === null ||
    row.blockOrdinal < 1 ||
    row.blockPosition === null ||
    row.blockPosition < 1 ||
    row.blockPosition > (row.blockMode === "single" ? 1 : 2)
  ) {
    throw new TrainingProjectionError(
      "TRAINING_DEFINITION_INVALID",
      "O bloco de exercício importado está inválido.",
    );
  }
  return {
    id: row.blockId,
    mode: row.blockMode,
    ordinal: row.blockOrdinal,
    position: row.blockPosition,
  };
}
