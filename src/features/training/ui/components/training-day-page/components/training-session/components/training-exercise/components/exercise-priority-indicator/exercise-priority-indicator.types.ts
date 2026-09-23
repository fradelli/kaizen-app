import type { TrainingExercisePriorityLevel } from "@/features/training/domain/training-exercise-priority";

export type ExercisePriorityIndicatorProps = Readonly<{
  level: TrainingExercisePriorityLevel;
}>;
