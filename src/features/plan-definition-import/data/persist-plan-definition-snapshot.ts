import "server-only";
import type {
  ImportTransaction,
  CreatedDefinitionCounts,
} from "./plan-definition-persistence.types";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionImportEnvironment,
  PlanDefinitionImportReport,
} from "../domain/plan-definition-import.types";
import { persistSourceImportBatches } from "./persist-source-import-batches";
import { persistReviewedExerciseDefinitions } from "./persist-reviewed-exercise-definitions";
import { persistTrainingPlanDefinition } from "./persist-training-plan-definition";
import { persistNutritionPlanDefinition } from "./persist-nutrition-plan-definition";
import { activateSelectedPlanDefinitions } from "./activate-selected-plan-definitions";
import { findPlanDefinitionSource } from "../domain/plan-definition-source.utils";
export async function persistPlanDefinitionSnapshot(
  tx: ImportTransaction,
  snapshot: PlanDefinitionSnapshot,
  environment: PlanDefinitionImportEnvironment,
  now: () => Date,
): Promise<PlanDefinitionImportReport> {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(7210503)::text`;
  const created: CreatedDefinitionCounts = {};
  const { batches, fresh, report } = await persistSourceImportBatches(tx, snapshot, created, now);
  const { exercises, metadata } = await persistReviewedExerciseDefinitions(
    tx,
    snapshot,
    batches,
    created,
  );
  const versions = new Map<string, string>();
  const trainingSchedule = findPlanDefinitionSource(snapshot.sources, "training_schedule");
  const trainingPointer = findPlanDefinitionSource(snapshot.sources, "training_pointer");
  if (!trainingSchedule) throw new Error("A agenda semanal versionada não foi encontrada.");
  if (!trainingPointer) throw new Error("O plano ativo de treino não foi encontrado.");
  for (const source of snapshot.sources) {
    if (source.kind === "training_plan")
      versions.set(
        source.path,
        await persistTrainingPlanDefinition(
          tx,
          source,
          batches.get(source.path)!,
          exercises,
          metadata,
          source.path === trainingPointer.document.active_plan_path ? trainingSchedule : null,
          created,
        ),
      );
    if (source.kind === "nutrition_plan")
      versions.set(
        source.path,
        await persistNutritionPlanDefinition(tx, source, batches.get(source.path)!, created),
      );
  }
  const activationsChanged = await activateSelectedPlanDefinitions(
    tx,
    snapshot,
    environment,
    versions,
    batches,
    now,
  );
  for (const id of fresh)
    await tx.importBatch.update({
      where: { id },
      data: { result: "completed", finishedAt: now() },
    });
  return {
    commit: snapshot.commit,
    environment,
    result: Object.keys(created).length || activationsChanged ? "imported" : "no-op",
    sources: report,
    activationsChanged,
    created,
  };
}
