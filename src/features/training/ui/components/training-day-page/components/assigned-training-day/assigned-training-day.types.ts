import type { TrainingDayDto } from "@/features/training/application/training-dto";

export type AssignedTrainingDayProps = Readonly<{
  day: Extract<TrainingDayDto, { state: "training" | "mobility" }>;
}>;
