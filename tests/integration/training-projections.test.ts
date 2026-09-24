import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getPublicTrainingPlan } from "@/features/training/application/get-public-training-plan";
import { getTrainingDay } from "@/features/training/application/get-training-day";
import { PrismaTrainingRepository } from "@/features/training/data/prisma-training-repository";
import { createDatabaseFixture } from "./fixtures/database.fixture";
import { withImportDatabase } from "./fixtures/import-database.fixture";

describe("training projections with PostgreSQL", () => {
  it("reads the active public plan and preserves the assigned historical version", async () => {
    await withImportDatabase(async (client) => {
      const fixture = await client.$transaction(createDatabaseFixture);
      await client.planActivation.create({
        data: {
          domain: "training",
          logicalEnvironment: "local",
          trainingPlanVersionId: fixture.otherTrainingPlan.id,
          pointerImportBatchId: fixture.trainingPointer.id,
          activatedAt: fixture.date,
        },
      });
      await client.trainingSetExecution.create({
        data: {
          workspaceId: fixture.workspace.id,
          exerciseExecutionId: fixture.exerciseExecutions[0]!.id,
          setNumber: 1,
          status: "completed",
          value: 5,
          loadKg: "20.500",
        },
      });
      await client.trainingDayActivity.create({
        data: {
          workspaceId: fixture.workspace.id,
          civilDate: fixture.date,
          type: "structured_training",
          source: "plan",
          name: fixture.mainSession.name,
          plannedStartMinute: 540,
          plannedEndMinute: 570,
          assignmentId: fixture.assignment.id,
          trainingPlanVersionId: fixture.trainingPlan.id,
          sessionDefinitionId: fixture.mainSession.id,
        },
      });

      const repository = new PrismaTrainingRepository(client);
      const publicPlan = await getPublicTrainingPlan({ repository, environment: "local" });
      const trainingDay = await getTrainingDay(
        {
          repository,
          environment: "local",
          resolveWorkspace: () => ({ workspaceId: fixture.workspace.id }),
        },
        { civilDate: "2026-09-13" },
      );

      expect(publicPlan).toMatchObject({ status: "available", version: "2" });
      expect(trainingDay).toMatchObject({
        state: "training",
        planVersion: "1",
        main: {
          exercises: [
            {
              prescribedSets: 2,
              sets: [
                { setNumber: 1, status: "completed", value: 5, loadKg: "20.5" },
                { setNumber: 2, status: "pending", value: null, loadKg: null },
              ],
            },
            expect.any(Object),
            expect.any(Object),
            expect.any(Object),
          ],
        },
      });
    });
  });

  it("isolates assignments by the workspace resolved on the server", async () => {
    await withImportDatabase(async (client) => {
      const fixture = await client.$transaction(createDatabaseFixture);
      await client.planActivation.create({
        data: {
          domain: "training",
          logicalEnvironment: "local",
          trainingPlanVersionId: fixture.trainingPlan.id,
          pointerImportBatchId: fixture.trainingPointer.id,
          activatedAt: fixture.date,
        },
      });
      await client.dailyTrainingAssignment.create({
        data: {
          workspaceId: fixture.anotherWorkspace.id,
          civilDate: fixture.date,
          kind: "rest",
          reason: "Outro workspace",
        },
      });
      await client.trainingDayActivity.create({
        data: {
          workspaceId: fixture.workspace.id,
          civilDate: fixture.date,
          type: "structured_training",
          source: "plan",
          name: fixture.mainSession.name,
          plannedStartMinute: 540,
          plannedEndMinute: 570,
          assignmentId: fixture.assignment.id,
          trainingPlanVersionId: fixture.trainingPlan.id,
          sessionDefinitionId: fixture.mainSession.id,
        },
      });

      const repository = new PrismaTrainingRepository(client);
      const ownerDay = await getTrainingDay(
        {
          repository,
          environment: "local",
          resolveWorkspace: () => ({ workspaceId: fixture.workspace.id }),
        },
        { civilDate: "2026-09-13" },
      );
      const otherDay = await getTrainingDay(
        {
          repository,
          environment: "local",
          resolveWorkspace: () => ({ workspaceId: fixture.anotherWorkspace.id }),
        },
        { civilDate: "2026-09-13" },
      );

      expect(ownerDay.state).toBe("training");
      expect(otherDay).toMatchObject({ state: "rest", reason: "Outro workspace" });
    });
  });

  it("returns an unavailable state without fabricating a plan", async () => {
    await withImportDatabase(async (client) => {
      const fixture = await client.$transaction(createDatabaseFixture);
      const repository = new PrismaTrainingRepository(client);

      await expect(
        getTrainingDay(
          {
            repository,
            environment: "production",
            resolveWorkspace: () => ({ workspaceId: fixture.workspace.id }),
          },
          { civilDate: "2026-09-14" },
        ),
      ).resolves.toEqual({
        state: "unavailable",
        civilDate: "2026-09-14",
        reason: "active_plan_not_found",
        activities: [],
      });
    });
  });
});
