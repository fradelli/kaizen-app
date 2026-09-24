import type { TrainingDayDto } from "@/features/training/application/training-dto";

export type TrainingAgendaBadgesProps = Readonly<{
  day: TrainingDayDto;
}>;
