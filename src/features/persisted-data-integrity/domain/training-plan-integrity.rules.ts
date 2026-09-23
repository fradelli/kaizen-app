import type {
  PlanDefinitionSnapshot,
  PlanDefinitionSource,
} from "../../plan-definition-import/domain/plan-definition-import.types";
import { findPlanDefinitionSource } from "../../plan-definition-import/domain/plan-definition-source.utils";
import type { IntegrityIssue, PersistedDefinitionSnapshot } from "./persisted-data-integrity.types";
import {
  civilDateTimestamp,
  compareDefinitionCount,
  compareDefinitionFields,
  findSourceBatch,
} from "./definition-parity.utils";
import { validateTrainingSessionParity } from "./training-session-integrity.rules";

export function validateTrainingPlanParity(
  source: PlanDefinitionSource<"training_plan">,
  canonical: PlanDefinitionSnapshot,
  persisted: PersistedDefinitionSnapshot,
  issues: IntegrityIssue[],
): void {
  const library = findPlanDefinitionSource(canonical.sources, "exercise_library");
  const metadata = findPlanDefinitionSource(canonical.sources, "execution_metadata");
  const schedule = findPlanDefinitionSource(canonical.sources, "training_schedule");
  const pointer = findPlanDefinitionSource(canonical.sources, "training_pointer");
  if (!library || !metadata) return;
  const plan = source.document;
  const batch = findSourceBatch(persisted.batches, source.path, source.sha256);
  const versions = persisted.trainingPlans.filter(
    (entry) => entry.planId === plan.plan_id && entry.version === plan.version,
  );
  compareDefinitionCount(versions.length, 1, source.path, "trainingPlans", issues);
  const version = versions[0];
  const isActivePlan = pointer?.document.active_plan_path === source.path;
  const historicalScheduleBatch = persisted.batches.find(
    (entry) =>
      entry.sourceKind === "training_schedule" &&
      entry.sourceSha256 === version?.weeklyScheduleSha256,
  );
  const expectedSchedule = isActivePlan
    ? schedule?.document
    : historicalScheduleBatch?.sourceDocument;
  const expectedScheduleSha256 = isActivePlan
    ? schedule?.sha256
    : historicalScheduleBatch?.sourceSha256;
  compareDefinitionFields(
    version,
    {
      planId: plan.plan_id,
      version: plan.version,
      sourceStatus: plan.status,
      sourceCreatedOn: civilDateTimestamp(plan.created_at),
      sourceUpdatedOn: civilDateTimestamp(plan.last_updated),
      importBatchId: batch?.id ?? null,
      weeklySchedule: expectedSchedule ?? null,
      weeklyScheduleSha256: expectedScheduleSha256 ?? null,
    },
    source.path,
    "trainingPlans",
    issues,
  );
  if (version)
    validateTrainingSessionParity(
      source,
      version,
      library.document,
      metadata.document,
      persisted,
      issues,
    );
}
