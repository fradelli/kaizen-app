import type {
  TrainingAssignmentSnapshot,
  TrainingExerciseExecutionSnapshot,
  TrainingExerciseRole,
  TrainingPlanSnapshot,
  TrainingSessionSnapshot,
} from "../domain/training-day.types";
import { parseCivilDate } from "../domain/training-day.rules";
import { TrainingProjectionError } from "../domain/training-projection.error";
import type {
  TrainingDayDto,
  TrainingDayExerciseDto,
  TrainingDaySessionDto,
  TrainingExecutionDto,
  TrainingSetDto,
} from "./training-dto";
import type { GetTrainingDayDependencies, GetTrainingDayInput } from "./get-training-day.types";
import { projectAvailablePublicTrainingPlan } from "./get-public-training-plan";

export async function getTrainingDay(
  dependencies: GetTrainingDayDependencies,
  input: GetTrainingDayInput,
): Promise<TrainingDayDto> {
  const civilDate = parseCivilDate(input.civilDate);
  const { workspaceId } = await dependencies.resolveWorkspace();
  const snapshot = await dependencies.repository.findTrainingDay({
    workspaceId,
    civilDate,
    environment: dependencies.environment,
  });
  const assignment = snapshot.assignment;

  if (!assignment || assignment.kind === "unassigned") {
    if (assignment) {
      assertUnassignedAssignmentIsCoherent(assignment);
    }

    if (!snapshot.activePlan) {
      return Object.freeze({
        state: "unavailable",
        civilDate,
        reason: "active_plan_not_found",
      });
    }

    return Object.freeze({
      state: "unassigned",
      civilDate,
      assignmentId: assignment?.id ?? null,
      assignmentRevision: assignment?.revision ?? null,
      availablePlan: projectAvailablePublicTrainingPlan(snapshot.activePlan),
    });
  }

  if (assignment.kind === "rest") {
    assertRestAssignmentIsCoherent(assignment);

    return Object.freeze({
      state: "rest",
      civilDate,
      assignmentId: assignment.id,
      assignmentRevision: assignment.revision,
      reason: assignment.reason,
      execution: projectTrainingExecution(assignment),
    });
  }

  const plan = requireAssignedPlan(assignment);
  const mainSession = requireSession(plan, assignment.mainSessionDatabaseId, "principal");
  const execution = projectTrainingExecution(assignment);

  if (assignment.kind === "mobility") {
    assertNoPreparationSession(assignment);
    assertExecutionReferencesAssignedSessions(assignment, [mainSession.databaseId]);

    return Object.freeze({
      state: "mobility",
      civilDate,
      assignmentId: assignment.id,
      assignmentRevision: assignment.revision,
      planId: plan.planId,
      planVersion: plan.version,
      execution,
      mobility: projectTrainingDaySession(mainSession, "mobility", assignment),
    });
  }

  const preparation = assignment.preparationSessionDatabaseId
    ? projectTrainingDaySession(
        requireSession(plan, assignment.preparationSessionDatabaseId, "preparação"),
        "preparation",
        assignment,
      )
    : null;
  assertExecutionReferencesAssignedSessions(
    assignment,
    [mainSession.databaseId, assignment.preparationSessionDatabaseId].filter(
      (databaseId): databaseId is string => databaseId !== null,
    ),
  );

  return Object.freeze({
    state: "training",
    civilDate,
    assignmentId: assignment.id,
    assignmentRevision: assignment.revision,
    planId: plan.planId,
    planVersion: plan.version,
    execution,
    preparation,
    main: projectTrainingDaySession(mainSession, "main", assignment),
  });
}

function projectTrainingDaySession(
  session: TrainingSessionSnapshot,
  role: TrainingExerciseRole,
  assignment: TrainingAssignmentSnapshot,
): TrainingDaySessionDto {
  const persistedByPrescription = new Map(
    (assignment.execution?.exercises ?? [])
      .filter((item) => item.sessionDatabaseId === session.databaseId)
      .map((item) => [item.prescriptionId, item]),
  );

  for (const persisted of persistedByPrescription.values()) {
    if (persisted.role !== role) {
      invalidReference("A função da execução não corresponde à sessão atribuída.");
    }
  }

  const prescribedIds = new Set(session.exercises.map((item) => item.prescriptionId));

  if (
    [...persistedByPrescription.keys()].some((prescriptionId) => !prescribedIds.has(prescriptionId))
  ) {
    invalidReference("A execução referencia exercício ausente da sessão atribuída.");
  }

  return Object.freeze({
    role,
    sessionId: session.sessionId,
    name: session.name,
    targetDurationMinutes: session.targetDurationMinutes,
    shortDurationMinutes: session.shortDurationMinutes,
    intensity: session.intensity,
    notes: session.notes,
    exercises: Object.freeze(
      session.exercises.map((prescription) =>
        projectTrainingDayExercise(
          prescription,
          role,
          persistedByPrescription.get(prescription.prescriptionId),
        ),
      ),
    ),
  });
}

