import "server-only";
import type { ImportTransaction } from "./plan-definition-persistence.types";
import { throwSourceConflict } from "./plan-definition-persistence.utils";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionImportEnvironment,
} from "../domain/plan-definition-import.types";
export async function activateSelectedPlanDefinitions(
  tx: ImportTransaction,
  snapshot: PlanDefinitionSnapshot,
  environment: PlanDefinitionImportEnvironment,
  versions: ReadonlyMap<string, string>,
  batches: ReadonlyMap<string, string>,
  now: () => Date,
): Promise<number> {
  let activationsChanged = 0;
  for (const domain of ["training", "nutrition"] as const) {
    const pointer = snapshot.sources.find((source) => source.kind === `${domain}_pointer`)!;
    const versionId = versions.get(pointer.document.active_plan_path as string);
    if (!versionId) throwSourceConflict();
    const existing = await tx.planActivation.findFirst({
      where: { domain, logicalEnvironment: environment, supersededAt: null },
    });
    if (
      (domain === "training"
        ? existing?.trainingPlanVersionId
        : existing?.nutritionPlanVersionId) === versionId
    )
      continue;
    const activatedAt = now();
    if (existing)
      await tx.planActivation.update({
        where: { id: existing.id },
        data: { supersededAt: activatedAt },
      });
    await tx.planActivation.create({
      data: {
        domain,
        logicalEnvironment: environment,
        pointerImportBatchId: batches.get(pointer.path)!,
        activatedAt,
        ...(domain === "training"
          ? { trainingPlanVersionId: versionId }
          : { nutritionPlanVersionId: versionId }),
      },
    });
    activationsChanged++;
  }
  return activationsChanged;
}
