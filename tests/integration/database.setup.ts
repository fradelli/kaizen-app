import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { getTestDatabaseConfiguration } from "../../src/lib/db/test-database-configuration.utils";

export default function setup(): void {
  if (existsSync(".env")) loadEnvFile(".env");

  getTestDatabaseConfiguration(process.env);

  process.env.APP_ENV = "local";
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  process.env.DIRECT_URL = process.env.TEST_DIRECT_URL;

  const result = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    {
      env: process.env,
      encoding: "utf8",
      timeout: 60_000,
    },
  );
  if (result.status !== 0)
    throw new Error(
      "Falha ao aplicar migrations no PostgreSQL de teste. Verifique se database-test está saudável.",
    );
}
