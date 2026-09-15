import type { Prisma } from "@/generated/prisma/client";
import type { CreatedDefinitionCounts } from "../domain/plan-definition-import.types";
export type ImportTransaction = Prisma.TransactionClient;
export type { CreatedDefinitionCounts };
export type SourceImportResult = { path: string; sha256: string; result: "imported" | "reused" };
