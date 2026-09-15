import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { withImportDatabase } from "./fixtures/import-database.fixture";
import { createDatabaseFixture } from "./fixtures/database.fixture";

describe("revisão esperada em duas conexões PostgreSQL", () => {
  it("treino confirma apenas uma gravação e rejeita workspace diferente", () =>
    withImportDatabase(async (client, { createConnection }) => {
      const fixture = await client.$transaction(createDatabaseFixture);
      const second = createConnection();
      const identities = await Promise.all([
        client.$queryRaw`SELECT pg_backend_pid() AS pid`,
        second.$queryRaw`SELECT pg_backend_pid() AS pid`,
      ]);
      expect(identities[0]).not.toEqual(identities[1]);
      const where = { id: fixture.execution.id, workspaceId: fixture.workspace.id, revision: 0 };
      const revisions = await Promise.all([
        client.trainingExecution.findUniqueOrThrow({ where: { id: where.id } }),
        second.trainingExecution.findUniqueOrThrow({ where: { id: where.id } }),
      ]);
      expect(revisions.map((row) => row.revision)).toEqual([0, 0]);
      const results = await Promise.all([
        client.trainingExecution.updateMany({
          where,
          data: { status: "in_progress", revision: { increment: 1 } },
        }),
        second.trainingExecution.updateMany({
          where,
          data: { status: "skipped", revision: { increment: 1 } },
        }),
      ]);
      expect(results.map((result) => result.count).sort()).toEqual([0, 1]);
      const winner = results[0].count === 1 ? "in_progress" : "skipped";
      expect(
        await client.trainingExecution.findUniqueOrThrow({ where: { id: where.id } }),
      ).toMatchObject({
        revision: 1,
        status: winner,
        assignmentId: fixture.assignment.id,
        trainingPlanVersionId: fixture.trainingPlan.id,
      });
      expect(
        (
          await second.trainingExecution.updateMany({
            where: { ...where, revision: 1, workspaceId: fixture.anotherWorkspace.id },
            data: { revision: { increment: 1 } },
          })
        ).count,
      ).toBe(0);
    }));

  it("refeição mantém status e campos do vencedor na mesma atualização", () =>
    withImportDatabase(async (client, { createConnection }) => {
      const fixture = await client.$transaction(createDatabaseFixture);
      const second = createConnection();
      const meal = await client.mealExecution.create({
        data: {
          workspaceId: fixture.workspace.id,
          assignmentId: fixture.nutritionAssignment.id,
          nutritionPlanVersionId: fixture.nutritionPlan.id,
          mealDefinitionId: fixture.meals[0].id,
          status: "pending",
        },
      });
      const where = { id: meal.id, workspaceId: fixture.workspace.id, revision: 0 };
      expect(
        (await second.mealExecution.findUniqueOrThrow({ where: { id: meal.id } })).revision,
      ).toBe(0);
      const results = await Promise.all([
        client.mealExecution.updateMany({
          where,
          data: {
            status: "followed_plan",
            optionDefinitionId: fixture.options[0].id,
            alternativeDescription: null,
            revision: { increment: 1 },
          },
        }),
        second.mealExecution.updateMany({
          where,
          data: {
            status: "followed_different",
            optionDefinitionId: null,
            alternativeDescription: "Alternativa sintética",
            revision: { increment: 1 },
          },
        }),
      ]);
      expect(results.map((result) => result.count).sort()).toEqual([0, 1]);
      const winner =
        results[0].count === 1
          ? {
              status: "followed_plan",
              optionDefinitionId: fixture.options[0].id,
              alternativeDescription: null,
            }
          : {
              status: "followed_different",
              optionDefinitionId: null,
              alternativeDescription: "Alternativa sintética",
            };
      expect(
        await client.mealExecution.findUniqueOrThrow({ where: { id: meal.id } }),
      ).toMatchObject({ ...winner, revision: 1, workspaceId: fixture.workspace.id });
      expect(
        (
          await second.mealExecution.updateMany({
            where,
            data: {
              status: "skipped",
              optionDefinitionId: null,
              alternativeDescription: null,
              revision: { increment: 1 },
            },
          })
        ).count,
      ).toBe(0);
    }));
});
