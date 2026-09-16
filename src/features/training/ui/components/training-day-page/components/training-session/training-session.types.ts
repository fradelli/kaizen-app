import type { TrainingDaySessionDto } from "@/features/training/application/training-dto";

export type TrainingSessionProps = Readonly<{
  session: TrainingDaySessionDto;
}>;
