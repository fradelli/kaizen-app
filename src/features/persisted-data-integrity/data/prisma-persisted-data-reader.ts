import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { PersistedDefinitionSnapshot } from "../domain/persisted-data-integrity.types";
import type { SnapshotTransactionSettings } from "./prisma-persisted-data-reader.types";
import {
  mapPersistedExerciseDefinition,
  mapPersistedImportBatch,
  mapPersistedMealDefinition,
  mapPersistedMealOption,
  mapPersistedNutritionDayType,
  mapPersistedNutritionDayTypeMeal,
  mapPersistedNutritionPlan,
  mapPersistedPlanActivation,
  mapPersistedTrainingPlan,
  mapPersistedTrainingPrescription,
  mapPersistedTrainingSession,
} from "./prisma-persisted-data.mapper";

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
      return {
        batches: (await tx.importBatch.findMany()).map(mapPersistedImportBatch),
        exercises: (await tx.exerciseDefinition.findMany()).map(mapPersistedExerciseDefinition),
        trainingPlans: (await tx.trainingPlanVersion.findMany()).map(mapPersistedTrainingPlan),
        sessions: (await tx.trainingSessionDefinition.findMany()).map(mapPersistedTrainingSession),
        prescriptions: (await tx.trainingExerciseDefinition.findMany()).map(
          mapPersistedTrainingPrescription,
        ),
        nutritionPlans: (await tx.nutritionPlanVersion.findMany()).map(mapPersistedNutritionPlan),
        meals: (await tx.mealDefinition.findMany()).map(mapPersistedMealDefinition),
        options: (await tx.mealOptionDefinition.findMany()).map(mapPersistedMealOption),
        dayTypes: (await tx.nutritionDayTypeDefinition.findMany()).map(
          mapPersistedNutritionDayType,
        ),
        dayTypeMeals: (await tx.nutritionDayTypeMeal.findMany()).map(
          mapPersistedNutritionDayTypeMeal,
        ),
        activations: (await tx.planActivation.findMany()).map(mapPersistedPlanActivation),
      };
    },
    { isolationLevel: "RepeatableRead", timeout: 30_000 },
  );
}
