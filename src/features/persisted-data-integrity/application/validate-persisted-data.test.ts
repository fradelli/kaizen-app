import { describe, expect, it, vi } from "vitest";
import { validatePersistedData } from "./validate-persisted-data";
import { createIntegrityFixture } from "./validate-persisted-data.fixture";
import type { PersistedDefinitionSnapshot } from "../domain/persisted-data-integrity.types";

async function audit(
  persisted: PersistedDefinitionSnapshot,
  canonical = createIntegrityFixture().canonical,
) {
  return validatePersistedData({
    readCanonicalSnapshot: async () => canonical,
    readSnapshotAtCommit: async () => canonical,
    validateCanonicalSnapshot: () => {},
    readPersistedSnapshot: async () => persisted,
  });
}
describe("paridade das definições persistidas", () => {
  it("compara campos, JSON, dose, referências, ordinais e faixas", async () => {
    const fixture = createIntegrityFixture();
    expect(await audit(fixture.persisted, fixture.canonical)).toMatchObject({
      result: "valid",
      issues: [],
    });
  });
  it.each([
    "batches",
    "exercises",
    "trainingPlans",
    "sessions",
    "prescriptions",
    "nutritionPlans",
    "meals",
    "options",
    "dayTypes",
    "dayTypeMeals",
    "activations",
  ] as const)("detecta ausência de %s", async (entity) => {
    const { persisted } = createIntegrityFixture();
    const report = await audit({ ...persisted, [entity]: [] });
    expect(report.result).toBe("invalid");
    expect(report.issues.length).toBeGreaterThan(0);
  });
  it.each([
    ["exercises", "namePt"],
    ["exercises", "definition"],
    ["exercises", "measurementType"],
    ["exercises", "loadApplicable"],
    ["exercises", "normalizationRule"],
    ["trainingPlans", "sourceCreatedOn"],
    ["trainingPlans", "importBatchId"],
    ["sessions", "targetDurationMinutes"],
    ["prescriptions", "sets"],
    ["prescriptions", "normalizedDose"],
    ["prescriptions", "exerciseDefinitionId"],
    ["nutritionPlans", "timezone"],
    ["meals", "timingRules"],
    ["options", "referenceOptionId"],
    ["dayTypes", "minimumKcal"],
    ["dayTypeMeals", "mealId"],
    ["activations", "trainingPlanVersionId"],
    ["batches", "sourceDocument"],
    ["batches", "result"],
    ["batches", "finishedAt"],
    ["batches", "applicationCommit"],
  ] as const)("detecta divergência em %s.%s sem publicar valor", async (entity, field) => {
    const { persisted } = createIntegrityFixture();
    const records = persisted[entity].map((record, index) =>
      index === 0 ? { ...record, [field]: "valor privado sintético" } : record,
    );
    const report = await audit({ ...persisted, [entity]: records });
    expect(report.result).toBe("invalid");
    expect(JSON.stringify(report)).not.toContain("valor privado sintético");
  });
  it("detecta duplicatas e banco vazio tem resultado distinto", async () => {
    const { persisted } = createIntegrityFixture();
    expect(
      (
        await audit({
          ...persisted,
          trainingPlans: [...persisted.trainingPlans, persisted.trainingPlans[0]],
        })
      ).issues,
    ).toContainEqual(expect.objectContaining({ code: "COUNT_MISMATCH" }));
    const empty = Object.fromEntries(
      Object.keys(persisted).map((entity) => [entity, []]),
    ) as unknown as PersistedDefinitionSnapshot;
    expect((await audit(empty)).result).toBe("not-imported");
  });
  it("preserva versões antigas e permite ativação de lote anterior para a mesma seleção", async () => {
    const { persisted, canonical } = createIntegrityFixture();
    const oldPointer = {
      ...persisted.batches[4],
      id: "oldPointer",
      sourceSha256: "f".repeat(64),
      applicationCommit: "b".repeat(40),
    };
    const activations = persisted.activations.map((entry) =>
      entry.domain === "training" ? { ...entry, pointerImportBatchId: oldPointer.id } : entry,
    );
    const report = await audit(
      {
        ...persisted,
        batches: [...persisted.batches, oldPointer],
        activations,
        trainingPlans: [
          ...persisted.trainingPlans,
          { ...persisted.trainingPlans[0], id: "oldPlan", version: "0" },
        ],
      },
      canonical,
    );
    expect(report.result).toBe("valid");
  });
  it("valida a fonte antes de acessar o banco e propaga indisponibilidade", async () => {
    const { canonical } = createIntegrityFixture();
    const read = vi.fn();
    await expect(
      validatePersistedData({
        readCanonicalSnapshot: async () => canonical,
        readSnapshotAtCommit: async () => canonical,
        validateCanonicalSnapshot: () => {
          throw new Error("fonte inválida");
        },
        readPersistedSnapshot: read,
      }),
    ).rejects.toThrow("fonte inválida");
    expect(read).not.toHaveBeenCalled();
    await expect(
      validatePersistedData({
        readCanonicalSnapshot: async () => canonical,
        readSnapshotAtCommit: async () => canonical,
        validateCanonicalSnapshot: () => {},
        readPersistedSnapshot: async () => {
          throw new Error("indisponível");
        },
      }),
    ).rejects.toThrow("indisponível");
  });
});
