import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import type { PrismaClient } from "../src/generated/prisma/client";
import { PlanDefinitionImportError } from "../src/features/plan-definition-import/domain/plan-definition-import.error";

let client: PrismaClient | undefined;
try {
  if (existsSync(".env")) loadEnvFile(".env");
  const { getServerEnvironment } = await import("../src/lib/env/server");
  const { parseImportArguments } =
    await import("../src/features/plan-definition-import/data/plan-definition-import-cli.utils");
  const args = parseImportArguments(process.argv.slice(2), getServerEnvironment().APP_ENV);
  const { getDatabaseClient } = await import("../src/lib/db/client");
  const { importVersionedPlanDefinitions } =
    await import("../src/features/plan-definition-import/application/import-versioned-plan-definitions");
  const { readPlanDefinitionsFromGit } =
    await import("../src/features/plan-definition-import/data/read-plan-definitions-from-git");
  const { validatePlanDefinitionSnapshot } =
    await import("../src/features/plan-definition-import/data/validate-plan-definition-snapshot");
  const { PrismaPlanDefinitionImportRepository } =
    await import("../src/features/plan-definition-import/data/prisma-plan-definition-import-repository");
  const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
  const report = await importVersionedPlanDefinitions(
    {
      readSnapshot: () => readPlanDefinitionsFromGit(repositoryRoot, args.commit),
      validateSnapshot: validatePlanDefinitionSnapshot,
      repository: {
        persistSnapshot: (snapshot, environment) => {
          client = getDatabaseClient();
          return new PrismaPlanDefinitionImportRepository(client).persistSnapshot(
            snapshot,
            environment,
          );
        },
      },
    },
    args.environment,
  );
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(
    JSON.stringify({
      result: "failed",
      code: error instanceof PlanDefinitionImportError ? error.code : "IMPORT_UNAVAILABLE",
    }),
  );
  process.exitCode = 1;
} finally {
  if (client) {
    try {
      await client.$disconnect();
    } catch {
      console.error(JSON.stringify({ result: "failed", code: "IMPORT_UNAVAILABLE" }));
      process.exitCode = 1;
    }
  }
}
