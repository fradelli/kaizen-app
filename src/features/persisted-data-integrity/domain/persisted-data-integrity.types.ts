import type {
  JsonValue,
  PlanDefinitionSourceKind,
} from "../../plan-definition-import/domain/plan-definition-import.types";

export type PersistedImportBatch = Readonly<{
  id: string;
  sourceKind: PlanDefinitionSourceKind;
  sourcePath: string;
  sourceSha256: string;
  sourceSchemaVersion: string;
  applicationCommit: string;
  sourceDocument: unknown;
  finishedAt: string | null;
  result: "in_progress" | "completed" | "failed";
  errorCode: string | null;
}>;
export type PersistedExerciseDefinition = Readonly<{
  id: string;
  exerciseId: string;
  libraryImportBatchId: string;
  metadataImportBatchId: string;
  namePt: string;
  definition: JsonValue;
  measurementType: "repetitions" | "seconds" | "contacts" | "per_side";
  loadApplicable: boolean;
  loadUnit: string | null;
  normalizationRule: JsonValue;
}>;
export type PersistedTrainingPlan = Readonly<{
  id: string;
  planId: string;
  version: string;
  sourceStatus: string;
  sourceCreatedOn: string;
  sourceUpdatedOn: string;
  importBatchId: string;
}>;
export type PersistedTrainingSession = Readonly<{
  id: string;
  trainingPlanVersionId: string;
  sessionId: string;
  name: string;
  targetDurationMinutes: number;
  shortDurationMinutes: number | null;
  intensity: string | null;
  notes: string | null;
  assignmentRole: "main" | "preparation" | "mobility";
  compatiblePreparationSessionIds: readonly string[];
}>;
export type PersistedTrainingPrescription = Readonly<{
  id: string;
  trainingPlanVersionId: string;
  sessionDefinitionId: string;
  exerciseDefinitionId: string;
  ordinal: number;
  sets: number;
  prescribedText: string;
  restSeconds: number | null;
  priority: string | null;
  notes: string | null;
  normalizedDose: JsonValue;
}>;
export type PersistedNutritionPlan = Readonly<{
  id: string;
  planId: string;
  version: string;
  lifecycleStatus: string;
  professionalStatus: string;
  sourceCreatedOn: string;
  sourceUpdatedOn: string;
  effectiveFrom: string;
  effectiveUntil: string | null;
  timezone: string;
  importBatchId: string;
}>;
export type PersistedMealDefinition = Readonly<{
  id: string;
  nutritionPlanVersionId: string;
  mealId: string;
  ordinal: number;
  label: string;
  defaultTime: string | null;
  required: boolean;
  useWhen: string | null;
  timingRules: JsonValue;
}>;
export type PersistedMealOption = Readonly<{
  id: string;
  nutritionPlanVersionId: string;
  mealDefinitionId: string;
  optionId: string;
  ordinal: number;
  label: string;
  useWhen: string | null;
  followUpRule: string | null;
  items: JsonValue;
  unknowns: JsonValue;
  referenceOptionId: string | null;
}>;
export type PersistedNutritionDayType = Readonly<{
  id: string;
  nutritionPlanVersionId: string;
  dayTypeId: string;
  ordinal: number;
  label: string;
  energyBandId: string;
  minimumKcal: number;
  maximumKcal: number;
  energyBandStatus: string;
  minimumModules: number;
  maximumModules: number;
  mealRule: string;
}>;
export type PersistedNutritionDayTypeMeal = Readonly<{
  nutritionPlanVersionId: string;
  dayTypeId: string;
  mealId: string;
  ordinal: number;
}>;
export type PersistedPlanActivation = Readonly<{
  id: string;
  domain: "training" | "nutrition";
  logicalEnvironment: "local" | "preview" | "staging" | "production";
  trainingPlanVersionId: string | null;
  nutritionPlanVersionId: string | null;
  pointerImportBatchId: string;
  supersededAt: string | null;
}>;

export type PersistedDefinitionSnapshot = Readonly<{
  batches: readonly PersistedImportBatch[];
  exercises: readonly PersistedExerciseDefinition[];
  trainingPlans: readonly PersistedTrainingPlan[];
  sessions: readonly PersistedTrainingSession[];
  prescriptions: readonly PersistedTrainingPrescription[];
  nutritionPlans: readonly PersistedNutritionPlan[];
  meals: readonly PersistedMealDefinition[];
  options: readonly PersistedMealOption[];
  dayTypes: readonly PersistedNutritionDayType[];
  dayTypeMeals: readonly PersistedNutritionDayTypeMeal[];
  activations: readonly PersistedPlanActivation[];
}>;
export type PersistedDefinitionCountName = keyof PersistedDefinitionSnapshot;
export type IntegrityIssue = Readonly<{
  code: "MISSING_DEFINITION" | "FIELD_MISMATCH" | "COUNT_MISMATCH" | "ACTIVE_PLAN_MISMATCH";
  sourcePath: string;
  entity: PersistedDefinitionCountName | "mealOptions" | "prescriptionExercise";
  field: string;
}>;
export type PersistedDataIntegrityReport = Readonly<{
  result: "valid" | "invalid" | "not-imported";
  commit: string;
  scope: "canonical-plan-definitions";
  counts: Readonly<Record<PersistedDefinitionCountName, number>>;
  issues: readonly IntegrityIssue[];
}>;
export type PersistedDataIntegrityErrorCode =
  | "CLI_INVALID"
  | "TEST_DATABASE_INVALID"
  | "SOURCE_INVALID"
  | "SOURCE_UNAVAILABLE"
  | "INTEGRITY_UNAVAILABLE";
