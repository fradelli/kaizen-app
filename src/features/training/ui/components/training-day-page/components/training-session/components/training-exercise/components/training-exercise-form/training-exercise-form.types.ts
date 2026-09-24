import type { TrainingDayExerciseDto } from "@/features/training/application/training-dto";
import type { TrainingExerciseRole } from "@/features/training/domain/training-day.types";
import type { TrainingFormAction } from "@/features/training/ui/training-action.types";

export type TrainingExerciseFormProps = Readonly<{
  civilDate: string;
  activityId: string;
  sessionId: string;
  role: TrainingExerciseRole;
  exercise: TrainingDayExerciseDto;
  action: TrainingFormAction;
}>;
