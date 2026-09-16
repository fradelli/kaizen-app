import type { TrainingDayPageQueryResult } from "@/features/training/application/training-dto";

export type TrainingDayContentProps = Readonly<{
  result: Promise<TrainingDayPageQueryResult>;
}>;
