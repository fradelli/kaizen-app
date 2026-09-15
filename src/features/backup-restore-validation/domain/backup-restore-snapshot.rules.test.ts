import { describe, expect, it } from "vitest";
import type { RecoverySnapshot } from "./backup-restore-validation.types";
import { assertRecoverySnapshotsMatch } from "./backup-restore-snapshot.rules";

const snapshot: RecoverySnapshot = {
  entityCounts: { workspace: 1 },
  workspaceCounts: { assignments: 2 },
  activePlans: ["nutrition:plan:1", "training:plan:1"],
  canaryRows: ["workspace:id"],
};

describe("comparação da recuperação", () => {
  it("aceita snapshots idênticos", () => {
    expect(() => assertRecoverySnapshotsMatch(snapshot, structuredClone(snapshot))).not.toThrow();
  });

  it("rejeita qualquer divergência sem expor seu conteúdo", () => {
    expect(() =>
      assertRecoverySnapshotsMatch(snapshot, {
        ...snapshot,
        workspaceCounts: { assignments: 1 },
      }),
    ).toThrow(expect.objectContaining({ code: "VALIDATION_FAILED" }));
  });
});
