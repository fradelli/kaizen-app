import "server-only";

import { getDatabaseClient } from "@/lib/db/client";
import { getServerEnvironment } from "@/lib/env/server";
import { resolveFixedWorkspace } from "@/lib/security/workspace";
import { getPublicTrainingPlan } from "../application/get-public-training-plan";
import { getTrainingDay } from "../application/get-training-day";
import type { PublicTrainingPlanDto, TrainingDayDto } from "../application/training-dto";
import { PrismaTrainingRepository } from "./prisma-training-repository";

export async function queryPublicTrainingPlan(): Promise<PublicTrainingPlanDto> {
  const environment = getServerEnvironment();

  return getPublicTrainingPlan({
    repository: new PrismaTrainingRepository(getDatabaseClient()),
    environment: environment.APP_ENV,
  });
}

export async function queryFixedWorkspaceTrainingDay(civilDate: string): Promise<TrainingDayDto> {
  const environment = getServerEnvironment();

  return getTrainingDay(
    {
      repository: new PrismaTrainingRepository(getDatabaseClient()),
      environment: environment.APP_ENV,
      resolveWorkspace: resolveFixedWorkspace,
    },
    { civilDate },
  );
}
