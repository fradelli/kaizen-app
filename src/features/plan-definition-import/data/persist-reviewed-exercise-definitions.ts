import "server-only";
import type {
  ImportTransaction,
  CreatedDefinitionCounts,
} from "./plan-definition-persistence.types";
import { recordCreatedDefinition, throwSourceConflict } from "./plan-definition-persistence.utils";
import type { PlanDefinitionSnapshot } from "../domain/plan-definition-import.types";
import { toPrismaJson } from "./plan-definition.mapper";
import type { ExerciseLibrary, ExecutionMetadata } from "../domain/plan-definition-source.types";
export async function persistReviewedExerciseDefinitions(
  tx: ImportTransaction,
  snapshot: PlanDefinitionSnapshot,
  batches: ReadonlyMap<string, string>,
  created: CreatedDefinitionCounts,
) {
  const librarySource = snapshot.sources.find((source) => source.kind === "exercise_library")!;
  const metadataSource = snapshot.sources.find((source) => source.kind === "execution_metadata")!;
  const library = librarySource.document as unknown as ExerciseLibrary;
  const metadata = metadataSource.document as unknown as ExecutionMetadata;
  const exercises = new Map<string, string>();
  for (const entry of metadata.exercises) {
    const definition = library.exercises.find((item) => item.id === entry.exercise_id);
    if (!definition) throwSourceConflict();
    const identity = {
      libraryImportBatchId: batches.get(librarySource.path)!,
      metadataImportBatchId: batches.get(metadataSource.path)!,
      exerciseId: entry.exercise_id,
    };
    const existing = await tx.exerciseDefinition.findUnique({
      where: { libraryImportBatchId_metadataImportBatchId_exerciseId: identity },
    });
    const row =
      existing ??
      (await tx.exerciseDefinition.create({
        data: {
          ...identity,
          namePt: definition.name_pt,
          definition: toPrismaJson(definition),
          measurementType: entry.measurement_type,
          loadApplicable: entry.load_applicable,
          loadUnit: entry.load_unit,
          normalizationRule: toPrismaJson(entry.normalization_rule),
        },
      }));
    exercises.set(entry.exercise_id, row.id);
    if (!existing) recordCreatedDefinition(created, "exercises");
  }
  return { exercises, metadata };
}
