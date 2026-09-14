import "server-only";
import type {
  ImportTransaction,
  CreatedDefinitionCounts,
} from "./plan-definition-persistence.types";
import { recordCreatedDefinition, throwSourceConflict } from "./plan-definition-persistence.utils";
import type { PlanDefinitionSnapshot } from "../domain/plan-definition-import.types";
import { toPrismaJson } from "./plan-definition.mapper";
import type { SourceImportResult } from "./plan-definition-persistence.types";
export async function persistSourceImportBatches(
  tx: ImportTransaction,
  snapshot: PlanDefinitionSnapshot,
  created: CreatedDefinitionCounts,
  now: () => Date,
) {
  const batches = new Map<string, string>();
  const fresh: string[] = [];
  const report: SourceImportResult[] = [];
  for (const source of snapshot.sources) {
    const existing = await tx.importBatch.findUnique({
      where: { sourcePath_sourceSha256: { sourcePath: source.path, sourceSha256: source.sha256 } },
    });
    if (existing && existing.result !== "completed") throwSourceConflict();
    const batch =
      existing ??
      (await tx.importBatch.create({
        data: {
          sourceKind: source.kind,
          sourcePath: source.path,
          sourceSha256: source.sha256,
          sourceSchemaVersion: source.schemaVersion,
          applicationCommit: snapshot.commit,
          sourceDocument: toPrismaJson(source.document),
          startedAt: now(),
          result: "in_progress",
        },
      }));
    batches.set(source.path, batch.id);
    if (!existing) {
      fresh.push(batch.id);
      recordCreatedDefinition(created, "batches");
    }
    report.push({
      path: source.path,
      sha256: source.sha256,
      result: existing ? "reused" : "imported",
    });
  }
  return { batches, fresh, report };
}
