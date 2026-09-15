import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type {
  JsonValue,
  PlanDefinitionSourceKind,
} from "../../plan-definition-import/domain/plan-definition-import.types";
import type {
  PersistedExerciseDefinition,
  PersistedImportBatch,
  PersistedMealDefinition,
  PersistedMealOption,
  PersistedNutritionDayType,
  PersistedNutritionDayTypeMeal,
  PersistedNutritionPlan,
  PersistedPlanActivation,
  PersistedTrainingPlan,
  PersistedTrainingPrescription,
  PersistedTrainingSession,
} from "../domain/persisted-data-integrity.types";

const serializeDate = (value: Date | null): string | null => value?.toISOString() ?? null;
const serializeRequiredDate = (value: Date): string => value.toISOString();
const serializeJson = (value: Prisma.JsonValue | null): JsonValue => value as JsonValue;
const mapSourceKind = (value: string): PlanDefinitionSourceKind => {
  switch (value) {
    case "exercise_library":
    case "execution_metadata":
    case "training_plan":
    case "nutrition_plan":
    case "training_pointer":
    case "nutrition_pointer":
      return value;
    default:
      throw new Error("Tipo de fonte persistida inválido.");
  }
};

export const mapPersistedImportBatch = (
  row: Prisma.ImportBatchGetPayload<object>,
): PersistedImportBatch => ({
  id: row.id,
  sourceKind: mapSourceKind(row.sourceKind),
  sourcePath: row.sourcePath,
  sourceSha256: row.sourceSha256,
  sourceSchemaVersion: row.sourceSchemaVersion,
  applicationCommit: row.applicationCommit,
  sourceDocument: row.sourceDocument,
  finishedAt: serializeDate(row.finishedAt),
  result: row.result,
  errorCode: row.errorCode,
});
export const mapPersistedExerciseDefinition = (
  row: Prisma.ExerciseDefinitionGetPayload<object>,
): PersistedExerciseDefinition => ({
  id: row.id,
  exerciseId: row.exerciseId,
  libraryImportBatchId: row.libraryImportBatchId,
  metadataImportBatchId: row.metadataImportBatchId,
  namePt: row.namePt,
  definition: serializeJson(row.definition),
  measurementType: row.measurementType,
  loadApplicable: row.loadApplicable,
  loadUnit: row.loadUnit,
  normalizationRule: serializeJson(row.normalizationRule),
});
export const mapPersistedTrainingPlan = (
  row: Prisma.TrainingPlanVersionGetPayload<object>,
): PersistedTrainingPlan => ({
  id: row.id,
  planId: row.planId,
  version: row.version,
  sourceStatus: row.sourceStatus,
  sourceCreatedOn: serializeRequiredDate(row.sourceCreatedOn),
  sourceUpdatedOn: serializeRequiredDate(row.sourceUpdatedOn),
  importBatchId: row.importBatchId,
});
export const mapPersistedTrainingSession = (
  row: Prisma.TrainingSessionDefinitionGetPayload<object>,
): PersistedTrainingSession => ({
  id: row.id,
  trainingPlanVersionId: row.trainingPlanVersionId,
  sessionId: row.sessionId,
  name: row.name,
  targetDurationMinutes: row.targetDurationMinutes,
  shortDurationMinutes: row.shortDurationMinutes,
  intensity: row.intensity,
  notes: row.notes,
});
export const mapPersistedTrainingPrescription = (
  row: Prisma.TrainingExerciseDefinitionGetPayload<object>,
): PersistedTrainingPrescription => ({
  id: row.id,
  trainingPlanVersionId: row.trainingPlanVersionId,
  sessionDefinitionId: row.sessionDefinitionId,
  exerciseDefinitionId: row.exerciseDefinitionId,
  ordinal: row.ordinal,
  sets: row.sets,
  prescribedText: row.prescribedText,
  restSeconds: row.restSeconds,
  priority: row.priority,
  notes: row.notes,
  normalizedDose: serializeJson(row.normalizedDose),
});
export const mapPersistedNutritionPlan = (
  row: Prisma.NutritionPlanVersionGetPayload<object>,
): PersistedNutritionPlan => ({
  id: row.id,
  planId: row.planId,
  version: row.version,
  lifecycleStatus: row.lifecycleStatus,
  professionalStatus: row.professionalStatus,
  sourceCreatedOn: serializeRequiredDate(row.sourceCreatedOn),
  sourceUpdatedOn: serializeRequiredDate(row.sourceUpdatedOn),
  effectiveFrom: serializeRequiredDate(row.effectiveFrom),
  effectiveUntil: serializeDate(row.effectiveUntil),
  timezone: row.timezone,
  importBatchId: row.importBatchId,
});
export const mapPersistedMealDefinition = (
  row: Prisma.MealDefinitionGetPayload<object>,
): PersistedMealDefinition => ({
  id: row.id,
  nutritionPlanVersionId: row.nutritionPlanVersionId,
  mealId: row.mealId,
  ordinal: row.ordinal,
  label: row.label,
  defaultTime: serializeDate(row.defaultTime),
  required: row.required,
  useWhen: row.useWhen,
  timingRules: serializeJson(row.timingRules),
});
export const mapPersistedMealOption = (
  row: Prisma.MealOptionDefinitionGetPayload<object>,
): PersistedMealOption => ({
  id: row.id,
  nutritionPlanVersionId: row.nutritionPlanVersionId,
  mealDefinitionId: row.mealDefinitionId,
  optionId: row.optionId,
  ordinal: row.ordinal,
  label: row.label,
  useWhen: row.useWhen,
  followUpRule: row.followUpRule,
  items: serializeJson(row.items),
  unknowns: serializeJson(row.unknowns),
  referenceOptionId: row.referenceOptionId,
});
export const mapPersistedNutritionDayType = (
  row: Prisma.NutritionDayTypeDefinitionGetPayload<object>,
): PersistedNutritionDayType => ({
  id: row.id,
  nutritionPlanVersionId: row.nutritionPlanVersionId,
  dayTypeId: row.dayTypeId,
  ordinal: row.ordinal,
  label: row.label,
  energyBandId: row.energyBandId,
  minimumKcal: row.minimumKcal,
  maximumKcal: row.maximumKcal,
  energyBandStatus: row.energyBandStatus,
  minimumModules: row.minimumModules,
  maximumModules: row.maximumModules,
  mealRule: row.mealRule,
});
export const mapPersistedNutritionDayTypeMeal = (
  row: Prisma.NutritionDayTypeMealGetPayload<object>,
): PersistedNutritionDayTypeMeal => ({
  nutritionPlanVersionId: row.nutritionPlanVersionId,
  dayTypeId: row.dayTypeId,
  mealId: row.mealId,
  ordinal: row.ordinal,
});
export const mapPersistedPlanActivation = (
  row: Prisma.PlanActivationGetPayload<object>,
): PersistedPlanActivation => ({
  id: row.id,
  domain: row.domain,
  logicalEnvironment: row.logicalEnvironment,
  trainingPlanVersionId: row.trainingPlanVersionId,
  nutritionPlanVersionId: row.nutritionPlanVersionId,
  pointerImportBatchId: row.pointerImportBatchId,
  supersededAt: serializeDate(row.supersededAt),
});
