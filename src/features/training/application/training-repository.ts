import type {
  CivilDate,
  TrainingDaySnapshot,
  TrainingEnvironment,
  TrainingPlanSnapshot,
} from "../domain/training-day.types";
import type {
  TrainingMutationResult,
  AddTrainingActivityCommand,
  ControlTrainingActivityCommand,
  DeleteTrainingActivityCommand,
  SaveTrainingActivityExerciseCommand,
  UpdateTrainingActivityCommand,
} from "./training-mutation.types";

export type FindTrainingDayInput = Readonly<{
  workspaceId: string;
  civilDate: CivilDate;
  environment: TrainingEnvironment;
}>;

export interface TrainingRepository {
  findActiveTrainingPlan(environment: TrainingEnvironment): Promise<TrainingPlanSnapshot | null>;
  ensureScheduledTrainingDay(input: FindTrainingDayInput): Promise<void>;
  findTrainingDay(input: FindTrainingDayInput): Promise<TrainingDaySnapshot>;
}

export interface TrainingMutationRepository {
  addTrainingActivity(input: AddTrainingActivityCommand): Promise<TrainingMutationResult>;
  updateTrainingActivity(input: UpdateTrainingActivityCommand): Promise<TrainingMutationResult>;
  deleteTrainingActivity(input: DeleteTrainingActivityCommand): Promise<TrainingMutationResult>;
  controlTrainingActivity(input: ControlTrainingActivityCommand): Promise<TrainingMutationResult>;
  saveTrainingActivityExercise(
    input: SaveTrainingActivityExerciseCommand,
  ): Promise<TrainingMutationResult>;
}
