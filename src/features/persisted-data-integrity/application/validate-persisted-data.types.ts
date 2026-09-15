import type { PlanDefinitionSnapshot } from "../../plan-definition-import/domain/plan-definition-import.types";
import type { PersistedDefinitionSnapshot } from "../domain/persisted-data-integrity.types";

export type PersistedDataIntegrityDependencies = Readonly<{
  readCanonicalSnapshot: () => Promise<PlanDefinitionSnapshot>;
  readSnapshotAtCommit: (commit: string) => Promise<PlanDefinitionSnapshot>;
  validateCanonicalSnapshot: (snapshot: PlanDefinitionSnapshot) => void;
  readPersistedSnapshot: () => Promise<PersistedDefinitionSnapshot>;
}>;
