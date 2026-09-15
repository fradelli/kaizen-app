import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Client } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import {
  assertDisposableTestSchema,
  getTestDatabaseConfiguration,
} from "@/lib/db/test-database-configuration.utils";
import type { ImportDatabaseFixtureContext } from "./import-database.fixture.types";

export async function withImportDatabase(
  run: (client: PrismaClient, context: ImportDatabaseFixtureContext) => Promise<void>,
): Promise<void> {
  const { directUrl: connectionString } = getTestDatabaseConfiguration(process.env);
  const schema = `kaizen_import_test_${randomUUID().replaceAll("-", "")}`;
  assertDisposableTestSchema(schema);
  const admin = new Client({ connectionString });
  await admin.connect();
  let client: PrismaClient | undefined;
  const connections: PrismaClient[] = [];
  const createConnection = () => {
    const connection = new PrismaClient({
      adapter: new PrismaPg({ connectionString, options: `-c search_path=${schema}` }, { schema }),
      log: [],
    });
    connections.push(connection);
    return connection;
  };
  try {
    await admin.query(`CREATE SCHEMA "${schema}"`);
    await admin.query(`SET search_path TO "${schema}"`);
    await admin.query(
      readFileSync("prisma/migrations/20260913011504_initial_p0/migration.sql", "utf8"),
    );
    client = createConnection();
    await run(client, { schema, createConnection });
  } finally {
    try {
      await Promise.all(connections.map((connection) => connection.$disconnect()));
    } finally {
      try {
        await admin.query("ROLLBACK");
        await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      } finally {
        await admin.end();
      }
    }
  }
}
