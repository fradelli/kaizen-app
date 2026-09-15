import type {
  ActivePlanPointer,
  ExecutionMetadata,
  ExerciseLibrary,
  NutritionPlan,
  TrainingPlan,
} from "./plan-definition-source.types";
export type { JsonObject, JsonValue } from "./json-value.types";
export type PlanDefinitionImportEnvironment = "local" | "preview" | "staging" | "production";
export type PlanDefinitionSourceKind =
  | "exercise_library"
  | "execution_metadata"
  | "training_plan"
  | "nutrition_plan"
  | "training_pointer"
  | "nutrition_pointer";
export type PlanDefinitionDocumentByKind = Readonly<{
  exercise_library: ExerciseLibrary;
  execution_metadata: ExecutionMetadata;
  training_plan: TrainingPlan;
  nutrition_plan: NutritionPlan;
  training_pointer: ActivePlanPointer;
  nutrition_pointer: ActivePlanPointer;
}>;
type PlanDefinitionSourceForKind<Kind extends PlanDefinitionSourceKind> = Readonly<{
  path: string;
  sha256: string;
  schemaVersion: string;
  kind: Kind;
  document: PlanDefinitionDocumentByKind[Kind];
}>;
export type PlanDefinitionSource<Kind extends PlanDefinitionSourceKind = PlanDefinitionSourceKind> =
  {
    [CurrentKind in Kind]: PlanDefinitionSourceForKind<CurrentKind>;
  }[Kind];

export type CreatedDefinitionName =
  | "batches"
  | "exercises"
  | "trainingPlans"
  | "trainingSessions"
  | "trainingPrescriptions"
  | "nutritionPlans"
  | "meals"
  | "mealOptions"
  | "nutritionDayTypes"
  | "dayTypeMeals";
export type CreatedDefinitionCounts = Partial<Record<CreatedDefinitionName, number>>;
export type PlanDefinitionSnapshot = Readonly<{
  commit: string;
  sources: readonly PlanDefinitionSource[];
  documents: ReadonlyMap<string, unknown>;
  availablePaths: ReadonlySet<string>;
}>;
export type PlanDefinitionImportReport = Readonly<{
  commit: string;
  environment: PlanDefinitionImportEnvironment;
  result: "imported" | "no-op";
  sources: readonly { path: string; sha256: string; result: "imported" | "reused" }[];
  activationsChanged: number;
  created: Readonly<CreatedDefinitionCounts>;
}>;
export type PlanDefinitionImportErrorCode =
  "SOURCE_INVALID" | "SOURCE_CONFLICT" | "IMPORT_UNAVAILABLE" | "CLI_INVALID";
