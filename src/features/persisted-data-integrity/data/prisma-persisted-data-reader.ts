import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { PersistedDefinitionSnapshot } from "../domain/persisted-data-integrity.types";
import type { SnapshotTransactionSettings } from "./prisma-persisted-data-reader.types";

export async function readPersistedDefinitionSnapshot(
  client: PrismaClient,
): Promise<PersistedDefinitionSnapshot> {
  return client.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe("SET TRANSACTION READ ONLY");
      const [settings] = await tx.$queryRaw<
        SnapshotTransactionSettings[]
      >`SELECT current_setting('transaction_isolation') AS isolation, current_setting('transaction_read_only') AS "readOnly"`;
      if (settings?.isolation !== "repeatable read" || settings.readOnly !== "on")
        throw new Error("Snapshot de integridade exige transação consistente somente leitura.");
      const snapshot = {
        batches: await tx.importBatch.findMany(),
        exercises: await tx.exerciseDefinition.findMany(),
        trainingPlans: await tx.trainingPlanVersion.findMany(),
        sessions: await tx.trainingSessionDefinition.findMany(),
        prescriptions: await tx.trainingExerciseDefinition.findMany(),
        nutritionPlans: await tx.nutritionPlanVersion.findMany(),
        meals: await tx.mealDefinition.findMany(),
        options: await tx.mealOptionDefinition.findMany(),
        dayTypes: await tx.nutritionDayTypeDefinition.findMany(),
        dayTypeMeals: await tx.nutritionDayTypeMeal.findMany(),
        activations: await tx.planActivation.findMany(),
      };
      // Date -> ISO UTC; JSONB continua JSON, sem recalcular SHA a partir dele.
      return JSON.parse(JSON.stringify(snapshot)) as PersistedDefinitionSnapshot;
    },
    { isolationLevel: "RepeatableRead", timeout: 30_000 },
  );
}
