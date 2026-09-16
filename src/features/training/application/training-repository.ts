import type {
  CivilDate,
  TrainingDaySnapshot,
  TrainingEnvironment,
  TrainingPlanSnapshot,
} from "../domain/training-day.types";

export type FindTrainingDayInput = Readonly<{
  workspaceId: string;
  civilDate: CivilDate;
  environment: TrainingEnvironment;
}>;

export interface TrainingRepository {
  findActiveTrainingPlan(environment: TrainingEnvironment): Promise<TrainingPlanSnapshot | null>;
  findTrainingDay(input: FindTrainingDayInput): Promise<TrainingDaySnapshot>;
}
