"use client";

import { trainingActionFeedbackStyles } from "./training-action-feedback.styles";
import type { TrainingActionFeedbackProps } from "./training-action-feedback.types";

export function TrainingActionFeedback({ state, pending }: TrainingActionFeedbackProps) {
  if (pending) return <p className={trainingActionFeedbackStyles.root}>Salvando…</p>;
  if (state.status === "idle") return null;
  if (state.status === "saved") {
    return <p className={trainingActionFeedbackStyles.success}>Salvo.</p>;
  }
  return (
    <p className={trainingActionFeedbackStyles.error} role="alert">
      {state.message}
    </p>
  );
}
