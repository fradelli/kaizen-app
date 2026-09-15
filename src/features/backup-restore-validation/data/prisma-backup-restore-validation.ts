import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { Client } from "pg";
import { importVersionedPlanDefinitions } from "../../plan-definition-import/application/import-versioned-plan-definitions";
import { PrismaPlanDefinitionImportRepository } from "../../plan-definition-import/data/prisma-plan-definition-import-repository";
import { readPlanDefinitionsFromGit } from "../../plan-definition-import/data/read-plan-definitions-from-git";
import { validatePlanDefinitionSnapshot } from "../../plan-definition-import/data/validate-plan-definition-snapshot";
import { validatePersistedData } from "../../persisted-data-integrity/application/validate-persisted-data";
import { readPersistedDefinitionSnapshot } from "../../persisted-data-integrity/data/prisma-persisted-data-reader";
import { PrismaClient } from "@/generated/prisma/client";
import { BackupRestoreValidationError } from "../domain/backup-restore-validation.error";
import type {
  RecoveryCanaryIdentity,
  RecoverySnapshot,
} from "../domain/backup-restore-validation.types";
import { runSanitizedCommand } from "./backup-restore-process.utils";

export function createRecoveryPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: [],
  });
}

export async function deployRecoveryMigrations(
  repositoryRoot: string,
  connectionString: string,
): Promise<void> {
  await runSanitizedCommand(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    {
      cwd: repositoryRoot,
      environment: {
        ...process.env,
        APP_ENV: "local",
        DATABASE_URL: connectionString,
        DIRECT_URL: connectionString,
      },
      failureCode: "MIGRATION_FAILED",
    },
  );
}

export async function assertRecoveryMigrationsCurrent(
  repositoryRoot: string,
  connectionString: string,
): Promise<void> {
  await runSanitizedCommand(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "status"],
    {
      cwd: repositoryRoot,
      environment: {
        ...process.env,
        APP_ENV: "local",
        DATABASE_URL: connectionString,
        DIRECT_URL: connectionString,
      },
      failureCode: "VALIDATION_FAILED",
    },
  );
}

