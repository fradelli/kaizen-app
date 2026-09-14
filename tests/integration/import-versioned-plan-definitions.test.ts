import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { importVersionedPlanDefinitions } from "@/features/plan-definition-import/application/import-versioned-plan-definitions";
import { readPlanDefinitionsFromGit } from "@/features/plan-definition-import/data/read-plan-definitions-from-git";
import { validatePlanDefinitionSnapshot } from "@/features/plan-definition-import/data/validate-plan-definition-snapshot";
import { PrismaPlanDefinitionImportRepository } from "@/features/plan-definition-import/data/prisma-plan-definition-import-repository";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionSource,
} from "@/features/plan-definition-import/domain/plan-definition-import.types";
import type { PrismaClient } from "@/generated/prisma/client";
import { withImportDatabase } from "./fixtures/import-database.fixture";
import { createDatabaseFixture } from "./fixtures/database.fixture";

async function run(client: PrismaClient, snapshot: PlanDefinitionSnapshot) {
  return importVersionedPlanDefinitions(
    {
      readSnapshot: async () => snapshot,
      validateSnapshot: validatePlanDefinitionSnapshot,
      repository: new PrismaPlanDefinitionImportRepository(client),
    },
    "local",
  );
}
function replace(
  snapshot: PlanDefinitionSnapshot,
  transform: (source: PlanDefinitionSource) => PlanDefinitionSource,
): PlanDefinitionSnapshot {
  const sources = snapshot.sources.map((source) => transform(structuredClone(source)));
  const documents = new Map(snapshot.documents);
  for (const source of sources) documents.set(source.path, source.document);
  return { ...snapshot, sources, documents };
}
async function state(client: PrismaClient) {
  return {
    batches: await client.importBatch.findMany({ orderBy: { sourcePath: "asc" } }),
    activations: await client.planActivation.findMany({ orderBy: { id: "asc" } }),
    training: await client.trainingPlanVersion.findMany({ orderBy: { id: "asc" } }),
    nutrition: await client.nutritionPlanVersion.findMany({ orderBy: { id: "asc" } }),
  };
}

