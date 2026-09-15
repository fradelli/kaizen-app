import type { PlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  ExecutionMetadata,
  ExerciseLibrary,
  TrainingPlan,
} from "../../plan-definition-import/domain/plan-definition-source.types";
import type {
  IntegrityIssue,
  PersistedDefinitionSnapshot,
  PersistedTrainingPlan,
  PersistedTrainingSession,
} from "./persisted-data-integrity.types";
import { compareDefinitionCount, compareDefinitionFields } from "./definition-parity.utils";

type TrainingSession = TrainingPlan["sessions"][string];

export function validateTrainingPrescriptionParity(
  source: PlanDefinitionSource<"training_plan">,
  version: PersistedTrainingPlan,
  session: PersistedTrainingSession,
  definition: TrainingSession,
  library: ExerciseLibrary,
  metadata: ExecutionMetadata,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
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
    const dose = metadata.exercises
      .find((entry) => entry.exercise_id === exercise.exercise_id)
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
        normalizedDose: dose ?? null,
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
    if (!dose || !library.exercises.some((entry) => entry.id === exercise.exercise_id))
      issues.push({
        code: "FIELD_MISMATCH",
        sourcePath: source.path,
        entity: "prescriptionExercise",
        field: "sourceLineage",
      });
  }
}
