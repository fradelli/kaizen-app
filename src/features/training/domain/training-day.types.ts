export type CivilDate = string & { readonly __civilDate: unique symbol };

export type TrainingEnvironment = "local" | "preview" | "staging" | "production";
export type TrainingAssignmentKind = "training" | "mobility" | "rest" | "unassigned";
export type TrainingExecutionStatus =
  "not_started" | "in_progress" | "completed" | "followed_different" | "skipped";
export type TrainingItemStatus = "pending" | "completed" | "skipped";
export type TrainingExerciseRole = "main" | "preparation" | "mobility";
export type TrainingMeasurementType = "repetitions" | "seconds" | "contacts" | "per_side";

export type NormalizedTrainingDose = Readonly<{
  sourceText: string;
  minimum: number;
  maximum: number;
  unit: string;
  scope: string;
  qualifier: string | null;
}>;

export type TrainingExerciseDefinitionSnapshot = Readonly<{
  exerciseId: string;
  name: string;
  measurementType: TrainingMeasurementType;
  loadApplicable: boolean;
  loadUnit: string | null;
  instructions: readonly string[];
  cues: readonly string[];
  risks: string | null;
}>;

export type TrainingExercisePrescriptionSnapshot = Readonly<{
  prescriptionId: string;
  ordinal: number;
  sets: number;
  prescribedText: string;
  restSeconds: number | null;
  priority: string | null;
  notes: string | null;
  dose: NormalizedTrainingDose;
  exercise: TrainingExerciseDefinitionSnapshot;
}>;

export type TrainingSessionSnapshot = Readonly<{
  databaseId: string;
  sessionId: string;
  name: string;
  targetDurationMinutes: number;
  shortDurationMinutes: number | null;
  intensity: string | null;
  notes: string | null;
  exercises: readonly TrainingExercisePrescriptionSnapshot[];
}>;

export type TrainingPlanSnapshot = Readonly<{
  databaseId: string;
  planId: string;
  version: string;
  sourceStatus: string;
  sessions: readonly TrainingSessionSnapshot[];
}>;

export type TrainingSetExecutionSnapshot = Readonly<{
  setNumber: number;
  status: TrainingItemStatus;
  value: number | null;
  leftValue: number | null;
  rightValue: number | null;
  directionValues: Readonly<Record<string, number>> | null;
  loadKg: string | null;
  revision: number;
}>;

export type TrainingExerciseExecutionSnapshot = Readonly<{
  id: string;
  prescriptionId: string;
  sessionDatabaseId: string;
  role: TrainingExerciseRole;
  itemStatus: TrainingItemStatus;
  comment: string | null;
  revision: number;
  sets: readonly TrainingSetExecutionSnapshot[];
}>;

export type TrainingExecutionSnapshot = Readonly<{
  id: string;
  status: TrainingExecutionStatus;
  comment: string | null;
  startedAt: string | null;
  completedAt: string | null;
  revision: number;
  exercises: readonly TrainingExerciseExecutionSnapshot[];
}>;

export type TrainingAssignmentSnapshot = Readonly<{
  id: string;
  civilDate: CivilDate;
  kind: TrainingAssignmentKind;
  mainSessionDatabaseId: string | null;
  preparationSessionDatabaseId: string | null;
  reason: string | null;
  revision: number;
  plan: TrainingPlanSnapshot | null;
  execution: TrainingExecutionSnapshot | null;
}>;

export type TrainingDaySnapshot = Readonly<{
  activePlan: TrainingPlanSnapshot | null;
  assignment: TrainingAssignmentSnapshot | null;
}>;
