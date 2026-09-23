import type { PlanDefinitionSource } from "./plan-definition-import.types";
import type { ExecutionMetadata } from "./plan-definition-source.types";

export type TrainingSessionAssignment = Readonly<{
  assignmentRole: "main" | "preparation" | "mobility";
  compatiblePreparationSessionIds: readonly string[];
}>;

export function resolveTrainingSessionAssignment(
  metadata: ExecutionMetadata,
  plan: PlanDefinitionSource<"training_plan">["document"],
  sessionId: string,
): TrainingSessionAssignment {
  const explicit = metadata.sessions?.find(
    (entry) =>
      entry.plan_id === plan.plan_id &&
      entry.plan_version === plan.version &&
      entry.session_id === sessionId,
  );
  if (explicit) {
    return {
      assignmentRole: explicit.assignment_role,
      compatiblePreparationSessionIds: explicit.compatible_preparation_session_ids,
    };
  }

  const preparationIds = new Set(["pre_upper_warmup", "pre_lower_warmup", "pre_footvolley_warmup"]);
  if (preparationIds.has(sessionId)) {
    return { assignmentRole: "preparation", compatiblePreparationSessionIds: [] };
  }
  const compatiblePreparationId = sessionId.startsWith("lower_")
    ? "pre_lower_warmup"
    : sessionId.startsWith("upper_")
      ? "pre_upper_warmup"
      : null;
  return {
    assignmentRole: "main",
    compatiblePreparationSessionIds:
      compatiblePreparationId && Object.hasOwn(plan.sessions, compatiblePreparationId)
        ? [compatiblePreparationId]
        : [],
  };
}
