import type { Prisma } from "@/generated/prisma/client";
export type ImportTransaction = Prisma.TransactionClient;
export type CreatedDefinitionCounts = Record<string, number>;
export type SourceImportResult = { path: string; sha256: string; result: "imported" | "reused" };
