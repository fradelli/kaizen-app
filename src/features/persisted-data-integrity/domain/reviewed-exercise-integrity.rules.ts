import type { PlanDefinitionSnapshot } from "../../plan-definition-import/domain/plan-definition-import.types";
import { findPlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-source.utils";
import type { IntegrityIssue, PersistedDefinitionSnapshot } from "./persisted-data-integrity.types";
import {
  compareDefinitionCount,
  compareDefinitionFields,
  findSourceBatch,
} from "./definition-parity.utils";

export function validateReviewedExerciseParity(
  source: PlanDefinitionSnapshot,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const librarySource = findPlanDefinitionSource(source.sources, "exercise_library");
  const metadataSource = findPlanDefinitionSource(source.sources, "execution_metadata");
  if (!librarySource || !metadataSource) return;
  const libraryBatch = findSourceBatch(persisted.batches, librarySource.path, librarySource.sha256);
  const metadataBatch = findSourceBatch(
    persisted.batches,
    metadataSource.path,
    metadataSource.sha256,
  );
  if (!libraryBatch || !metadataBatch) return;
  const exercises = persisted.exercises.filter(
    (entry) =>
      entry.libraryImportBatchId === libraryBatch.id &&
      entry.metadataImportBatchId === metadataBatch.id,
  );
  compareDefinitionCount(
    exercises.length,
    metadataSource.document.exercises.length,
    librarySource.path,
    "exercises",
    issues,
  );
  for (const metadata of metadataSource.document.exercises) {
    const definition = librarySource.document.exercises.find(
      (exercise) => exercise.id === metadata.exercise_id,
    );
    if (!definition) continue;
    compareDefinitionFields(
      exercises.find((exercise) => exercise.exerciseId === metadata.exercise_id),
      {
        namePt: definition.name_pt,
        definition,
        measurementType: metadata.measurement_type,
        loadApplicable: metadata.load_applicable,
        loadUnit: metadata.load_unit,
        normalizationRule: metadata.normalization_rule,
      },
      librarySource.path,
      "exercises",
      issues,
    );
  }
}
