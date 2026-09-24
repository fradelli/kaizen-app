import type { TrainingActivityDto } from "@/features/training/application/training-dto";
import type { TrainingFormAction } from "@/features/training/ui/training-action.types";
import type { TrainingActivityExecutionDraft } from "@/features/training/ui/hooks/use-training-activity-draft/use-training-activity-draft.types";

export type TrainingActivityControlsProps = Readonly<{
  civilDate: string;
  activity: TrainingActivityDto;
  action: TrainingFormAction;
  draft?: TrainingActivityExecutionDraft | null;
  onStart?: () => void;
  onFinalized?: () => void;
  ready?: boolean;
}>;
