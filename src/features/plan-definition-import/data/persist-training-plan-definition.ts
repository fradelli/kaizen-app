import "server-only";
import type {
  ImportTransaction,
  CreatedDefinitionCounts,
} from "./plan-definition-persistence.types";
import { recordCreatedDefinition, throwSourceConflict } from "./plan-definition-persistence.utils";
import type { PlanDefinitionSource } from "../domain/plan-definition-import.types";
import type { ExecutionMetadata, TrainingPlan } from "../domain/plan-definition-source.types";
import { toPrismaDoseJson, mapTrainingPlanVersion } from "./plan-definition.mapper";
export async function persistTrainingPlanDefinition(
  tx: ImportTransaction,
  source: PlanDefinitionSource,
  batchId: string,
  exercises: ReadonlyMap<string, string>,
  metadata: ExecutionMetadata,
  created: CreatedDefinitionCounts,
): Promise<string> {
  const plan = source.document as unknown as TrainingPlan;
  const existing = await tx.trainingPlanVersion.findUnique({
    where: { planId_version: { planId: plan.plan_id, version: plan.version } },
  });
  if (existing) {
    if (existing.importBatchId !== batchId) throwSourceConflict();
    return existing.id;
  }
  const version = await tx.trainingPlanVersion.create({
    data: mapTrainingPlanVersion(source, batchId),
  });
  recordCreatedDefinition(created, "trainingPlans");
  for (const [sessionId, session] of Object.entries(plan.sessions)) {
    const definition = await tx.trainingSessionDefinition.create({
      data: {
        trainingPlanVersionId: version.id,
        sessionId,
        name: session.name,
        targetDurationMinutes: session.target_duration_minutes,
        shortDurationMinutes: session.short_version_target_minutes ?? null,
        intensity: session.intensity ?? null,
        notes: session.notes ?? null,
      },
    });
    recordCreatedDefinition(created, "trainingSessions");
    for (const [index, item] of session.exercises.entries()) {
      const exerciseId = exercises.get(item.exercise_id);
      const dose = metadata.exercises
        .find((entry) => entry.exercise_id === item.exercise_id)
        ?.normalization_rule.prescriptions.find((entry) => entry.source_text === item.reps);
      if (!exerciseId || !dose) throwSourceConflict();
      await tx.trainingExerciseDefinition.create({
        data: {
          trainingPlanVersionId: version.id,
          sessionDefinitionId: definition.id,
          exerciseDefinitionId: exerciseId,
          ordinal: index + 1,
          sets: item.sets,
          prescribedText: item.reps,
          restSeconds: item.rest_seconds ?? null,
          priority: item.priority ?? null,
          notes: item.notes ?? null,
          normalizedDose: toPrismaDoseJson(dose),
        },
      });
      recordCreatedDefinition(created, "trainingPrescriptions");
    }
  }
  return version.id;
}
