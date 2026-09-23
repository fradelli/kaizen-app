import type { TrainingActivityDto } from "@/features/training/application/training-dto";
import type { TrainingDayFormActions } from "@/features/training/ui/training-action.types";

export type TrainingActivitySectionProps = Readonly<{
  civilDate: string;
  activities: readonly TrainingActivityDto[];
  actions?: TrainingDayFormActions;
}>;
