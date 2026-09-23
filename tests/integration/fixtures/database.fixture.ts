import { randomBytes } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";

export async function createDatabaseFixture(
  tx: Prisma.TransactionClient,
  weeklySchedule?: Prisma.InputJsonValue,
) {
  const date = new Date("2026-09-13T00:00:00Z");
  const workspace = await tx.workspace.create({ data: {} });
  const anotherWorkspace = await tx.workspace.create({ data: {} });
  const batch = (sourceKind: string) =>
    tx.importBatch.create({
      data: {
        sourceKind,
        sourcePath: `data/test_${sourceKind}.json`,
        sourceSha256: randomBytes(32).toString("hex"),
        sourceSchemaVersion: "1.0.0",
        applicationCommit: "1".repeat(40),
        sourceDocument: {},
        startedAt: date,
        finishedAt: date,
        result: "completed",
      },
    });
  const library = await batch("exercise_library");
  const metadata = await batch("execution_metadata");
  const trainingBatch = await batch("training_plan");
  const trainingPlan = await tx.trainingPlanVersion.create({
    data: {
      planId: "test_training",
      version: "1",
      sourceStatus: "active",
      sourceCreatedOn: date,
      sourceUpdatedOn: date,
      importBatchId: trainingBatch.id,
      weeklySchedule,
      weeklyScheduleSha256: weeklySchedule ? "a".repeat(64) : undefined,
    },
  });
  const otherTrainingBatch = await batch("training_plan");
  const otherTrainingPlan = await tx.trainingPlanVersion.create({
    data: {
      planId: "test_training",
      version: "2",
      sourceStatus: "active",
      sourceCreatedOn: date,
      sourceUpdatedOn: date,
      importBatchId: otherTrainingBatch.id,
    },
  });
  const mainSession = await tx.trainingSessionDefinition.create({
    data: {
      trainingPlanVersionId: trainingPlan.id,
      sessionId: "test_main",
      name: "Sessão sintética",
      targetDurationMinutes: 30,
      assignmentRole: "main",
      compatiblePreparationSessionIds: ["test_preparation"],
    },
  });
  const preparationSession = await tx.trainingSessionDefinition.create({
    data: {
      trainingPlanVersionId: trainingPlan.id,
      sessionId: "test_preparation",
      name: "Preparação sintética",
      targetDurationMinutes: 5,
      assignmentRole: "preparation",
    },
  });
  const prescriptions = [];
  for (const [ordinal, scope] of [
    "total",
    "each_side",
    "two_directions",
    "four_directions",
  ].entries()) {
    const dose = {
      source_text: `test_${scope}`,
      minimum: 4,
      maximum: 6,
      unit: "repetitions",
      scope,
      qualifier: null,
    };
    const definition = await tx.exerciseDefinition.create({
      data: {
        exerciseId: `test_${scope}`,
        libraryImportBatchId: library.id,
        metadataImportBatchId: metadata.id,
        namePt: "Exercício sintético",
        definition: {
          how_to: ["Execute com controle."],
          cues: ["Mantenha a posição estável."],
          risks: null,
        },
        measurementType: scope === "each_side" ? "per_side" : "repetitions",
        loadApplicable: scope === "total",
        loadUnit: scope === "total" ? "kg" : null,
        normalizationRule: { prescriptions: [dose] },
      },
    });
    const prescription = await tx.trainingExerciseDefinition.create({
      data: {
        trainingPlanVersionId: trainingPlan.id,
        sessionDefinitionId: mainSession.id,
        exerciseDefinitionId: definition.id,
        ordinal: ordinal + 1,
        sets: 2,
        prescribedText: dose.source_text,
        normalizedDose: dose,
      },
    });
    prescriptions.push(prescription);
  }
  const preparationPrescription = await tx.trainingExerciseDefinition.create({
    data: {
      trainingPlanVersionId: trainingPlan.id,
      sessionDefinitionId: preparationSession.id,
      exerciseDefinitionId: prescriptions[0].exerciseDefinitionId,
      ordinal: 1,
      sets: 1,
      prescribedText: "test_total",
      normalizedDose: {
        source_text: "test_total",
        minimum: 4,
        maximum: 6,
        unit: "repetitions",
        scope: "total",
        qualifier: null,
      },
    },
  });
  const assignment = await tx.dailyTrainingAssignment.create({
    data: {
      workspaceId: workspace.id,
      civilDate: date,
      kind: "training",
      trainingPlanVersionId: trainingPlan.id,
      mainSessionId: mainSession.id,
      preparationSessionId: preparationSession.id,
    },
  });
  const execution = await tx.trainingExecution.create({
    data: {
      workspaceId: workspace.id,
      assignmentId: assignment.id,
      trainingPlanVersionId: trainingPlan.id,
      status: "not_started",
    },
  });
  const exerciseExecutions = [];
  for (const prescription of prescriptions) {
    exerciseExecutions.push(
      await tx.trainingExerciseExecution.create({
        data: {
          workspaceId: workspace.id,
          trainingExecutionId: execution.id,
          trainingPlanVersionId: trainingPlan.id,
          sessionDefinitionId: mainSession.id,
          exerciseDefinitionId: prescription.id,
          role: "main",
          itemStatus: "pending",
        },
      }),
    );
  }
  const preparationExecution = await tx.trainingExerciseExecution.create({
    data: {
      workspaceId: workspace.id,
      trainingExecutionId: execution.id,
      trainingPlanVersionId: trainingPlan.id,
      sessionDefinitionId: preparationSession.id,
      exerciseDefinitionId: preparationPrescription.id,
      role: "preparation",
      itemStatus: "pending",
    },
  });
  const nutritionBatch = await batch("nutrition_plan");
  const nutritionPlan = await tx.nutritionPlanVersion.create({
    data: {
      planId: "test_nutrition",
      version: "1",
      lifecycleStatus: "active",
      professionalStatus: "not_validated",
      sourceCreatedOn: date,
      sourceUpdatedOn: date,
      effectiveFrom: date,
      timezone: "America/Sao_Paulo",
      importBatchId: nutritionBatch.id,
    },
  });
  const dayTypes = [];
  const meals = [];
  const options = [];
  for (let ordinal = 1; ordinal <= 2; ordinal++) {
    const dayType = await tx.nutritionDayTypeDefinition.create({
      data: {
        nutritionPlanVersionId: nutritionPlan.id,
        dayTypeId: `test_day_${ordinal}`,
        ordinal,
        label: "Tipo sintético",
        energyBandId: "test_band",
        minimumKcal: 0,
        maximumKcal: 1,
        energyBandStatus: "not_validated",
        minimumModules: 0,
        maximumModules: 1,
        mealRule: "test_rule",
      },
    });
    const meal = await tx.mealDefinition.create({
      data: {
        nutritionPlanVersionId: nutritionPlan.id,
        mealId: `test_meal_${ordinal}`,
        ordinal,
        label: "Refeição sintética",
        required: true,
        timingRules: {},
      },
    });
    await tx.nutritionDayTypeMeal.create({
      data: {
        nutritionPlanVersionId: nutritionPlan.id,
        dayTypeId: dayType.id,
        mealId: meal.id,
        ordinal: 1,
      },
    });
    const option = await tx.mealOptionDefinition.create({
      data: {
        nutritionPlanVersionId: nutritionPlan.id,
        mealDefinitionId: meal.id,
        optionId: "test_option",
        ordinal: 1,
        label: "Opção sintética",
        items: [],
      },
    });
    dayTypes.push(dayType);
    meals.push(meal);
    options.push(option);
  }
  const nutritionAssignment = await tx.dailyNutritionAssignment.create({
    data: {
      workspaceId: workspace.id,
      civilDate: date,
      nutritionPlanVersionId: nutritionPlan.id,
      dayTypeId: dayTypes[0].id,
    },
  });
  const trainingPointer = await batch("training_pointer");
  return {
    date,
    workspace,
    anotherWorkspace,
    library,
    metadata,
    trainingBatch,
    trainingPlan,
    otherTrainingPlan,
    mainSession,
    preparationSession,
    prescriptions,
    assignment,
    execution,
    exerciseExecutions,
    preparationExecution,
    nutritionPlan,
    dayTypes,
    meals,
    options,
    nutritionAssignment,
    trainingPointer,
  };
}

export type DatabaseFixture = Awaited<ReturnType<typeof createDatabaseFixture>>;