function projectTrainingDayExercise(
  prescription: TrainingSessionSnapshot["exercises"][number],
  role: TrainingExerciseRole,
  persisted: TrainingExerciseExecutionSnapshot | undefined,
): TrainingDayExerciseDto {
  if (persisted && persisted.sets.some((set) => set.setNumber > prescription.sets)) {
    invalidReference("A execução contém uma série fora da prescrição apresentada.");
  }

  if (role !== "main" && persisted?.sets.length) {
    invalidReference("Preparação ou mobilidade não pode conter séries persistidas.");
  }

  if (!prescription.exercise.loadApplicable && persisted?.sets.some((set) => set.loadKg !== null)) {
    invalidReference("A execução contém carga para um exercício sem carga aplicável.");
  }

  const persistedSets = new Map(persisted?.sets.map((set) => [set.setNumber, set]) ?? []);
  const sets =
    role === "main"
      ? Array.from({ length: prescription.sets }, (_, index) =>
          projectTrainingSet(index + 1, persistedSets.get(index + 1)),
        )
      : [];

  return Object.freeze({
    prescriptionId: prescription.prescriptionId,
    exerciseId: prescription.exercise.exerciseId,
    name: prescription.exercise.name,
    ordinal: prescription.ordinal,
    prescribedSets: prescription.sets,
    prescribedText: prescription.prescribedText,
    restSeconds: prescription.restSeconds,
    priority: prescription.priority,
    notes: prescription.notes,
    dose: prescription.dose,
    measurementType: prescription.exercise.measurementType,
    loadApplicable: prescription.exercise.loadApplicable,
    loadUnit: prescription.exercise.loadUnit,
    instructions: prescription.exercise.instructions,
    cues: prescription.exercise.cues,
    risks: prescription.exercise.risks,
    executionId: persisted?.id ?? null,
    status: persisted?.itemStatus ?? "pending",
    comment: persisted?.comment ?? null,
    revision: persisted?.revision ?? null,
    sets: Object.freeze(sets),
  });
}

function projectTrainingSet(
  setNumber: number,
  persisted: TrainingExerciseExecutionSnapshot["sets"][number] | undefined,
): TrainingSetDto {
  return Object.freeze({
    setNumber,
    status: persisted?.status ?? "pending",
    value: persisted?.value ?? null,
    leftValue: persisted?.leftValue ?? null,
    rightValue: persisted?.rightValue ?? null,
    directionValues: persisted?.directionValues ?? null,
    loadKg: persisted?.loadKg ?? null,
    revision: persisted?.revision ?? null,
  });
}

function projectTrainingExecution(
  assignment: TrainingAssignmentSnapshot,
): TrainingExecutionDto | null {
  const execution = assignment.execution;

  return execution
    ? Object.freeze({
        id: execution.id,
        status: execution.status,
        comment: execution.comment,
        startedAt: execution.startedAt,
        completedAt: execution.completedAt,
        revision: execution.revision,
      })
    : null;
}

function requireAssignedPlan(assignment: TrainingAssignmentSnapshot): TrainingPlanSnapshot {
  if (!assignment.plan) {
    return invalidReference("A atribuição não referencia uma versão de plano válida.");
  }

  return assignment.plan;
}

function requireSession(
  plan: TrainingPlanSnapshot,
  databaseId: string | null,
  label: string,
): TrainingSessionSnapshot {
  const session = plan.sessions.find((candidate) => candidate.databaseId === databaseId);

  if (!session) {
    return invalidReference(`A sessão de ${label} não pertence à versão atribuída.`);
  }

  return session;
}

function assertRestAssignmentIsCoherent(assignment: TrainingAssignmentSnapshot): void {
  if (
    assignment.plan ||
    assignment.mainSessionDatabaseId ||
    assignment.preparationSessionDatabaseId ||
    assignment.execution?.exercises.length
  ) {
    invalidReference("O descanso contém referências de treino incompatíveis.");
  }
}

function assertUnassignedAssignmentIsCoherent(assignment: TrainingAssignmentSnapshot): void {
  if (
    assignment.plan ||
    assignment.mainSessionDatabaseId ||
    assignment.preparationSessionDatabaseId ||
    assignment.execution
  ) {
    invalidReference("O dia não atribuído contém referências operacionais incompatíveis.");
  }
}

function assertNoPreparationSession(assignment: TrainingAssignmentSnapshot): void {
  if (assignment.preparationSessionDatabaseId) {
    invalidReference("A mobilidade não pode conter uma sessão de preparação.");
  }
}

function assertExecutionReferencesAssignedSessions(
  assignment: TrainingAssignmentSnapshot,
  assignedSessionIds: readonly string[],
): void {
  if (
    assignment.execution?.exercises.some(
      (exercise) => !assignedSessionIds.includes(exercise.sessionDatabaseId),
    )
  ) {
    invalidReference("A execução contém exercício fora das sessões atribuídas.");
  }
}

function invalidReference(message: string): never {
  throw new TrainingProjectionError("TRAINING_REFERENCE_INVALID", message);
}
