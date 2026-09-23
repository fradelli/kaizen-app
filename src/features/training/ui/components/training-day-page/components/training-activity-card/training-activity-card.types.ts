import type { TrainingActivityDto } from "@/features/training/application/training-dto";
import type { TrainingDayFormActions } from "@/features/training/ui/training-action.types";

export type TrainingActivityCardProps = Readonly<{
  civilDate: string;
  activity: TrainingActivityDto;
  actions: TrainingDayFormActions;
}>;
