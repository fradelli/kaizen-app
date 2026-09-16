import type { TrainingEnvironment } from "../domain/training-day.types";
import type { TrainingRepository } from "./training-repository";

export type GetTrainingDayDependencies = Readonly<{
  repository: TrainingRepository;
  environment: TrainingEnvironment;
  resolveWorkspace: () =>
    Readonly<{ workspaceId: string }> | PromiseLike<Readonly<{ workspaceId: string }>>;
}>;

export type GetTrainingDayInput = Readonly<{ civilDate: string }>;
