import type { ReactNode } from "react";

export type TrainingDayFeedbackProps = Readonly<{
  title: string;
  description: string;
  variant?: "info" | "warning" | "destructive";
  action?: ReactNode;
}>;
