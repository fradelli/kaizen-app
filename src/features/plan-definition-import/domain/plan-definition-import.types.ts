export type JsonValue =
  null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };
export type PlanDefinitionImportEnvironment = "local" | "preview" | "staging" | "production";
export type PlanDefinitionSourceKind =
  | "exercise_library"
  | "execution_metadata"
  | "training_plan"
  | "nutrition_plan"
  | "training_pointer"
  | "nutrition_pointer";
export type PlanDefinitionSource = Readonly<{
  path: string;
  sha256: string;
  schemaVersion: string;
  kind: PlanDefinitionSourceKind;
  document: JsonObject;
}>;
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
  created: Readonly<Record<string, number>>;
}>;
export type PlanDefinitionImportErrorCode =
  "SOURCE_INVALID" | "SOURCE_CONFLICT" | "IMPORT_UNAVAILABLE" | "CLI_INVALID";
