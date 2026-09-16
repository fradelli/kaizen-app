import type { TrainingExecutionStatus } from "@/features/training/domain/training-day.types";

export const TRAINING_EXECUTION_STATUS_LABELS = {
  not_started: "Não iniciado",
  in_progress: "Em andamento",
  completed: "Concluído",
  followed_different: "Realizado com alterações",
  skipped: "Não realizado",
} satisfies Record<TrainingExecutionStatus, string>;

export const TRAINING_EXECUTION_STATUS_VARIANTS = {
  not_started: "outline",
  in_progress: "info",
  completed: "success",
  followed_different: "warning",
  skipped: "secondary",
} satisfies Record<
  TrainingExecutionStatus,
  "outline" | "info" | "success" | "warning" | "secondary"
>;
