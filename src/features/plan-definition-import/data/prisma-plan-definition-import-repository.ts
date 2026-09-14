import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { PlanDefinitionImportRepository } from "../application/import-versioned-plan-definitions.types";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionImportEnvironment,
  PlanDefinitionImportReport,
} from "../domain/plan-definition-import.types";
import { persistPlanDefinitionSnapshot } from "./persist-plan-definition-snapshot";
export class PrismaPlanDefinitionImportRepository implements PlanDefinitionImportRepository {
  constructor(
    private readonly client: PrismaClient,
    private readonly now: () => Date = () => new Date(),
  ) {}
  async persistSnapshot(
    snapshot: PlanDefinitionSnapshot,
    environment: PlanDefinitionImportEnvironment,
  ): Promise<PlanDefinitionImportReport> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.client.$transaction(
          (tx) => persistPlanDefinitionSnapshot(tx, snapshot, environment, this.now),
          { isolationLevel: "Serializable", timeout: 60_000, maxWait: 10_000 },
        );
      } catch (error) {
        if (error instanceof PlanDefinitionImportError) throw error;
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2034" &&
          attempt < 2
        )
          continue;
        throw new PlanDefinitionImportError("IMPORT_UNAVAILABLE");
      }
    }
    throw new PlanDefinitionImportError("IMPORT_UNAVAILABLE");
  }
}