export async function assertRecoveryTargetEmpty(connectionString: string): Promise<void> {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const result = await client.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM pg_catalog.pg_tables WHERE schemaname = 'public'",
    );
    if (result.rows[0]?.count !== "0") throw new BackupRestoreValidationError("VALIDATION_FAILED");
  } catch (error) {
    if (error instanceof BackupRestoreValidationError) throw error;
    throw new BackupRestoreValidationError("VALIDATION_FAILED");
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function importCanonicalRecoverySource(
  client: PrismaClient,
  repositoryRoot: string,
): Promise<string> {
  const snapshot = await readPlanDefinitionsFromGit(repositoryRoot);
  await importVersionedPlanDefinitions(
    {
      readSnapshot: async () => snapshot,
      validateSnapshot: validatePlanDefinitionSnapshot,
      repository: new PrismaPlanDefinitionImportRepository(client),
    },
    "local",
  );
  return snapshot.commit;
}

export async function createRecoveryCanary(client: PrismaClient): Promise<RecoveryCanaryIdentity> {
  const trainingActivation = await client.planActivation.findFirst({
    where: { domain: "training", logicalEnvironment: "local", supersededAt: null },
  });
  const nutritionActivation = await client.planActivation.findFirst({
    where: { domain: "nutrition", logicalEnvironment: "local", supersededAt: null },
  });
  if (!trainingActivation?.trainingPlanVersionId || !nutritionActivation?.nutritionPlanVersionId)
    throw new BackupRestoreValidationError("SOURCE_PREPARATION_FAILED");
  const trainingPlanVersionId = trainingActivation.trainingPlanVersionId;
  const nutritionPlanVersionId = nutritionActivation.nutritionPlanVersionId;
  const trainingSession = await client.trainingSessionDefinition.findFirst({
    where: { trainingPlanVersionId },
    orderBy: { sessionId: "asc" },
  });
  const prescription = await client.trainingExerciseDefinition.findFirst({
    where: { trainingPlanVersionId },
    orderBy: [{ sessionDefinitionId: "asc" }, { ordinal: "asc" }],
  });
  const dayType = await client.nutritionDayTypeDefinition.findFirst({
    where: { nutritionPlanVersionId },
    orderBy: { ordinal: "asc" },
  });
  const meal = await client.mealDefinition.findFirst({
    where: { nutritionPlanVersionId },
    orderBy: { ordinal: "asc" },
  });
  const option = meal
    ? await client.mealOptionDefinition.findFirst({
        where: {
          nutritionPlanVersionId,
          mealDefinitionId: meal.id,
        },
        orderBy: { ordinal: "asc" },
      })
    : undefined;
  if (!trainingSession || !prescription || !dayType || !meal || !option)
    throw new BackupRestoreValidationError("SOURCE_PREPARATION_FAILED");
  return client.$transaction(async (transaction) => {
    const workspace = await transaction.workspace.create({ data: {} });
    const civilDate = new Date("2026-09-15T00:00:00.000Z");
    const pairingRateLimit = await transaction.pairingRateLimit.create({
      data: {
        workspaceId: workspace.id,
        bucketKey: "backup-restore-canary",
        windowStartedAt: civilDate,
        attemptCount: 1,
        expiresAt: new Date("2026-09-15T00:15:00.000Z"),
      },
    });
    const trainingAssignment = await transaction.dailyTrainingAssignment.create({
      data: {
        workspaceId: workspace.id,
        civilDate,
        kind: "training",
        trainingPlanVersionId,
        mainSessionId: trainingSession.id,
      },
    });
    const trainingExecution = await transaction.trainingExecution.create({
      data: {
        workspaceId: workspace.id,
        assignmentId: trainingAssignment.id,
        trainingPlanVersionId,
        status: "in_progress",
      },
    });
    const exerciseExecution = await transaction.trainingExerciseExecution.create({
      data: {
        workspaceId: workspace.id,
        trainingExecutionId: trainingExecution.id,
        trainingPlanVersionId,
        sessionDefinitionId: prescription.sessionDefinitionId,
        exerciseDefinitionId: prescription.id,
        role: "main",
        itemStatus: "pending",
      },
    });
    const setExecution = await transaction.trainingSetExecution.create({
      data: {
        workspaceId: workspace.id,
        exerciseExecutionId: exerciseExecution.id,
        setNumber: 1,
        status: "pending",
      },
    });
    const nutritionAssignment = await transaction.dailyNutritionAssignment.create({
      data: {
        workspaceId: workspace.id,
        civilDate,
        nutritionPlanVersionId,
        dayTypeId: dayType.id,
      },
    });
    const mealExecution = await transaction.mealExecution.create({
      data: {
        workspaceId: workspace.id,
        assignmentId: nutritionAssignment.id,
        nutritionPlanVersionId,
        mealDefinitionId: meal.id,
        optionDefinitionId: option.id,
        status: "followed_plan",
      },
    });
    return {
      workspaceId: workspace.id,
      pairingRateLimitId: pairingRateLimit.id,
      trainingAssignmentId: trainingAssignment.id,
      trainingExecutionId: trainingExecution.id,
      exerciseExecutionId: exerciseExecution.id,
      setExecutionId: setExecution.id,
      nutritionAssignmentId: nutritionAssignment.id,
      mealExecutionId: mealExecution.id,
    };
  });
}

export async function readRecoverySnapshot(
  client: PrismaClient,
  canary: RecoveryCanaryIdentity,
): Promise<RecoverySnapshot> {
  const entityCountEntries = await Promise.all([
    ["workspaces", await client.workspace.count()],
    ["pairingRateLimits", await client.pairingRateLimit.count()],
    ["importBatches", await client.importBatch.count()],
    ["planActivations", await client.planActivation.count()],
    ["exerciseDefinitions", await client.exerciseDefinition.count()],
    ["trainingPlans", await client.trainingPlanVersion.count()],
    ["trainingSessions", await client.trainingSessionDefinition.count()],
    ["trainingPrescriptions", await client.trainingExerciseDefinition.count()],
    ["trainingAssignments", await client.dailyTrainingAssignment.count()],
    ["trainingExecutions", await client.trainingExecution.count()],
    ["exerciseExecutions", await client.trainingExerciseExecution.count()],
    ["setExecutions", await client.trainingSetExecution.count()],
    ["nutritionPlans", await client.nutritionPlanVersion.count()],
    ["nutritionDayTypes", await client.nutritionDayTypeDefinition.count()],
    ["meals", await client.mealDefinition.count()],
    ["mealOptions", await client.mealOptionDefinition.count()],
    ["dayTypeMeals", await client.nutritionDayTypeMeal.count()],
    ["nutritionAssignments", await client.dailyNutritionAssignment.count()],
    ["mealExecutions", await client.mealExecution.count()],
  ] as const);
  const workspaceCountEntries = await Promise.all([
    [
      "pairingRateLimits",
      await client.pairingRateLimit.count({ where: { workspaceId: canary.workspaceId } }),
    ],
    [
      "trainingAssignments",
      await client.dailyTrainingAssignment.count({ where: { workspaceId: canary.workspaceId } }),
    ],
    [
      "trainingExecutions",
      await client.trainingExecution.count({ where: { workspaceId: canary.workspaceId } }),
    ],
    [
      "exerciseExecutions",
      await client.trainingExerciseExecution.count({ where: { workspaceId: canary.workspaceId } }),
    ],
    [
      "setExecutions",
      await client.trainingSetExecution.count({ where: { workspaceId: canary.workspaceId } }),
    ],
    [
      "nutritionAssignments",
      await client.dailyNutritionAssignment.count({ where: { workspaceId: canary.workspaceId } }),
    ],
    [
      "mealExecutions",
      await client.mealExecution.count({ where: { workspaceId: canary.workspaceId } }),
    ],
  ] as const);
  const activations = await client.planActivation.findMany({
    where: { logicalEnvironment: "local", supersededAt: null },
    include: { trainingPlan: true, nutritionPlan: true },
    orderBy: { domain: "asc" },
  });
  const canaryChecks = await Promise.all([
    client.workspace.findUnique({ where: { id: canary.workspaceId }, select: { id: true } }),
    client.pairingRateLimit.findUnique({
      where: { id: canary.pairingRateLimitId },
      select: { id: true },
    }),
    client.dailyTrainingAssignment.findUnique({
      where: { id: canary.trainingAssignmentId },
      select: { id: true },
    }),
    client.trainingExecution.findUnique({
      where: { id: canary.trainingExecutionId },
      select: { id: true },
    }),
    client.trainingExerciseExecution.findUnique({
      where: { id: canary.exerciseExecutionId },
      select: { id: true },
    }),
    client.trainingSetExecution.findUnique({
      where: { id: canary.setExecutionId },
      select: { id: true },
    }),
    client.dailyNutritionAssignment.findUnique({
      where: { id: canary.nutritionAssignmentId },
      select: { id: true },
    }),
    client.mealExecution.findUnique({
      where: { id: canary.mealExecutionId },
      select: { id: true },
    }),
  ]);
  return {
    entityCounts: Object.fromEntries(entityCountEntries),
    workspaceCounts: Object.fromEntries(workspaceCountEntries),
    activePlans: activations.map((activation) =>
      activation.trainingPlan
        ? `training:${activation.trainingPlan.planId}:${activation.trainingPlan.version}`
        : `nutrition:${activation.nutritionPlan?.planId}:${activation.nutritionPlan?.version}`,
    ),
    canaryRows: canaryChecks.map((row, index) => `${index}:${row?.id ?? "missing"}`),
  };
}

export async function assertCanonicalRecoveryIntegrity(
  client: PrismaClient,
  repositoryRoot: string,
  commit: string,
): Promise<void> {
  const report = await validatePersistedData({
    readCanonicalSnapshot: () => readPlanDefinitionsFromGit(repositoryRoot, commit),
    readSnapshotAtCommit: (sourceCommit) =>
      readPlanDefinitionsFromGit(repositoryRoot, sourceCommit),
    validateCanonicalSnapshot: validatePlanDefinitionSnapshot,
    readPersistedSnapshot: () => readPersistedDefinitionSnapshot(client),
  });
  if (report.result !== "valid") throw new BackupRestoreValidationError("VALIDATION_FAILED");
}
