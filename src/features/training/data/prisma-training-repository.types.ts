import type { Prisma } from "@/generated/prisma/client";

export const trainingPlanInclude = {
  trainingSessionDefinition_plan: {
    orderBy: { sessionId: "asc" },
    include: {
      trainingExerciseDefinition_session: {
        orderBy: { ordinal: "asc" },
        include: { exercise: true },
      },
    },
  },
} as const satisfies Prisma.TrainingPlanVersionInclude;

export const trainingAssignmentInclude = {
  plan: { include: trainingPlanInclude },
  trainingExecution_assignment: {
    include: {
      trainingExerciseExecution_execution: {
        orderBy: [{ sessionDefinitionId: "asc" }, { exerciseDefinitionId: "asc" }],
        include: {
          trainingSetExecution_exerciseExecution: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  },
} as const satisfies Prisma.DailyTrainingAssignmentInclude;

export type PrismaTrainingPlanRow = Prisma.TrainingPlanVersionGetPayload<{
  include: typeof trainingPlanInclude;
}>;

export type PrismaTrainingAssignmentRow = Prisma.DailyTrainingAssignmentGetPayload<{
  include: typeof trainingAssignmentInclude;
}>;
