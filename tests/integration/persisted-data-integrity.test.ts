import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getTestDatabaseConfiguration } from "@/lib/db/test-database-configuration.utils";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { validatePersistedData } from "@/features/persisted-data-integrity/application/validate-persisted-data";
import { readPersistedDefinitionSnapshot } from "@/features/persisted-data-integrity/data/prisma-persisted-data-reader";
import { readPlanDefinitionsFromGit } from "@/features/plan-definition-import/data/read-plan-definitions-from-git";
import { validatePlanDefinitionSnapshot } from "@/features/plan-definition-import/data/validate-plan-definition-snapshot";
import { PrismaPlanDefinitionImportRepository } from "@/features/plan-definition-import/data/prisma-plan-definition-import-repository";
import { withImportDatabase } from "./fixtures/import-database.fixture";

describe("integridade persistida em PostgreSQL real", () => {
  it(
    "detecta projeção adicional válida para SQL, sem reparar ou apagar dados",
    () =>
      withImportDatabase(async (client, { schema }) => {
        const canonical = await readPlanDefinitionsFromGit(process.cwd());
        validatePlanDefinitionSnapshot(canonical);
        await new PrismaPlanDefinitionImportRepository(client).persistSnapshot(canonical, "local");
        const version = await client.trainingPlanVersion.findFirstOrThrow();
        const extra = await client.trainingSessionDefinition.create({
          data: {
            trainingPlanVersionId: version.id,
            sessionId: "unexpected",
            name: "Valor sintético não publicado",
            targetDurationMinutes: 30,
          },
        });
        const before = await readPersistedDefinitionSnapshot(client);
        const report = await validatePersistedData({
          readCanonicalSnapshot: async () => canonical,
          readSnapshotAtCommit: (commit) => readPlanDefinitionsFromGit(process.cwd(), commit),
          validateCanonicalSnapshot: validatePlanDefinitionSnapshot,
          readPersistedSnapshot: () => readPersistedDefinitionSnapshot(client),
        });
        expect(report.result).toBe("invalid");
        expect(report.issues).toContainEqual(
          expect.objectContaining({ code: "COUNT_MISMATCH", entity: "sessions" }),
        );
        expect(JSON.stringify(report)).not.toContain(extra.id);
        expect(JSON.stringify(report)).not.toContain(extra.name);
        try {
          await promisify(execFile)(
            process.execPath,
            [
              "--conditions=react-server",
              "--import",
              "tsx",
              "scripts/validate-persisted-data.ts",
              "--schema",
              schema,
            ],
            { timeout: 30_000 },
          );
          throw new Error("CLI deveria rejeitar projeção divergente.");
        } catch (error) {
          expect(error).toMatchObject({ code: 1 });
          expect(JSON.parse((error as { stdout: string }).stdout).result).toBe("invalid");
        }
        expect(await readPersistedDefinitionSnapshot(client)).toEqual(before);
      }),
    45_000,
  );
  it("abre snapshot REPEATABLE READ e READ ONLY no PostgreSQL", () =>
    withImportDatabase(async (_, { schema }) => {
      const { runtimeUrl: connectionString } = getTestDatabaseConfiguration(process.env);
      const client = new PrismaClient({
        adapter: new PrismaPg(
          { connectionString, options: `-c search_path=${schema}` },
          { schema },
        ),
        log: [{ level: "query", emit: "event" }],
      });
      const queries: string[] = [];
      client.$on("query", (event) => queries.push(event.query));
      try {
        await readPersistedDefinitionSnapshot(client);
        // O adapter não emite BEGIN/isolation no evento de query. O leitor consulta
        // e exige os settings reais do servidor dentro da própria transação.
        expect(queries.some((query) => /transaction_isolation/i.test(query))).toBe(true);
        expect(queries.some((query) => /SET TRANSACTION READ ONLY/i.test(query))).toBe(true);
        expect(queries.some((query) => /\b(INSERT|UPDATE|DELETE|TRUNCATE)\b/i.test(query))).toBe(
          false,
        );
      } finally {
        await client.$disconnect();
      }
    }));

  it("CLI recusa banco operacional antes de conectar e sanitiza a falha", async () => {
    try {
      await promisify(execFile)(
        process.execPath,
        ["--conditions=react-server", "--import", "tsx", "scripts/validate-persisted-data.ts"],
        {
          timeout: 30_000,
          env: {
            ...process.env,
            TEST_DATABASE_URL: "postgres://synthetic:private-test@127.0.0.1:5432/kaizen_local",
            TEST_DIRECT_URL: "postgres://synthetic:private-test@127.0.0.1:5432/kaizen_local",
          },
        },
      );
      throw new Error("CLI deveria recusar banco operacional.");
    } catch (error) {
      expect(error).toMatchObject({ code: 1, stdout: "" });
      expect(JSON.parse((error as { stderr: string }).stderr)).toEqual({
        result: "failed",
        code: "INTEGRITY_UNAVAILABLE",
      });
    }
  }, 45_000);
  it("compara todos os campos e joins canônicos sem alterar o banco", () =>
    withImportDatabase(async (client) => {
      const canonical = await readPlanDefinitionsFromGit(process.cwd());
      validatePlanDefinitionSnapshot(canonical);
      await new PrismaPlanDefinitionImportRepository(client).persistSnapshot(canonical, "local");
      const before = await readPersistedDefinitionSnapshot(client);
      const audit = () =>
        validatePersistedData({
          readCanonicalSnapshot: async () => canonical,
          readSnapshotAtCommit: (commit) => readPlanDefinitionsFromGit(process.cwd(), commit),
          validateCanonicalSnapshot: validatePlanDefinitionSnapshot,
          readPersistedSnapshot: () => readPersistedDefinitionSnapshot(client),
        });
      const first = await audit();
      expect(first).toMatchObject({
        result: "valid",
        scope: "canonical-plan-definitions",
        issues: [],
        counts: {
          batches: 7,
          exercises: 38,
          trainingPlans: 2,
          sessions: 14,
          prescriptions: 87,
          nutritionPlans: 1,
          meals: 5,
          options: 20,
          dayTypes: 6,
          dayTypeMeals: 30,
          activations: 2,
        },
      });
      expect(await audit()).toEqual(first);
      expect(await readPersistedDefinitionSnapshot(client)).toEqual(before);
      const wire = JSON.stringify(first);
      expect(wire).not.toContain(before.batches[0].id);
      expect(wire).not.toContain("sourceDocument");
    }));

  it(
    "executa CLI de CI no schema preparado e encerra o client",
    () =>
      withImportDatabase(async (client, { schema }) => {
        const canonical = await readPlanDefinitionsFromGit(process.cwd());
        validatePlanDefinitionSnapshot(canonical);
        await new PrismaPlanDefinitionImportRepository(client).persistSnapshot(canonical, "local");
        const before = await readPersistedDefinitionSnapshot(client);
        const { stdout, stderr } = await promisify(execFile)(
          process.execPath,
          [
            "--conditions=react-server",
            "--import",
            "tsx",
            "scripts/validate-persisted-data.ts",
            "--schema",
            schema,
            "--commit",
            canonical.commit,
          ],
          { timeout: 30_000, env: process.env },
        );
        expect(stderr).toBe("");
        expect(JSON.parse(stdout)).toMatchObject({
          result: "valid",
          commit: canonical.commit,
          issues: [],
        });
        expect(await readPersistedDefinitionSnapshot(client)).toEqual(before);
      }),
    45_000,
  );

  it(
    "banco vazio não comprova paridade e CLI retorna saída não zero",
    () =>
      withImportDatabase(async (client, { schema }) => {
        const report = await validatePersistedData({
          readCanonicalSnapshot: () => readPlanDefinitionsFromGit(process.cwd()),
          readSnapshotAtCommit: (commit) => readPlanDefinitionsFromGit(process.cwd(), commit),
          validateCanonicalSnapshot: validatePlanDefinitionSnapshot,
          readPersistedSnapshot: () => readPersistedDefinitionSnapshot(client),
        });
        expect(report.result).toBe("not-imported");
        try {
          await promisify(execFile)(
            process.execPath,
            [
              "--conditions=react-server",
              "--import",
              "tsx",
              "scripts/validate-persisted-data.ts",
              "--schema",
              schema,
            ],
            { timeout: 30_000 },
          );
          throw new Error("CLI deveria rejeitar banco não importado.");
        } catch (error) {
          expect(error).toMatchObject({ code: 1 });
          expect(JSON.parse((error as { stdout: string }).stdout).result).toBe("not-imported");
        }
      }),
    45_000,
  );
});
