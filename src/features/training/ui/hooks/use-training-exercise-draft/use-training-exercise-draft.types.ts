import type { TrainingDayExerciseDto } from "@/features/training/application/training-dto";

export type TrainingSetDraft = Readonly<{
  setNumber: number;
  value: string;
  leftValue: string;
  rightValue: string;
  directionValues: Readonly<Record<string, string>>;
  loadKg: string;
}>;

export type TrainingSetDraftField =
  "value" | "leftValue" | "rightValue" | "loadKg" | `direction:${string}`;

export type UseTrainingExerciseDraftInput = Readonly<{
  exercise: TrainingDayExerciseDto;
}>;
