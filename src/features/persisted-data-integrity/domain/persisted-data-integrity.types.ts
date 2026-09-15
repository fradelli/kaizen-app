import type { JsonValue } from "../../plan-definition-import/domain/plan-definition-import.types";

// DTO de leitura: nomes de colunas explícitos, datas UTC serializadas e nenhum tipo Prisma.
export type DefinitionRecord = Readonly<{ id: string } & Record<string, JsonValue>>;
export type PersistedDefinitionSnapshot = Readonly<{
  batches: readonly DefinitionRecord[];
  exercises: readonly DefinitionRecord[];
  trainingPlans: readonly DefinitionRecord[];
  sessions: readonly DefinitionRecord[];
  prescriptions: readonly DefinitionRecord[];
  nutritionPlans: readonly DefinitionRecord[];
  meals: readonly DefinitionRecord[];
  options: readonly DefinitionRecord[];
  dayTypes: readonly DefinitionRecord[];
  dayTypeMeals: readonly Readonly<Record<string, JsonValue>>[];
  activations: readonly DefinitionRecord[];
}>;
export type IntegrityIssue = Readonly<{
  code: "MISSING_DEFINITION" | "FIELD_MISMATCH" | "COUNT_MISMATCH" | "ACTIVE_PLAN_MISMATCH";
  sourcePath: string;
  entity: string;
  field: string;
}>;
export type PersistedDataIntegrityReport = Readonly<{
  result: "valid" | "invalid" | "not-imported";
  commit: string;
  scope: "canonical-plan-definitions";
  counts: Readonly<Record<string, number>>;
  issues: readonly IntegrityIssue[];
}>;
