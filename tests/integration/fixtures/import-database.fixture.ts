import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Client } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

export async function withImportDatabase(
  run: (client: PrismaClient) => Promise<void>,
): Promise<void> {
  const connectionString = process.env.TEST_DIRECT_URL!;
  const target = new URL(connectionString);
  if (
    target.pathname !== "/kaizen_test" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname)
  )
    throw new Error("Banco de teste inválido.");
  const schema = `kaizen_import_test_${randomUUID().replaceAll("-", "")}`;
  if (!/^kaizen_import_test_[0-9a-f]{32}$/.test(schema))
    throw new Error("Schema de teste inválido.");
  const admin = new Client({ connectionString });
  await admin.connect();
  let client: PrismaClient | undefined;
  try {
    await admin.query(`CREATE SCHEMA "${schema}"`);
    await admin.query(`SET search_path TO "${schema}"`);
    await admin.query(
      readFileSync("prisma/migrations/20260913011504_initial_p0/migration.sql", "utf8"),
    );
    client = new PrismaClient({
      adapter: new PrismaPg({ connectionString, options: `-c search_path=${schema}` }, { schema }),
      log: [],
    });
    await run(client);
  } finally {
    await client?.$disconnect();
    await admin.query("ROLLBACK");
    await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await admin.end();
  }
}
