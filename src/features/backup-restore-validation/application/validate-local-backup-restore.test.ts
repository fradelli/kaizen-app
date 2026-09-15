import { describe, expect, it, vi } from "vitest";
import type { RecoverySnapshot } from "../domain/backup-restore-validation.types";
import { validateLocalBackupRestore } from "./validate-local-backup-restore";
import type { LocalBackupRestoreValidationDependencies } from "./validate-local-backup-restore.types";

const snapshot: RecoverySnapshot = {
  entityCounts: { workspaces: 1 },
  workspaceCounts: { trainingAssignments: 1 },
  activePlans: ["training:plan:1"],
  canaryRows: ["0:id"],
};

function createDependencies(
  overrides: Partial<LocalBackupRestoreValidationDependencies> = {},
): LocalBackupRestoreValidationDependencies {
  const canary = {
    workspaceId: "workspace",
    pairingRateLimitId: "pairing-rate-limit",
    trainingAssignmentId: "training-assignment",
    trainingExecutionId: "training-execution",
    exerciseExecutionId: "exercise-execution",
    setExecutionId: "set-execution",
    nutritionAssignmentId: "nutrition-assignment",
    mealExecutionId: "meal-execution",
  };
  const times = [0, 12, 20, 35];
  return {
    startEnvironment: vi.fn(async () => undefined),
    prepareSource: vi.fn(async () => ({ commit: "a".repeat(40), canary })),
    assertSourceIntegrity: vi.fn(async () => undefined),
    readSourceSnapshot: vi.fn(async () => snapshot),
    createBackup: vi.fn(async () => ({ path: "temporary", sizeBytes: 42, sha256: "b".repeat(64) })),
    assertRestoreTargetEmpty: vi.fn(async () => undefined),
    restoreBackup: vi.fn(async () => undefined),
    assertRestoredMigrationsCurrent: vi.fn(async () => undefined),
    readRestoredSnapshot: vi.fn(async () => structuredClone(snapshot)),
    assertRestoredIntegrity: vi.fn(async () => undefined),
    readPostgresVersion: vi.fn(async () => "postgres (PostgreSQL) 18.6"),
    cleanup: vi.fn(async () => undefined),
    now: vi.fn(() => times.shift() ?? 35),
    ...overrides,
  };
}

describe("validação local de backup e restauração", () => {
  it("orquestra a recuperação e retorna somente evidência sanitizada", async () => {
    await expect(validateLocalBackupRestore(createDependencies())).resolves.toMatchObject({
      result: "valid",
      backupDurationMs: 12,
      restoreDurationMs: 15,
      identitiesPreserved: true,
    });
  });

  it("sempre limpa o ambiente após uma falha", async () => {
    const cleanup = vi.fn(async () => undefined);
    const dependencies = createDependencies({
      restoreBackup: vi.fn(async () => {
        throw new Error("falha sintética");
      }),
      cleanup,
    });
    await expect(validateLocalBackupRestore(dependencies)).rejects.toThrow("falha sintética");
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("preserva a falha operacional quando a limpeza também falha", async () => {
    const dependencies = createDependencies({
      startEnvironment: vi.fn(async () => {
        throw new Error("docker indisponível");
      }),
      cleanup: vi.fn(async () => {
        throw new Error("limpeza indisponível");
      }),
    });
    await expect(validateLocalBackupRestore(dependencies)).rejects.toThrow("docker indisponível");
  });

  it("propaga uma falha de limpeza posterior à operação bem-sucedida", async () => {
    const dependencies = createDependencies({
      cleanup: vi.fn(async () => {
        throw new Error("limpeza indisponível");
      }),
    });
    await expect(validateLocalBackupRestore(dependencies)).rejects.toThrow("limpeza indisponível");
  });
});
