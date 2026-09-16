import type { TrainingDayDto } from "@/features/training/application/training-dto";

export type UnassignedTrainingDayProps = Readonly<{
  day: Extract<TrainingDayDto, { state: "unassigned" }>;
}>;
