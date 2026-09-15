import type { PrismaClient } from "@/generated/prisma/client";

export type ImportDatabaseFixtureContext = Readonly<{
  schema: string;
  createConnection: () => PrismaClient;
}>;
