import type { TrainingMutationResult } from "../application/training-mutation.types";

export type TrainingActionState = TrainingMutationResult | Readonly<{ status: "idle" }>;
export type TrainingFormAction = (
  previousState: TrainingActionState,
  formData: FormData,
) => Promise<TrainingActionState>;

export type TrainingDayFormActions = Readonly<{
  addActivity: TrainingFormAction;
  updateActivity: TrainingFormAction;
  controlActivity: TrainingFormAction;
  saveActivityExercise: TrainingFormAction;
  deleteActivity: TrainingFormAction;
}>;
