import type { PlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  ExecutionMetadata,
  ExerciseLibrary,
} from "../../plan-definition-import/domain/plan-definition-source.types";
import { resolveTrainingSessionAssignment } from "../../plan-definition-import/domain/training-session-assignment.utils";
import type {
  IntegrityIssue,
  PersistedDefinitionSnapshot,
  PersistedTrainingPlan,
} from "./persisted-data-integrity.types";
import { compareDefinitionCount, compareDefinitionFields } from "./definition-parity.utils";
import { validateTrainingPrescriptionParity } from "./training-prescription-integrity.rules";

export function validateTrainingSessionParity(
  source: PlanDefinitionSource<"training_plan">,
  version: PersistedTrainingPlan,
  library: ExerciseLibrary,
  metadata: ExecutionMetadata,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const sessions = persisted.sessions.filter(
    (session) => session.trainingPlanVersionId === version.id,
  );
  compareDefinitionCount(
    sessions.length,
    Object.keys(source.document.sessions).length,
    source.path,
    "sessions",
    issues,
  );
  for (const [sessionId, definition] of Object.entries(source.document.sessions)) {
    const session = sessions.find((entry) => entry.sessionId === sessionId);
    const assignment = resolveTrainingSessionAssignment(metadata, source.document, sessionId);
    compareDefinitionFields(
      session,
      {
        name: definition.name,
        targetDurationMinutes: definition.target_duration_minutes,
        shortDurationMinutes: definition.short_version_target_minutes ?? null,
        intensity: definition.intensity ?? null,
        notes: definition.notes ?? null,
        assignmentRole: assignment.assignmentRole,
        compatiblePreparationSessionIds: assignment.compatiblePreparationSessionIds,
      },
      source.path,
      "sessions",
      issues,
    );
    if (session)
      validateTrainingPrescriptionParity(
        source,
        version,
        session,
        definition,
        library,
        metadata,
        persisted,
        issues,
      );
  }
}
