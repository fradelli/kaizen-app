import type { TrainingEnvironment } from "../domain/training-day.types";
import type { TrainingRepository } from "./training-repository";

export type GetPublicTrainingPlanDependencies = Readonly<{
  repository: TrainingRepository;
  environment: TrainingEnvironment;
}>;
