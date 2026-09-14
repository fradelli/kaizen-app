import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPlanDefinitionsFromGit, sourceKind } from "./read-plan-definitions-from-git";
import { validatePlanDefinitionSnapshot } from "./validate-plan-definition-snapshot";
import { parseImportArguments } from "./plan-definition-import-cli.utils";
import {
  toCivilDate,
  toMealTime,
  mapTrainingPlanVersion,
  mapNutritionPlanVersion,
  toPrismaDoseJson,
} from "./plan-definition.mapper";
import type { PlanDefinitionSnapshot } from "../domain/plan-definition-import.types";
let snapshot: PlanDefinitionSnapshot;
beforeAll(async () => {
  snapshot = await readPlanDefinitionsFromGit(process.cwd());
});
const temporaryRepositories: string[] = [];
afterAll(() => {
  for (const path of temporaryRepositories) rmSync(path, { recursive: true, force: true });
});

describe("origem, validação e configuração de importação", () => {
  it("valida snapshot do commit e mapeia datas sem conversão civil", () => {
    expect(() => validatePlanDefinitionSnapshot(snapshot)).not.toThrow();
    expect(toCivilDate("2026-09-14").toISOString()).toBe("2026-09-14T00:00:00.000Z");
    expect(toMealTime(null)).toBeNull();
    expect(toMealTime("12:30")?.toISOString()).toBe("1970-01-01T12:30:00.000Z");
    const training = snapshot.sources.find((source) => source.kind === "training_plan")!;
    expect(mapTrainingPlanVersion(training, "batch")).toMatchObject({
      planId: training.document.plan_id,
      version: training.document.version,
      importBatchId: "batch",
    });
    const nutrition = snapshot.sources.find((source) => source.kind === "nutrition_plan")!;
    expect(mapNutritionPlanVersion(nutrition, "batch")).toMatchObject({
      planId: nutrition.document.plan_id,
      importBatchId: "batch",
      effectiveUntil: null,
    });
    expect(
      mapNutritionPlanVersion(
        { ...nutrition, document: { ...nutrition.document, effective_until: "2026-09-30" } },
        "batch",
      ).effectiveUntil,
    ).toEqual(toCivilDate("2026-09-30"));
    const dose = {
      source_text: "3",
      minimum: 3,
      maximum: 3,
      unit: "repetitions",
      scope: "total",
      qualifier: null,
    };
    expect(toPrismaDoseJson(dose)).toEqual(dose);
  });
  it.each([
    "data/private.json",
    "../data/exercises.json",
    "constructor",
    "__proto__",
    "data/plans/../private.json",
  ])("não seleciona fonte fora da allowlist: %s", (path) => {
    expect(sourceKind(path)).toBeUndefined();
  });
  it.each(["main", "HEAD~1", "--help", "private-secret"])(
    "rejeita revisão não fixada sem expor entrada: %s",
    async (revision) => {
      await expect(readPlanDefinitionsFromGit(process.cwd(), revision)).rejects.toMatchObject({
        code: "SOURCE_INVALID",
        message: "Importação canônica falhou: SOURCE_INVALID.",
      });
    },
  );
  it("usa bytes do commit mesmo com worktree alterado", async () => {
    const root = mkdtempSync(join(tmpdir(), "kaizen-import-reader-"));
    temporaryRepositories.push(root);
    mkdirSync(join(root, "data"));
    mkdirSync(join(root, "docs/migration"), { recursive: true });
    writeFileSync(
      join(root, "docs/migration/MIGRATION-MANIFEST.md"),
      "# Manifesto de fixture nativa\n",
    );
    const bytes = '{"schema_version":"1.0.0","exercises":[]}\n';
    writeFileSync(join(root, "data/exercises.json"), bytes);
    const git = (args: string[]) => execFileSync("git", ["-C", root, ...args], { stdio: "ignore" });
    git(["init"]);
    git(["add", "."]);
    git([
      "-c",
      "user.name=Import test",
      "-c",
      "user.email=import-test@example.invalid",
      "commit",
      "-m",
      "fixture",
    ]);
    writeFileSync(join(root, "data/exercises.json"), "invalid private worktree");
    const source = (await readPlanDefinitionsFromGit(root)).sources[0];
    expect(source.sha256).toBe(createHash("sha256").update(bytes).digest("hex"));
    expect(source.document.exercises).toEqual([]);
    writeFileSync(
      join(root, "docs/migration/MIGRATION-MANIFEST.md"),
      "| blocked | legacy | commit | data/exercises.json | hash | data/exercises.json | hash | COPY | DO_NOT_PUBLISH | SKIPPED | blocked | null |\n",
    );
    git(["add", "docs/migration/MIGRATION-MANIFEST.md"]);
    git([
      "-c",
      "user.name=Import test",
      "-c",
      "user.email=import-test@example.invalid",
      "commit",
      "-m",
      "deny legacy fixture",
    ]);
    await expect(readPlanDefinitionsFromGit(root)).rejects.toMatchObject({
      code: "SOURCE_INVALID",
    });
  });
  it("rejeita ausência de fonte e ponteiro inválido com erro sanitizado", () => {
    expect(() => validatePlanDefinitionSnapshot({ ...snapshot, commit: "invalid" })).toThrow(
      "SOURCE_INVALID",
    );
    expect(() => validatePlanDefinitionSnapshot({ ...snapshot, sources: [] })).toThrow(
      "SOURCE_INVALID",
    );
    const documents = new Map(snapshot.documents);
    documents.set("data/active.json", null);
    expect(() => validatePlanDefinitionSnapshot({ ...snapshot, documents })).toThrow(
      "SOURCE_INVALID",
    );
  });
  it.each([
    ["local", "local"],
    ["preview", "preview"],
    ["production", "staging"],
    ["production", "production"],
  ])("permite ambiente coerente %s / %s", (app, environment) => {
    expect(parseImportArguments(["--environment", environment], app)).toEqual({
      environment,
      commit: "HEAD",
    });
  });
  it("aceita SHA completo como origem explícita", () => {
    expect(
      parseImportArguments(["--environment", "local", "--commit", snapshot.commit], "local").commit,
    ).toBe(snapshot.commit);
  });
  it.each([
    { args: [] },
    { args: ["--environment", "production"] },
    { args: ["--environment", "local", "--commit", "main"] },
    { args: ["--unknown"] },
    { args: ["local"] },
  ])("rejeita argumentos/destino inválidos: %o", ({ args }) => {
    expect(() => parseImportArguments(args, "local")).toThrow("CLI_INVALID");
  });
});
