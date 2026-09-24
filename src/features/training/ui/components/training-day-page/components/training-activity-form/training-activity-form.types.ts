import type {
  AvailablePublicTrainingPlanDto,
  TrainingActivityDto,
} from "@/features/training/application/training-dto";
import type { TrainingFormAction } from "@/features/training/ui/training-action.types";

export type TrainingActivityFormProps = Readonly<{
  civilDate: string;
  action: TrainingFormAction;
  activity?: TrainingActivityDto;
  availablePlan: AvailablePublicTrainingPlanDto | null;
}>;
