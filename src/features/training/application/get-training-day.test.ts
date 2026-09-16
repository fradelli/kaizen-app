import { describe, expect, it, vi } from "vitest";
import type {
  TrainingAssignmentSnapshot,
  TrainingDaySnapshot,
  TrainingPlanSnapshot,
} from "../domain/training-day.types";
import { getTrainingDay } from "./get-training-day";
import type { TrainingRepository } from "./training-repository";
import { trainingPlanFixture } from "./get-public-training-plan.test";

describe("getTrainingDay", () => {
  it("resolves the workspace on the server and returns choices for an unassigned day", async () => {
    const plan = trainingPlanFixture();
    const findTrainingDay = vi.fn(async (): Promise<TrainingDaySnapshot> => ({
      activePlan: plan,
      assignment: null,
    }));

    const result = await getTrainingDay(
      {
        repository: repositoryWith(findTrainingDay),
        environment: "local",
        resolveWorkspace: () => ({ workspaceId: "workspace-server" }),
      },
      { civilDate: "2026-09-16" },
    );

    expect(findTrainingDay).toHaveBeenCalledWith({
      workspaceId: "workspace-server",
      civilDate: "2026-09-16",
      environment: "local",
    });
    expect(result).toMatchObject({
      state: "unassigned",
      assignmentId: null,
      availablePlan: { planId: "plan-v1" },
    });
  });

  it("uses the assigned historical plan and overlays partial execution", async () => {
    const activePlan = { ...trainingPlanFixture(), databaseId: "plan-db-v2", version: "2" };
    const assignment = trainingAssignmentFixture(trainingPlanFixture());

    const result = await getTrainingDay(dependencies({ activePlan, assignment }), {
      civilDate: "2026-09-16",
    });

    expect(result).toMatchObject({
      state: "training",
      planVersion: "1",
      main: {
        exercises: [
          {
            executionId: "exercise-execution",
            status: "completed",
            sets: [
              { setNumber: 1, status: "completed", value: 5, loadKg: "20" },
              { setNumber: 2, status: "pending", value: null, loadKg: null },
            ],
          },
        ],
      },
    });
  });

  it("returns rest without requiring an active plan", async () => {
    const result = await getTrainingDay(
      dependencies({
        activePlan: null,
        assignment: {
          ...trainingAssignmentFixture(null),
          kind: "rest",
          mainSessionDatabaseId: null,
          reason: "Recuperação",
          execution: null,
        },
      }),
      { civilDate: "2026-09-16" },
    );

    expect(result).toEqual({
      state: "rest",
      civilDate: "2026-09-16",
      assignmentId: "assignment",
      assignmentRevision: 3,
      reason: "Recuperação",
      execution: null,
    });
  });

  it("rejects an execution bound to an incompatible role", async () => {
    const assignment = trainingAssignmentFixture(trainingPlanFixture());
    const incompatibleAssignment: TrainingAssignmentSnapshot = {
      ...assignment,
      execution: assignment.execution
        ? {
            ...assignment.execution,
            exercises: assignment.execution.exercises.map((exercise) => ({
              ...exercise,
              role: "mobility",
            })),
          }
        : null,
    };

    await expect(
      getTrainingDay(
        dependencies({ activePlan: trainingPlanFixture(), assignment: incompatibleAssignment }),
        {
          civilDate: "2026-09-16",
        },
      ),
    ).rejects.toMatchObject({ code: "TRAINING_REFERENCE_INVALID" });
  });

  it("rejects an invalid date before reading the repository", async () => {
    const findTrainingDay = vi.fn();

    await expect(
      getTrainingDay(
        {
          repository: repositoryWith(findTrainingDay),
          environment: "local",
          resolveWorkspace: () => ({ workspaceId: "workspace-server" }),
        },
        { civilDate: "2026-02-29" },
      ),
    ).rejects.toMatchObject({ code: "TRAINING_CIVIL_DATE_INVALID" });
    expect(findTrainingDay).not.toHaveBeenCalled();
  });
});

function dependencies(snapshot: TrainingDaySnapshot) {
  return {
    repository: repositoryWith(async () => snapshot),
    environment: "local" as const,
    resolveWorkspace: () => ({ workspaceId: "workspace-server" }),
  };
}

function repositoryWith(
  findTrainingDay: TrainingRepository["findTrainingDay"],
): TrainingRepository {
  return {
    findActiveTrainingPlan: async () => null,
    findTrainingDay,
  };
}

function trainingAssignmentFixture(plan: TrainingPlanSnapshot | null): TrainingAssignmentSnapshot {
  return {
    id: "assignment",
    civilDate: "2026-09-16" as TrainingAssignmentSnapshot["civilDate"],
    kind: "training",
    mainSessionDatabaseId: plan?.sessions[0]?.databaseId ?? null,
    preparationSessionDatabaseId: null,
    reason: null,
    revision: 3,
    plan,
    execution: plan
      ? {
          id: "execution",
          status: "in_progress",
          comment: null,
          startedAt: "2026-09-16T10:00:00.000Z",
          completedAt: null,
          revision: 2,
          exercises: [
            {
              id: "exercise-execution",
              prescriptionId: "prescription-squat",
              sessionDatabaseId: "session-db-a",
              role: "main",
              itemStatus: "completed",
              comment: null,
              revision: 1,
              sets: [
                {
                  setNumber: 1,
                  status: "completed",
                  value: 5,
                  leftValue: null,
                  rightValue: null,
                  directionValues: null,
                  loadKg: "20",
                  revision: 1,
                },
              ],
            },
          ],
        }
      : null,
  };
}
