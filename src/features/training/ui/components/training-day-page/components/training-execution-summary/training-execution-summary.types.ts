import type { TrainingExecutionDto } from "@/features/training/application/training-dto";

export type TrainingExecutionSummaryProps = Readonly<{
  execution: TrainingExecutionDto | null;
}>;
