import type { TrainingActionState } from "@/features/training/ui/training-action.types";

export type TrainingActionFeedbackProps = Readonly<{
  state: TrainingActionState;
  pending: boolean;
}>;
