export type TrainingExercisePriorityLevel = 1 | 2 | 3;

const LEGACY_PRIORITY_LEVELS = {
  complementary: 1,
  fundamental: 3,
} as const satisfies Record<string, TrainingExercisePriorityLevel>;

export function resolveTrainingExercisePriorityLevel(
  priority: string | null,
): TrainingExercisePriorityLevel | null {
  if (!priority) return null;
  if (priority === "1" || priority === "2" || priority === "3")
    return Number(priority) as TrainingExercisePriorityLevel;
  return LEGACY_PRIORITY_LEVELS[priority as keyof typeof LEGACY_PRIORITY_LEVELS] ?? null;
}
