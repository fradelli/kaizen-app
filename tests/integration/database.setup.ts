import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

export default function setup(): void {
  if (existsSync(".env")) loadEnvFile(".env");

  for (const key of ["TEST_DATABASE_URL", "TEST_DIRECT_URL"] as const) {
    let valid = false;
    try {
      const url = new URL(process.env[key] ?? "");
      valid =
        ["postgres:", "postgresql:"].includes(url.protocol) &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
        url.pathname === "/kaizen_test";
    } catch {
      valid = false;
    }
    if (!valid) throw new Error(`${key} deve apontar ao PostgreSQL local descartável kaizen_test.`);
  }

  const runtimeTarget = new URL(process.env.TEST_DATABASE_URL!);
  const migrationTarget = new URL(process.env.TEST_DIRECT_URL!);
  if (
    runtimeTarget.host !== migrationTarget.host ||
    runtimeTarget.pathname !== migrationTarget.pathname
  ) {
    throw new Error(
      "TEST_DATABASE_URL e TEST_DIRECT_URL devem apontar ao mesmo banco descartável.",
    );
  }

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
