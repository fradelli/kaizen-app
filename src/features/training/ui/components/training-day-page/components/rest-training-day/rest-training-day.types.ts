import type { TrainingDayDto } from "@/features/training/application/training-dto";
import type { TrainingDayFormActions } from "@/features/training/ui/training-action.types";

export type RestTrainingDayProps = Readonly<{
  day: Extract<TrainingDayDto, { state: "rest" }>;
  actions?: TrainingDayFormActions;
}>;
