import type { TrainingDayPageQueryResult } from "@/features/training/application/training-dto";
import type { TrainingDayFormActions } from "@/features/training/ui/training-action.types";

export type TrainingDayContentProps = Readonly<{
  result: Promise<TrainingDayPageQueryResult>;
  actions?: TrainingDayFormActions;
}>;
