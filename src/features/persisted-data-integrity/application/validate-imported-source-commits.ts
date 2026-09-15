import type { PlanDefinitionSnapshot } from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  PersistedDefinitionSnapshot,
  IntegrityIssue,
} from "../domain/persisted-data-integrity.types";
import { findSourceBatch } from "../domain/definition-parity.utils";

export async function validateImportedSourceCommits(
  canonical: PlanDefinitionSnapshot,
  persisted: PersistedDefinitionSnapshot,
  readSnapshotAtCommit: (commit: string) => Promise<PlanDefinitionSnapshot>,
  issues: IntegrityIssue[],
): Promise<void> {
  const snapshots = new Map<string, PlanDefinitionSnapshot | null>([[canonical.commit, canonical]]);
  for (const source of canonical.sources) {
    const batch = findSourceBatch(persisted.batches, source.path, source.sha256);
    if (
      !batch ||
      typeof batch.applicationCommit !== "string" ||
      !/^[0-9a-f]{40}$/.test(batch.applicationCommit)
    )
      continue;
    const commit = batch.applicationCommit;
    if (!snapshots.has(commit)) {
      try {
        snapshots.set(commit, await readSnapshotAtCommit(commit));
      } catch {
        snapshots.set(commit, null);
      }
    }
    const historical = snapshots.get(commit);
    const committedSource = historical?.sources.find((entry) => entry.path === source.path);
    if (!historical || historical.commit !== commit || committedSource?.sha256 !== source.sha256)
      issues.push({
        code: "FIELD_MISMATCH",
        sourcePath: source.path,
        entity: "batches",
        field: "sourceCommit",
      });
  }
}
