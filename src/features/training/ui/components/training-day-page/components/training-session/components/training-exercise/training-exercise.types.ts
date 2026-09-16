import type { TrainingDayExerciseDto } from "@/features/training/application/training-dto";

export type TrainingExerciseProps = Readonly<{
  exercise: TrainingDayExerciseDto;
}>;
