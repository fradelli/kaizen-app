import type { TrainingDayExerciseDto } from "@/features/training/application/training-dto";
import type { TrainingFormAction } from "@/features/training/ui/training-action.types";

export type TrainingWarmupToggleProps = Readonly<{
  civilDate: string;
  activityId: string;
  sessionId: string;
  exercise: TrainingDayExerciseDto;
  action: TrainingFormAction;
}>;
