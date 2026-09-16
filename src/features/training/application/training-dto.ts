import type {
  CivilDate,
  NormalizedTrainingDose,
  TrainingExecutionStatus,
  TrainingItemStatus,
  TrainingMeasurementType,
} from "../domain/training-day.types";

export type PublicTrainingExerciseDto = Readonly<{
  prescriptionId: string;
  exerciseId: string;
  name: string;
  ordinal: number;
  prescribedSets: number;
  prescribedText: string;
  restSeconds: number | null;
  priority: string | null;
  notes: string | null;
  dose: NormalizedTrainingDose;
  measurementType: TrainingMeasurementType;
  loadApplicable: boolean;
  loadUnit: string | null;
  instructions: readonly string[];
  cues: readonly string[];
  risks: string | null;
}>;

export type PublicTrainingSessionDto = Readonly<{
  sessionId: string;
  name: string;
  targetDurationMinutes: number;
  shortDurationMinutes: number | null;
  intensity: string | null;
  notes: string | null;
  exercises: readonly PublicTrainingExerciseDto[];
}>;

export type AvailablePublicTrainingPlanDto = Readonly<{
  status: "available";
  planId: string;
  version: string;
  sourceStatus: string;
  sessions: readonly PublicTrainingSessionDto[];
}>;

export type PublicTrainingPlanDto =
  | AvailablePublicTrainingPlanDto
  | Readonly<{ status: "unavailable"; reason: "active_plan_not_found" }>;

export type TrainingSetDto = Readonly<{
  setNumber: number;
  status: TrainingItemStatus;
  value: number | null;
  leftValue: number | null;
  rightValue: number | null;
  directionValues: Readonly<Record<string, number>> | null;
  loadKg: string | null;
  revision: number | null;
}>;

export type TrainingDayExerciseDto = PublicTrainingExerciseDto &
  Readonly<{
    executionId: string | null;
    status: TrainingItemStatus;
    comment: string | null;
    revision: number | null;
    sets: readonly TrainingSetDto[];
  }>;

export type TrainingDaySessionDto = Readonly<{
  role: "main" | "preparation" | "mobility";
  sessionId: string;
  name: string;
  targetDurationMinutes: number;
  shortDurationMinutes: number | null;
  intensity: string | null;
  notes: string | null;
  exercises: readonly TrainingDayExerciseDto[];
}>;

export type TrainingExecutionDto = Readonly<{
  id: string;
  status: TrainingExecutionStatus;
  comment: string | null;
  startedAt: string | null;
  completedAt: string | null;
  revision: number;
}>;

type AssignedTrainingDayBaseDto = Readonly<{
  civilDate: CivilDate;
  assignmentId: string;
  assignmentRevision: number;
  planId: string;
  planVersion: string;
  execution: TrainingExecutionDto | null;
}>;

export type TrainingDayDto =
  | Readonly<{
      state: "unavailable";
      civilDate: CivilDate;
      reason: "active_plan_not_found";
    }>
  | Readonly<{
      state: "unassigned";
      civilDate: CivilDate;
      assignmentId: string | null;
      assignmentRevision: number | null;
      availablePlan: AvailablePublicTrainingPlanDto;
    }>
  | (AssignedTrainingDayBaseDto &
      Readonly<{
        state: "training";
        preparation: TrainingDaySessionDto | null;
        main: TrainingDaySessionDto;
      }>)
  | (AssignedTrainingDayBaseDto &
      Readonly<{
        state: "mobility";
        mobility: TrainingDaySessionDto;
      }>)
  | Readonly<{
      state: "rest";
      civilDate: CivilDate;
      assignmentId: string;
      assignmentRevision: number;
      reason: string | null;
      execution: TrainingExecutionDto | null;
    }>;
