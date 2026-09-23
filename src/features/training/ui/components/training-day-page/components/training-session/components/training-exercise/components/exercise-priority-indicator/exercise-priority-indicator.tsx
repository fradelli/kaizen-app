import { exercisePriorityIndicatorStyles } from "./exercise-priority-indicator.styles";
import type { ExercisePriorityIndicatorProps } from "./exercise-priority-indicator.types";

const PRIORITY_LABELS = {
  1: "Prioridade baixa",
  2: "Prioridade média",
  3: "Prioridade alta",
} as const;

export function ExercisePriorityIndicator({ level }: ExercisePriorityIndicatorProps) {
  const label = PRIORITY_LABELS[level];
  return (
    <span
      className={exercisePriorityIndicatorStyles.root}
      role="img"
      aria-label={label}
      title={label}
    >
      <span>Prioridade:</span>
      <span className={exercisePriorityIndicatorStyles.bars} aria-hidden="true">
        {[1, 2, 3].map((position) => (
          <span
            key={position}
            className={`${exercisePriorityIndicatorStyles.bar} ${
              position <= level
                ? exercisePriorityIndicatorStyles.active
                : exercisePriorityIndicatorStyles.inactive
            }`}
          />
        ))}
      </span>
    </span>
  );
}
