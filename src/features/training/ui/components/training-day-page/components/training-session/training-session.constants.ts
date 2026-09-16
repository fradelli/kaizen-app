import type { TrainingDaySessionDto } from "@/features/training/application/training-dto";

export const TRAINING_SESSION_ROLE_LABELS = {
  preparation: "Preparação",
  main: "Treino principal",
  mobility: "Mobilidade",
} satisfies Record<TrainingDaySessionDto["role"], string>;

export const TRAINING_SESSION_ROLE_VARIANTS = {
  preparation: "info",
  main: "default",
  mobility: "secondary",
} satisfies Record<TrainingDaySessionDto["role"], "info" | "default" | "secondary">;
