import "server-only";

import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { toCivilDateDatabaseValue } from "../domain/training-day.rules";
import type {
  TrainingDaySnapshot,
  TrainingEnvironment,
  TrainingPlanSnapshot,
} from "../domain/training-day.types";
import { TrainingProjectionError } from "../domain/training-projection.error";
import type { FindTrainingDayInput, TrainingRepository } from "../application/training-repository";
import { mapPrismaTrainingAssignment, mapPrismaTrainingPlan } from "./prisma-training.mapper";
import { trainingAssignmentInclude, trainingPlanInclude } from "./prisma-training-repository.types";

type TrainingReadClient = PrismaClient | Prisma.TransactionClient;

export class PrismaTrainingRepository implements TrainingRepository {
  constructor(private readonly client: PrismaClient) {}

  async findActiveTrainingPlan(
    environment: TrainingEnvironment,
  ): Promise<TrainingPlanSnapshot | null> {
    return findActiveTrainingPlan(this.client, environment);
  }

  async findTrainingDay(input: FindTrainingDayInput): Promise<TrainingDaySnapshot> {
    return this.client.$transaction(
      async (transaction) => {
        const activePlan = await findActiveTrainingPlan(transaction, input.environment);
        const assignment = await transaction.dailyTrainingAssignment.findUnique({
          where: {
            workspaceId_civilDate: {
              workspaceId: input.workspaceId,
              civilDate: toCivilDateDatabaseValue(input.civilDate),
            },
          },
          include: trainingAssignmentInclude,
        });

        return Object.freeze({
          activePlan,
          assignment: assignment ? mapPrismaTrainingAssignment(assignment) : null,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
}

async function findActiveTrainingPlan(
  client: TrainingReadClient,
  environment: TrainingEnvironment,
): Promise<TrainingPlanSnapshot | null> {
  const activation = await client.planActivation.findFirst({
    where: {
      domain: "training",
      logicalEnvironment: environment,
      supersededAt: null,
    },
    orderBy: { activatedAt: "desc" },
    include: { trainingPlan: { include: trainingPlanInclude } },
  });

  if (!activation) {
    return null;
  }

  if (!activation.trainingPlan) {
    throw new TrainingProjectionError(
      "TRAINING_REFERENCE_INVALID",
      "A ativação de treino não referencia uma versão válida.",
    );
  }

  return mapPrismaTrainingPlan(activation.trainingPlan);
}
