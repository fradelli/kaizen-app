import type { TrainingDayDto } from "@/features/training/application/training-dto";

export type RestTrainingDayProps = Readonly<{
  day: Extract<TrainingDayDto, { state: "rest" }>;
}>;
