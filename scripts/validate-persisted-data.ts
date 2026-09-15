import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { getTestDatabaseConfiguration } from "../src/lib/db/test-database-configuration.utils";
import { parseIntegrityArguments } from "../src/features/persisted-data-integrity/data/persisted-data-integrity-cli.utils";
import { validatePersistedData } from "../src/features/persisted-data-integrity/application/validate-persisted-data";
import { readPersistedDefinitionSnapshot } from "../src/features/persisted-data-integrity/data/prisma-persisted-data-reader";
import { readPlanDefinitionsFromGit } from "../src/features/plan-definition-import/data/read-plan-definitions-from-git";
import { validatePlanDefinitionSnapshot } from "../src/features/plan-definition-import/data/validate-plan-definition-snapshot";
import { PersistedDataIntegrityError } from "../src/features/persisted-data-integrity/domain/persisted-data-integrity.error";
import { mapPersistedDataIntegrityError } from "../src/features/persisted-data-integrity/data/persisted-data-integrity-error.mapper";

let client: PrismaClient | undefined;
try {
  if (existsSync(".env")) loadEnvFile(".env");
  const args = parseIntegrityArguments(process.argv.slice(2));
  let configuration;
  try {
    configuration = getTestDatabaseConfiguration(process.env);
  } catch {
    throw new PersistedDataIntegrityError("TEST_DATABASE_INVALID");
  }
  client = new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: configuration.runtimeUrl, options: `-c search_path=${args.schema}` },
      { schema: args.schema },
    ),
    log: [],
  });
  const report = await validatePersistedData({
    readSnapshotAtCommit: (commit) =>
      readPlanDefinitionsFromGit(fileURLToPath(new URL("../", import.meta.url)), commit),
    readCanonicalSnapshot: () =>
      readPlanDefinitionsFromGit(fileURLToPath(new URL("../", import.meta.url)), args.commit),
    validateCanonicalSnapshot: validatePlanDefinitionSnapshot,
    readPersistedSnapshot: () => readPersistedDefinitionSnapshot(client!),
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.result !== "valid") process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ result: "failed", code: mapPersistedDataIntegrityError(error) }));
  process.exitCode = 1;
} finally {
  try {
    await client?.$disconnect();
  } catch {
    console.error(JSON.stringify({ result: "failed", code: "INTEGRITY_UNAVAILABLE" }));
    process.exitCode = 1;
  }
}
