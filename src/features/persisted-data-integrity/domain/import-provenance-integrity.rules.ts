import type {
  PlanDefinitionSnapshot,
  PlanDefinitionImportEnvironment,
} from "../../plan-definition-import/domain/plan-definition-import.types";
import {
  findPlanDefinitionSource,
  findPlanDefinitionSourceByPath,
} from "../../plan-definition-import/domain/plan-definition-source.utils";
import type { PersistedDefinitionSnapshot, IntegrityIssue } from "./persisted-data-integrity.types";
import { compareDefinitionFields, findSourceBatch } from "./definition-parity.utils";

function readPersistedPlanSelection(
  document: unknown,
): { active_plan_path?: unknown; active_plan_id?: unknown } | undefined {
  return document && typeof document === "object" && !Array.isArray(document)
    ? document
    : undefined;
}

export function validateImportProvenance(
  source: PlanDefinitionSnapshot,
  persisted: PersistedDefinitionSnapshot,
  environment: PlanDefinitionImportEnvironment,
  issues: IntegrityIssue[],
): void {
  for (const definition of source.sources) {
    const batch = findSourceBatch(persisted.batches, definition.path, definition.sha256);
    compareDefinitionFields(
      batch,
      {
        sourceKind: definition.kind,
        sourceSchemaVersion: definition.schemaVersion,
        sourceDocument: definition.document,
        result: "completed",
        errorCode: null,
      },
      definition.path,
      "batches",
      issues,
    );
    if (
      batch &&
      (typeof batch.finishedAt !== "string" ||
        !Number.isFinite(Date.parse(batch.finishedAt)) ||
        typeof batch.applicationCommit !== "string" ||
        !/^[0-9a-f]{40}$/.test(batch.applicationCommit))
    )
      issues.push({
        code: "FIELD_MISMATCH",
        sourcePath: definition.path,
        entity: "batches",
        field: "completionProvenance",
      });
  }
  for (const domain of ["training", "nutrition"] as const) {
    const pointer = findPlanDefinitionSource(source.sources, `${domain}_pointer`);
    if (!pointer) continue;
    const planSource = findPlanDefinitionSourceByPath(
      source.sources,
      `${domain}_plan`,
      pointer.document.active_plan_path,
    );
    if (!planSource) continue;
    const batch = findSourceBatch(persisted.batches, planSource.path, planSource.sha256);
    const versions = domain === "training" ? persisted.trainingPlans : persisted.nutritionPlans;
    const version = versions.find((entry) => entry.importBatchId === batch?.id);
    const active = persisted.activations.filter(
      (entry) =>
        entry.domain === domain &&
        entry.logicalEnvironment === environment &&
        entry.supersededAt === null,
    );
    const activeVersion = active[0]?.[`${domain}PlanVersionId`];
    // O importador reutiliza a ativação quando a versão não muda: o lote do ponteiro
    // pode ser anterior, mas precisa documentar exatamente a mesma seleção.
    const pointerBatch = persisted.batches.find(
      (entry) => entry.id === active[0]?.pointerImportBatchId,
    );
    const selected = readPersistedPlanSelection(pointerBatch?.sourceDocument);
    if (
      active.length !== 1 ||
      !version ||
      activeVersion !== version.id ||
      pointerBatch?.sourceKind !== `${domain}_pointer` ||
      pointerBatch.result !== "completed" ||
      selected?.active_plan_path !== planSource.path ||
      selected.active_plan_id !== planSource.document.plan_id
    )
      issues.push({
        code: "ACTIVE_PLAN_MISMATCH",
        sourcePath: pointer.path,
        entity: "activations",
        field: "selectedVersion",
      });
  }
}
