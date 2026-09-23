import { parseCivilDate } from "../domain/training-day.rules";
import type { TrainingMutationRepository } from "./training-repository";
import type {
  TrainingMutationResult,
  AddTrainingActivityCommand,
  ControlTrainingActivityCommand,
  DeleteTrainingActivityCommand,
  SaveTrainingActivityExerciseCommand,
  UpdateTrainingActivityCommand,
} from "./training-mutation.types";

type MutationDependencies = Readonly<{
  repository: TrainingMutationRepository;
  resolveWorkspace: () => Readonly<{ workspaceId: string }>;
}>;

export function addTrainingActivity(
  dependencies: MutationDependencies,
  input: Omit<AddTrainingActivityCommand, "workspaceId" | "civilDate"> & { civilDate: string },
): Promise<TrainingMutationResult> {
  return dependencies.repository.addTrainingActivity({
    ...input,
    civilDate: parseCivilDate(input.civilDate),
    workspaceId: dependencies.resolveWorkspace().workspaceId,
  });
}

export function controlTrainingActivity(
  dependencies: MutationDependencies,
  input: Omit<ControlTrainingActivityCommand, "workspaceId" | "civilDate"> & {
    civilDate: string;
  },
): Promise<TrainingMutationResult> {
  return dependencies.repository.controlTrainingActivity({
    ...input,
    civilDate: parseCivilDate(input.civilDate),
    workspaceId: dependencies.resolveWorkspace().workspaceId,
  });
}

export function saveTrainingActivityExercise(
  dependencies: MutationDependencies,
  input: Omit<SaveTrainingActivityExerciseCommand, "workspaceId" | "civilDate"> & {
    civilDate: string;
  },
): Promise<TrainingMutationResult> {
  return dependencies.repository.saveTrainingActivityExercise({
    ...input,
    civilDate: parseCivilDate(input.civilDate),
    workspaceId: dependencies.resolveWorkspace().workspaceId,
  });
}

export function updateTrainingActivity(
  dependencies: MutationDependencies,
  input: Omit<UpdateTrainingActivityCommand, "workspaceId" | "civilDate"> & {
    civilDate: string;
  },
): Promise<TrainingMutationResult> {
  return dependencies.repository.updateTrainingActivity({
    ...input,
    civilDate: parseCivilDate(input.civilDate),
    workspaceId: dependencies.resolveWorkspace().workspaceId,
  });
}

export function deleteTrainingActivity(
  dependencies: MutationDependencies,
  input: Omit<DeleteTrainingActivityCommand, "workspaceId" | "civilDate"> & {
    civilDate: string;
  },
): Promise<TrainingMutationResult> {
  return dependencies.repository.deleteTrainingActivity({
    ...input,
    civilDate: parseCivilDate(input.civilDate),
    workspaceId: dependencies.resolveWorkspace().workspaceId,
  });
}
