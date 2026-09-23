import type { TrainingDayDto } from "@/features/training/application/training-dto";
import type { TrainingDayFormActions } from "@/features/training/ui/training-action.types";

export type TrainingAgendaDrawerProps = Readonly<{
  day: TrainingDayDto;
  actions: TrainingDayFormActions;
}>;
