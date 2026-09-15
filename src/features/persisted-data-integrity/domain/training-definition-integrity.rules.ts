import type {
  PlanDefinitionSnapshot,
  PlanDefinitionSource,
  JsonValue,
} from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  TrainingPlan,
  ExerciseLibrary,
  ExecutionMetadata,
} from "../../plan-definition-import/domain/plan-definition-source.types";
import type { PersistedDefinitionSnapshot, IntegrityIssue } from "./persisted-data-integrity.types";
import {
  compareDefinitionFields,
  compareDefinitionCount,
  findSourceBatch,
  civilDateTimestamp,
} from "./definition-parity.utils";

export function validateReviewedExerciseParity(
  source: PlanDefinitionSnapshot,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const librarySource = source.sources.find((entry) => entry.kind === "exercise_library")!;
  const metadataSource = source.sources.find((entry) => entry.kind === "execution_metadata")!;
  const libraryBatch = findSourceBatch(persisted.batches, librarySource.path, librarySource.sha256);
  const metadataBatch = findSourceBatch(
    persisted.batches,
    metadataSource.path,
    metadataSource.sha256,
  );
  if (!libraryBatch || !metadataBatch) return;
  const library = librarySource.document as unknown as ExerciseLibrary;
  const metadata = metadataSource.document as unknown as ExecutionMetadata;
  const exercises = persisted.exercises.filter(
    (entry) =>
      entry.libraryImportBatchId === libraryBatch.id &&
      entry.metadataImportBatchId === metadataBatch.id,
  );
  compareDefinitionCount(
    exercises.length,
    metadata.exercises.length,
    librarySource.path,
    "exercises",
    issues,
  );
  for (const entry of metadata.exercises) {
    const definition = library.exercises.find((exercise) => exercise.id === entry.exercise_id)!;
    compareDefinitionFields(
      exercises.find((exercise) => exercise.exerciseId === entry.exercise_id),
      {
        namePt: definition.name_pt,
        definition: definition as unknown as JsonValue,
        measurementType: entry.measurement_type,
        loadApplicable: entry.load_applicable,
        loadUnit: entry.load_unit,
        normalizationRule: entry.normalization_rule as unknown as JsonValue,
      },
      librarySource.path,
      "exercises",
      issues,
    );
  }
}

export function validateTrainingPlanParity(
  source: PlanDefinitionSource,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const plan = source.document as unknown as TrainingPlan;
  const batch = findSourceBatch(persisted.batches, source.path, source.sha256);
  const versions = persisted.trainingPlans.filter(
    (entry) => entry.planId === plan.plan_id && entry.version === plan.version,
  );
  compareDefinitionCount(versions.length, 1, source.path, "trainingPlans", issues);
  const version = versions[0];
  compareDefinitionFields(
    version,
    {
      planId: plan.plan_id,
      version: plan.version,
      sourceStatus: plan.status,
      sourceCreatedOn: civilDateTimestamp(plan.created_at),
      sourceUpdatedOn: civilDateTimestamp(plan.last_updated),
      importBatchId: batch?.id ?? null,
    },
    source.path,
    "trainingPlans",
    issues,
  );
  if (!version) return;
  const sessions = persisted.sessions.filter(
    (session) => session.trainingPlanVersionId === version.id,
  );
  compareDefinitionCount(
    sessions.length,
    Object.keys(plan.sessions).length,
    source.path,
    "sessions",
    issues,
  );
  for (const [sessionId, definition] of Object.entries(plan.sessions)) {
    const session = sessions.find((entry) => entry.sessionId === sessionId);
    compareDefinitionFields(
      session,
      {
        name: definition.name,
        targetDurationMinutes: definition.target_duration_minutes,
        shortDurationMinutes: definition.short_version_target_minutes ?? null,
        intensity: definition.intensity ?? null,
        notes: definition.notes ?? null,
      },
      source.path,
      "sessions",
      issues,
    );
    if (!session) continue;
    const prescriptions = persisted.prescriptions.filter(
      (entry) => entry.sessionDefinitionId === session.id,
    );
    compareDefinitionCount(
      prescriptions.length,
      definition.exercises.length,
      source.path,
      "prescriptions",
      issues,
    );
    for (const [index, exercise] of definition.exercises.entries()) {
      const prescription = prescriptions.find((entry) => entry.ordinal === index + 1);
      const reviewed = persisted.exercises.find(
        (entry) => entry.id === prescription?.exerciseDefinitionId,
      );
      const metadataBatch = persisted.batches.find(
        (entry) => entry.id === reviewed?.metadataImportBatchId,
      );
      const libraryBatch = persisted.batches.find(
        (entry) => entry.id === reviewed?.libraryImportBatchId,
      );
      const metadata = metadataBatch?.sourceDocument as unknown as ExecutionMetadata | undefined;
      const library = libraryBatch?.sourceDocument as unknown as ExerciseLibrary | undefined;
      const dose = metadata?.exercises
        ?.find((entry) => entry.exercise_id === exercise.exercise_id)
        ?.normalization_rule.prescriptions.find((entry) => entry.source_text === exercise.reps);
      compareDefinitionFields(
        prescription,
        {
          trainingPlanVersionId: version.id,
          sets: exercise.sets,
          prescribedText: exercise.reps,
          restSeconds: exercise.rest_seconds ?? null,
          priority: exercise.priority ?? null,
          notes: exercise.notes ?? null,
          normalizedDose: (dose ?? null) as unknown as JsonValue,
        },
        source.path,
        "prescriptions",
        issues,
      );
      compareDefinitionFields(
        reviewed,
        { exerciseId: exercise.exercise_id },
        source.path,
        "prescriptionExercise",
        issues,
      );
      if (!dose || !library?.exercises?.some((entry) => entry.id === exercise.exercise_id))
        issues.push({
          code: "FIELD_MISMATCH",
          sourcePath: source.path,
          entity: "prescriptionExercise",
          field: "sourceLineage",
        });
    }
  }
}
