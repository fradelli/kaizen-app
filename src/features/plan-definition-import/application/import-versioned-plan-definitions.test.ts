import { describe, expect, it, vi } from "vitest";
import { importVersionedPlanDefinitions } from "./import-versioned-plan-definitions";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionImportReport,
} from "../domain/plan-definition-import.types";
describe("caso de uso de importação", () => {
  const snapshot: PlanDefinitionSnapshot = {
    commit: "a".repeat(40),
    sources: [],
    documents: new Map(),
    availablePaths: new Set(),
  };
  it("valida a mesma origem antes de delegar persistência", async () => {
    const order: string[] = [];
    const report: PlanDefinitionImportReport = {
      commit: snapshot.commit,
      environment: "local",
      result: "no-op",
      sources: [],
      activationsChanged: 0,
      created: {},
    };
    const repository = {
      persistSnapshot: vi.fn(async (value: PlanDefinitionSnapshot) => {
        expect(value).toBe(snapshot);
        order.push("persist");
        return report;
      }),
    };
    const validateSnapshot = vi.fn((value: PlanDefinitionSnapshot) => {
      expect(value).toBe(snapshot);
      order.push("validate");
    });
    expect(
      await importVersionedPlanDefinitions(
        {
          readSnapshot: async () => snapshot,
          validateSnapshot,
          repository,
        },
        "local",
      ),
    ).toBe(report);
    expect(order).toEqual(["validate", "persist"]);
    expect(validateSnapshot).toHaveBeenCalledTimes(1);
  });
  it("falha de validação não chama a persistência", async () => {
    const repository = { persistSnapshot: vi.fn() };
    await expect(
      importVersionedPlanDefinitions(
        {
          readSnapshot: async () => snapshot,
          validateSnapshot: () => {
            throw new Error("invalid");
          },
          repository,
        },
        "local",
      ),
    ).rejects.toThrow("invalid");
    expect(repository.persistSnapshot).not.toHaveBeenCalled();
  });
});