describe("importação canônica em PostgreSQL real", () => {
  it("importa versão alimentar nova com ID estável sem alterar a versão anterior", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      await run(client, snapshot);
      const original = await client.nutritionPlanVersion.findFirstOrThrow();
      const source = snapshot.sources.find((source) => source.kind === "nutrition_plan")!;
      const next = {
        ...structuredClone(source),
        path: "data/nutrition/plans/test-v2.json",
        sha256: "a".repeat(64),
        document: { ...source.document, version: "2.0.0" },
      };
      const updated = replace(snapshot, (entry) =>
        entry.kind === "nutrition_pointer"
          ? {
              ...entry,
              sha256: "b".repeat(64),
              document: { ...entry.document, active_plan_path: next.path },
            }
          : entry,
      );
      const changed = {
        ...updated,
        sources: [...updated.sources, next],
        documents: new Map([...updated.documents, [next.path, next.document]]),
        availablePaths: new Set([...updated.availablePaths, next.path]),
      };
      expect((await run(client, changed)).created.nutritionPlans).toBe(1);
      expect((await run(client, changed)).result).toBe("no-op");
      expect(await client.nutritionPlanVersion.count()).toBe(2);
      expect(await client.nutritionPlanVersion.findUnique({ where: { id: original.id } })).toEqual(
        original,
      );
    }));
  it("materializa fontes, relações, doses e referências e segunda execução é no-op", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      const first = await run(client, snapshot);
      expect(first.result).toBe("imported");
      expect(first.activationsChanged).toBe(2);
      expect(first.created.exercises).toBe(38);
      expect(first.created.trainingPlans).toBe(2);
      expect(first.created.nutritionPlans).toBe(1);
      expect(first.created).toEqual({
        batches: 7,
        exercises: 38,
        trainingPlans: 2,
        trainingSessions: 14,
        trainingPrescriptions: 87,
        nutritionPlans: 1,
        meals: 5,
        mealOptions: 20,
        nutritionDayTypes: 6,
        dayTypeMeals: 30,
      });
      expect(await client.trainingSessionDefinition.count()).toBe(14);
      expect(await client.mealDefinition.count()).toBe(5);
      expect(await client.mealOptionDefinition.count()).toBe(20);
      expect(await client.nutritionDayTypeDefinition.count()).toBe(6);
      expect(await client.nutritionDayTypeMeal.count()).toBe(30);
      const library = snapshot.sources.find((source) => source.kind === "exercise_library")!;
      const libraryBatch = await client.importBatch.findFirstOrThrow({
        where: { sourcePath: library.path },
      });
      expect(libraryBatch.sourceSha256).toBe(library.sha256);
      expect(libraryBatch.sourceDocument).toEqual(library.document);
      expect(await client.trainingExerciseDefinition.count()).toBe(
        first.created.trainingPrescriptions,
      );
      const options = await client.mealOptionDefinition.findMany();
      expect(options.filter((option) => option.referenceOptionId)).toHaveLength(2);
      expect(
        options.find((option) => option.optionId === "dinner_weekend_chicken_poke")
          ?.referenceOptionId,
      ).toBe(options.find((option) => option.optionId === "weekend_chicken_poke")?.id);
      const before = await state(client);
      const second = await run(client, snapshot);
      expect(second).toMatchObject({ result: "no-op", created: {}, activationsChanged: 0 });
      expect(await state(client)).toEqual(before);
    }));
  it("hash conflitante falha e reverte lotes sem tocar ativações", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      await run(client, snapshot);
      const before = await state(client);
      const changed = replace(snapshot, (source) =>
        source.kind === "training_plan" ? { ...source, sha256: "f".repeat(64) } : source,
      );
      await expect(run(client, changed)).rejects.toMatchObject({ code: "SOURCE_CONFLICT" });
      expect(await state(client)).toEqual(before);
    }));
  it("JSON inválido, ponteiro divergente e ciclos falham antes de gravar", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      const invalid = replace(snapshot, (source) =>
        source.kind === "training_plan"
          ? { ...source, document: { schema_version: "1.0.0" } }
          : source,
      );
      await expect(run(client, invalid)).rejects.toMatchObject({ code: "SOURCE_INVALID" });
      const pointer = replace(snapshot, (source) =>
        source.kind === "training_pointer"
          ? { ...source, document: { ...source.document, active_plan_id: "wrong" } }
          : source,
      );
      await expect(run(client, pointer)).rejects.toMatchObject({ code: "SOURCE_INVALID" });
      const missing = replace(snapshot, (source) =>
        source.kind === "training_pointer"
          ? {
              ...source,
              document: { ...source.document, active_plan_path: "data/plans/missing.json" },
            }
          : source,
      );
      await expect(run(client, missing)).rejects.toMatchObject({ code: "SOURCE_INVALID" });
      const cycle = replace(snapshot, (source) => {
        if (source.kind !== "nutrition_plan") return source;
        const meals = source.document.meals as {
          id: string;
          options: { id: string; reference_option?: string }[];
        }[];
        const option = meals
          .flatMap((meal) => meal.options.map((option) => ({ meal, option })))
          .find(({ option }) => option.reference_option)!;
        option.option.reference_option = `${option.meal.id}.${option.option.id}`;
        return source;
      });
      await expect(run(client, cycle)).rejects.toMatchObject({ code: "SOURCE_INVALID" });
      expect(await client.importBatch.count()).toBe(0);
    }));
  it("falha real após biblioteca inserida deixa banco sem projeção parcial", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      await client.$executeRawUnsafe(
        `CREATE FUNCTION reject_imported_plan() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'controlled failure'; END $$`,
      );
      await client.$executeRawUnsafe(
        `CREATE TRIGGER reject_imported_plan BEFORE INSERT ON training_plan_version FOR EACH ROW EXECUTE FUNCTION reject_imported_plan()`,
      );
      await expect(run(client, snapshot)).rejects.toMatchObject({ code: "IMPORT_UNAVAILABLE" });
      expect(await client.importBatch.count()).toBe(0);
      expect(await client.exerciseDefinition.count()).toBe(0);
      expect(await client.planActivation.count()).toBe(0);
    }));
  it("concorrência confirma uma importação e um no-op sem duplicatas", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      const results = await Promise.all([run(client, snapshot), run(client, snapshot)]);
      expect(results.map((result) => result.result).sort()).toEqual(["imported", "no-op"]);
      expect(await client.importBatch.count()).toBe(snapshot.sources.length);
      expect(await client.trainingPlanVersion.count()).toBe(2);
    }));
  it("troca e reativação preservam versões e dados operacionais", () =>
    withImportDatabase(async (client) => {
      const snapshot = await readPlanDefinitionsFromGit(process.cwd());
      await run(client, snapshot);
      const fixture = await client.$transaction((tx) => createDatabaseFixture(tx));
      const execution = await client.trainingExecution.findUniqueOrThrow({
        where: { id: fixture.execution.id },
      });
      const version = snapshot.sources.find(
        (source) => source.kind === "training_plan" && source.path.endsWith("-v1.json"),
      )!;
      const changed = replace(snapshot, (source) =>
        source.kind === "training_pointer"
          ? {
              ...source,
              sha256: "e".repeat(64),
              document: {
                ...source.document,
                active_plan_path: version.path,
                active_plan_id: version.document.plan_id,
              },
            }
          : source,
      );
      const report = await run(client, changed);
      expect(report.activationsChanged).toBe(1);
      expect((await run(client, changed)).result).toBe("no-op");
      expect((await run(client, snapshot)).activationsChanged).toBe(1);
      expect(
        await client.planActivation.count({
          where: { logicalEnvironment: "local", domain: "training" },
        }),
      ).toBe(3);
      expect(
        await client.trainingExecution.findUniqueOrThrow({ where: { id: fixture.execution.id } }),
      ).toEqual(execution);
    }));
});
