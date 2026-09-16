import type { TrainingItemStatus } from "@/features/training/domain/training-day.types";

export const TRAINING_SET_STATUS_LABELS = {
  pending: "Pendente",
  completed: "Concluída",
  skipped: "Pulada",
} satisfies Record<TrainingItemStatus, string>;

export const TRAINING_SET_STATUS_VARIANTS = {
  pending: "outline",
  completed: "success",
  skipped: "secondary",
} satisfies Record<TrainingItemStatus, "outline" | "success" | "secondary">;
