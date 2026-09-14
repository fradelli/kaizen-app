import { afterAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { Prisma } from "@/generated/prisma/client";
import { getDatabaseClient } from "@/lib/db/client";

import { createDatabaseFixture } from "./fixtures/database.fixture";
import type { DatabaseFixture } from "./fixtures/database.fixture";

const rollback = new Error("TEST_TRANSACTION_ROLLBACK");
const client = getDatabaseClient();

afterAll(() => client.$disconnect());

async function withFixture(
  run: (tx: Prisma.TransactionClient, fixture: DatabaseFixture) => Promise<void>,
) {
  try {
    await client.$transaction(
      async (tx) => {
        await run(tx, await createDatabaseFixture(tx));
        throw rollback;
      },
      { timeout: 30_000 },
    );
  } catch (error) {
    if (error !== rollback) throw error;
  }
}

async function rejected(tx: Prisma.TransactionClient, run: () => Promise<unknown>, code = "23514") {
  await tx.$executeRawUnsafe("SAVEPOINT integrity_case");
  let failure: unknown;
  try {
    await run();
  } catch (error) {
    failure = error;
  }
  await tx.$executeRawUnsafe("ROLLBACK TO SAVEPOINT integrity_case");
  await tx.$executeRawUnsafe("RELEASE SAVEPOINT integrity_case");
  expect(failure).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
  const meta = (failure as Prisma.PrismaClientKnownRequestError).meta;
  const driverError = meta?.driverAdapterError as { cause?: { originalCode?: string } } | undefined;
  expect(meta?.code ?? driverError?.cause?.originalCode).toBe(code);
}

describe("PostgreSQL e migration P0", () => {
  it("conecta via Client server-only e preserva data civil/timestamp", () =>
    withFixture(async (tx, f) => {
      const row = await tx.dailyTrainingAssignment.findUniqueOrThrow({
        where: { id: f.assignment.id },
      });
      expect(row.civilDate.toISOString()).toBe("2026-09-13T00:00:00.000Z");
      expect(row.createdAt).toBeInstanceOf(Date);
      expect(await tx.$queryRaw`SELECT current_setting('TimeZone') AS timezone`).toEqual([
        { timezone: "UTC" },
      ]);
    }));

  it("impede duplicação diária e ownership forjado", () =>
    withFixture(async (tx, f) => {
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO daily_training_assignment (workspace_id,civil_date,kind) VALUES (${f.workspace.id}::uuid,${f.date}::date,'rest')`,
        "23505",
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_execution (workspace_id,assignment_id,training_plan_version_id,status) VALUES (${f.anotherWorkspace.id}::uuid,${f.assignment.id}::uuid,${f.trainingPlan.id}::uuid,'not_started')`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status) VALUES (${f.anotherWorkspace.id}::uuid,${f.exerciseExecutions[0].id}::uuid,1,'pending')`,
      );
    }));

  it("não permite binding nullable incorreto nem exercícios no descanso", () =>
    withFixture(async (tx, f) => {
      const rest = await tx.dailyTrainingAssignment.create({
        data: {
          workspaceId: f.workspace.id,
          civilDate: new Date("2026-09-14T00:00:00Z"),
          kind: "rest",
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_execution (workspace_id,assignment_id,training_plan_version_id,status) VALUES (${f.workspace.id}::uuid,${rest.id}::uuid,${f.trainingPlan.id}::uuid,'not_started')`,
      );
      const restExecution = await tx.trainingExecution.create({
        data: { workspaceId: f.workspace.id, assignmentId: rest.id, status: "not_started" },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_exercise_execution (workspace_id,training_execution_id,training_plan_version_id,session_definition_id,exercise_definition_id,role,item_status) VALUES (${f.workspace.id}::uuid,${restExecution.id}::uuid,${f.trainingPlan.id}::uuid,${f.mainSession.id}::uuid,${f.prescriptions[0].id}::uuid,'main','pending')`,
      );
    }));

  it("congela atribuições e definições históricas", () =>
    withFixture(async (tx, f) => {
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE daily_training_assignment SET main_session_id=${f.preparationSession.id}::uuid,preparation_session_id=NULL WHERE id=${f.assignment.id}::uuid`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE training_plan_version SET version='changed' WHERE id=${f.trainingPlan.id}::uuid`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE import_batch SET source_document='{}'::jsonb WHERE id=${f.trainingBatch.id}::uuid`,
      );
      const set = await tx.trainingSetExecution.create({
        data: {
          workspaceId: f.workspace.id,
          exerciseExecutionId: f.exerciseExecutions[0].id,
          setNumber: 1,
          status: "pending",
        },
      });
      await rejected(
        tx,
        () => tx.$executeRaw`DELETE FROM training_set_execution WHERE id=${set.id}::uuid`,
      );
    }));

  it("valida séries, carga e estados sem limitar resultado à dose", () =>
    withFixture(async (tx, f) => {
      await tx.trainingSetExecution.create({
        data: {
          workspaceId: f.workspace.id,
          exerciseExecutionId: f.exerciseExecutions[0].id,
          setNumber: 1,
          status: "completed",
          value: 100,
          loadKg: "10.125",
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,value) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[0].id}::uuid,1,'completed',4)`,
        "23505",
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,value) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[0].id}::uuid,3,'completed',4)`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,value) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[0].id}::uuid,2,'pending',4)`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,value,load_kg) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[0].id}::uuid,2,'completed',4,'NaN'::numeric)`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status) VALUES (${f.workspace.id}::uuid,${f.preparationExecution.id}::uuid,1,'pending')`,
      );
    }));

  it("preserva lados e direções e rejeita campos incompatíveis", () =>
    withFixture(async (tx, f) => {
      await tx.trainingSetExecution.create({
        data: {
          workspaceId: f.workspace.id,
          exerciseExecutionId: f.exerciseExecutions[1].id,
          setNumber: 1,
          status: "completed",
          leftValue: 4,
          rightValue: 5,
        },
      });
      await tx.trainingSetExecution.create({
        data: {
          workspaceId: f.workspace.id,
          exerciseExecutionId: f.exerciseExecutions[2].id,
          setNumber: 1,
          status: "completed",
          directionValues: { forward: 4, backward: 5 },
        },
      });
      await tx.trainingSetExecution.create({
        data: {
          workspaceId: f.workspace.id,
          exerciseExecutionId: f.exerciseExecutions[3].id,
          setNumber: 1,
          status: "completed",
          directionValues: { flexion: 4, extension: 5, left: 6, right: 7 },
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,left_value,right_value,load_kg) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[1].id}::uuid,2,'completed',4,5,1)`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,direction_values) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[3].id}::uuid,2,'completed','{"flexion":4,"extension":5,"left":6}'::jsonb)`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_set_execution (workspace_id,exercise_execution_id,set_number,status,direction_values) VALUES (${f.workspace.id}::uuid,${f.exerciseExecutions[2].id}::uuid,2,'completed','{"forward":4.5,"backward":5}'::jsonb)`,
      );
    }));

  it("exige prescrição revisada e FKs da mesma versão", () =>
    withFixture(async (tx, f) => {
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO training_exercise_definition (training_plan_version_id,session_definition_id,exercise_definition_id,ordinal,sets,prescribed_text,normalized_dose) VALUES (${f.trainingPlan.id}::uuid,${f.mainSession.id}::uuid,${f.prescriptions[0].exerciseDefinitionId}::uuid,5,1,'unreviewed','{}'::jsonb)`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO daily_training_assignment (workspace_id,civil_date,kind,training_plan_version_id,main_session_id) VALUES (${f.workspace.id}::uuid,'2026-09-15'::date,'training',${f.otherTrainingPlan.id}::uuid,${f.mainSession.id}::uuid)`,
        "23503",
      );
    }));

  it("valida refeição, opção e descrição alternativa", () =>
    withFixture(async (tx, f) => {
      const meal = await tx.mealExecution.create({
        data: {
          workspaceId: f.workspace.id,
          assignmentId: f.nutritionAssignment.id,
          nutritionPlanVersionId: f.nutritionPlan.id,
          mealDefinitionId: f.meals[0].id,
          status: "followed_plan",
          optionDefinitionId: f.options[0].id,
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE meal_execution SET option_definition_id=${f.options[1].id}::uuid WHERE id=${meal.id}::uuid`,
        "23503",
      );
      await rejected(
        tx,
        () => tx.$executeRaw`UPDATE meal_execution SET status='skipped' WHERE id=${meal.id}::uuid`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE meal_execution SET status='followed_different',option_definition_id=NULL,alternative_description='   ' WHERE id=${meal.id}::uuid`,
      );
      await tx.mealExecution.update({
        where: { id: meal.id },
        data: {
          status: "followed_different",
          optionDefinitionId: null,
          alternativeDescription: "Registro sintético",
          revision: { increment: 1 },
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE daily_nutrition_assignment SET day_type_id=${f.dayTypes[1].id}::uuid WHERE id=${f.nutritionAssignment.id}::uuid`,
      );
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO meal_execution (workspace_id,assignment_id,nutrition_plan_version_id,meal_definition_id,status) VALUES (${f.workspace.id}::uuid,${f.nutritionAssignment.id}::uuid,${f.nutritionPlan.id}::uuid,${f.meals[1].id}::uuid,'pending')`,
      );
    }));

  it("mantém uma ativação atual e preserva histórico", () =>
    withFixture(async (tx, f) => {
      const activation = await tx.planActivation.create({
        data: {
          domain: "training",
          logicalEnvironment: "local",
          trainingPlanVersionId: f.trainingPlan.id,
          pointerImportBatchId: f.trainingPointer.id,
          activatedAt: f.date,
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`INSERT INTO plan_activation (domain,logical_environment,training_plan_version_id,pointer_import_batch_id,activated_at) VALUES ('training','local',${f.otherTrainingPlan.id}::uuid,${f.trainingPointer.id}::uuid,${f.date})`,
        "23505",
      );
      await tx.planActivation.update({
        where: { id: activation.id },
        data: { supersededAt: f.date },
      });
      await tx.planActivation.create({
        data: {
          domain: "training",
          logicalEnvironment: "local",
          trainingPlanVersionId: f.otherTrainingPlan.id,
          pointerImportBatchId: f.trainingPointer.id,
          activatedAt: f.date,
        },
      });
      await rejected(
        tx,
        () =>
          tx.$executeRaw`UPDATE plan_activation SET superseded_at=NULL WHERE id=${activation.id}::uuid`,
      );
      expect(
        await tx.trainingExecution.findUniqueOrThrow({ where: { id: f.execution.id } }),
      ).toMatchObject({ trainingPlanVersionId: f.trainingPlan.id });
    }));

  it("usa revisão esperada para detectar gravação obsoleta", () =>
    withFixture(async (tx, f) => {
      expect(
        (
          await tx.trainingExecution.updateMany({
            where: { id: f.execution.id, workspaceId: f.workspace.id, revision: 0 },
            data: { status: "in_progress", revision: { increment: 1 } },
          })
        ).count,
      ).toBe(1);
      expect(
        (
          await tx.trainingExecution.updateMany({
            where: { id: f.execution.id, workspaceId: f.workspace.id, revision: 0 },
            data: { status: "completed", revision: { increment: 1 } },
          })
        ).count,
      ).toBe(0);
    }));
});
