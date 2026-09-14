import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

import { getDatabaseConfiguration } from "./environment";

const databaseGlobal = globalThis as typeof globalThis & { kaizenPrisma?: PrismaClient };
let processClient: PrismaClient | undefined;

export function getDatabaseClient(): PrismaClient {
  if (processClient) return processClient;
  if (process.env.NODE_ENV !== "production" && databaseGlobal.kaizenPrisma) {
    processClient = databaseGlobal.kaizenPrisma;
    return processClient;
  }

  const adapter = new PrismaPg(getDatabaseConfiguration());
  processClient = new PrismaClient({ adapter, log: [] });
  if (process.env.NODE_ENV !== "production") databaseGlobal.kaizenPrisma = processClient;
  return processClient;
}
