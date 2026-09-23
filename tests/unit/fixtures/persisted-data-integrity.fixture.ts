import type {
  PlanDefinitionSnapshot,
  PlanDefinitionSource,
} from "@/features/plan-definition-import/domain/plan-definition-import.types";
import type {
  ActivePlanPointer,
  ExecutionMetadata,
  ExerciseLibrary,
  NutritionPlan,
  TrainingPlan,
  TrainingSchedule,
} from "@/features/plan-definition-import/domain/plan-definition-source.types";
import type { PersistedDefinitionSnapshot } from "@/features/persisted-data-integrity/domain/persisted-data-integrity.types";

export function createIntegrityFixture(): {
  canonical: PlanDefinitionSnapshot;
  persisted: PersistedDefinitionSnapshot;
} {
  const date = "2026-09-13";
  const timestamp = `${date}T00:00:00.000Z`;
  const dose = {
    source_text: "4-6",
    minimum: 4,
    maximum: 6,
    unit: "repetitions",
    scope: "total",
    qualifier: null,
  };
  const library: ExerciseLibrary = {
    exercises: [{ id: "exercise", name_pt: "Exercício sintético" }],
  };
  const metadata: ExecutionMetadata = {
    sessions: [
      {
        plan_id: "training",
        plan_version: "1",
        session_id: "main",
        assignment_role: "main",
        compatible_preparation_session_ids: [],
      },
    ],
    exercises: [
      {
        exercise_id: "exercise",
        measurement_type: "repetitions",
        load_applicable: true,
        load_unit: "kg",
        normalization_rule: { prescriptions: [dose] },
      },
    ],
  };
  const training: TrainingPlan = {
    plan_id: "training",
    version: "1",
    status: "active",
    created_at: date,
    last_updated: date,
    sessions: {
      main: {
        name: "Treino sintético",
        target_duration_minutes: 30,
        exercises: [{ exercise_id: "exercise", sets: 2, reps: "4-6" }],
      },
    },
  };
  const nutrition: NutritionPlan = {
    plan_id: "nutrition",
    version: "1",
    lifecycle_status: "active",
    professional_status: "not_validated",
    created_at: date,
    last_updated: date,
    effective_from: date,
    effective_until: null,
    timezone: "America/Sao_Paulo",
    energy_bands: { band: { minimum_kcal: 0, maximum_kcal: 1, status: "not_validated" } },
    day_types: [
      {
        id: "day",
        label: "Dia sintético",
        energy_band_id: "band",
        carbohydrate_modules: { minimum: 0, maximum: 1 },
        meal_rule: "rule",
        meal_ids: ["meal"],
      },
    ],
    meals: [
      {
        id: "meal",
        label: "Refeição sintética",
        default_time: "08:00",
        required: true,
        options: [
          { id: "option", label: "Opção sintética", items: [] },
          { id: "reference", label: "Referência sintética", reference_option: "meal.option" },
        ],
      },
    ],
    timing_rules: [{ meal_id: "meal", rule: "synthetic" }],
  };
  const trainingPointer: ActivePlanPointer = {
    schema_version: "1",
    active_plan_path: "data/plans/test.json",
    active_plan_id: "training",
  };
  const schedule: TrainingSchedule = {
    schema_version: "1",
    last_updated: date,
    timezone: "America/Sao_Paulo",
    weekend_game: { enabled: true, day: "saturday", start_time: null },
    planning_defaults: { footvolley_duration_minutes: 90 },
    models: {
      saturday_game: [{ day: "monday", time: "09:00", session: "main" }],
      sunday_game: [{ day: "monday", time: "09:00", session: "main" }],
    },
  };
  const nutritionPointer: ActivePlanPointer = {
    schema_version: "1",
    active_plan_path: "data/nutrition/plans/test.json",
    active_plan_id: "nutrition",
  };
  const sources: PlanDefinitionSource[] = [
    {
      kind: "exercise_library",
      path: "data/exercises.json",
      document: library,
      schemaVersion: "1",
      sha256: "0".repeat(64),
    },
    {
      kind: "execution_metadata",
      path: "data/training-execution-metadata.json",
      document: metadata,
      schemaVersion: "1",
      sha256: "1".repeat(64),
    },
    {
      kind: "training_plan",
      path: "data/plans/test.json",
      document: training,
      schemaVersion: "1",
      sha256: "2".repeat(64),
    },
    {
      kind: "nutrition_plan",
      path: "data/nutrition/plans/test.json",
      document: nutrition,
      schemaVersion: "1",
      sha256: "3".repeat(64),
    },
    {
      kind: "training_pointer",
      path: "data/active.json",
      document: trainingPointer,
      schemaVersion: "1",
      sha256: "4".repeat(64),
    },
    {
      kind: "nutrition_pointer",
      path: "data/nutrition/active.json",
      document: nutritionPointer,
      schemaVersion: "1",
      sha256: "5".repeat(64),
    },
    {
      kind: "training_schedule",
      path: "data/schedule.json",
      document: schedule,
      schemaVersion: "1",
      sha256: "6".repeat(64),
    },
  ];
  const canonical = {
    commit: "a".repeat(40),
    sources,
    documents: new Map(sources.map((source) => [source.path, source.document])),
    availablePaths: new Set(sources.map((source) => source.path)),
  };
  const persisted: PersistedDefinitionSnapshot = {
    batches: sources.map((source, index) => ({
      id: `batch${index}`,
      sourcePath: source.path,
      sourceKind: source.kind,
      sourceSha256: source.sha256,
      sourceSchemaVersion: source.schemaVersion,
      sourceDocument: source.document,
      applicationCommit: canonical.commit,
      result: "completed",
      errorCode: null,
      finishedAt: timestamp,
    })),
    exercises: [
      {
        id: "exercise",
        exerciseId: "exercise",
        libraryImportBatchId: "batch0",
        metadataImportBatchId: "batch1",
        namePt: library.exercises[0].name_pt,
        definition: library.exercises[0],
        measurementType: "repetitions",
        loadApplicable: true,
        loadUnit: "kg",
        normalizationRule: metadata.exercises[0].normalization_rule,
      },
    ],
    trainingPlans: [
      {
        id: "training",
        planId: "training",
        version: "1",
        sourceStatus: "active",
        sourceCreatedOn: timestamp,
        sourceUpdatedOn: timestamp,
        importBatchId: "batch2",
        weeklySchedule: schedule,
        weeklyScheduleSha256: "6".repeat(64),
      },
    ],
    sessions: [
      {
        id: "session",
        trainingPlanVersionId: "training",
        sessionId: "main",
        name: "Treino sintético",
        targetDurationMinutes: 30,
        shortDurationMinutes: null,
        intensity: null,
        notes: null,
        assignmentRole: "main",
        compatiblePreparationSessionIds: [],
      },
    ],
    prescriptions: [
      {
        id: "prescription",
        trainingPlanVersionId: "training",
        sessionDefinitionId: "session",
        exerciseDefinitionId: "exercise",
        ordinal: 1,
        sets: 2,
        prescribedText: "4-6",
        restSeconds: null,
        priority: null,
        notes: null,
        normalizedDose: dose,
      },
    ],
    nutritionPlans: [
      {
        id: "nutrition",
        planId: "nutrition",
        version: "1",
        lifecycleStatus: "active",
        professionalStatus: "not_validated",
        sourceCreatedOn: timestamp,
        sourceUpdatedOn: timestamp,
        effectiveFrom: timestamp,
        effectiveUntil: null,
        timezone: "America/Sao_Paulo",
        importBatchId: "batch3",
      },
    ],
    meals: [
      {
        id: "meal",
        nutritionPlanVersionId: "nutrition",
        mealId: "meal",
        ordinal: 1,
        label: "Refeição sintética",
        defaultTime: "1970-01-01T08:00:00.000Z",
        required: true,
        useWhen: null,
        timingRules: nutrition.timing_rules,
      },
    ],
    options: [
      {
        id: "option",
        nutritionPlanVersionId: "nutrition",
        mealDefinitionId: "meal",
        optionId: "option",
        ordinal: 1,
        label: "Opção sintética",
        useWhen: null,
        followUpRule: null,
        referenceOptionId: null,
        items: [],
        unknowns: null,
      },
      {
        id: "reference",
        nutritionPlanVersionId: "nutrition",
        mealDefinitionId: "meal",
        optionId: "reference",
        ordinal: 2,
        label: "Referência sintética",
        useWhen: null,
        followUpRule: null,
        referenceOptionId: "option",
        items: null,
        unknowns: null,
      },
    ],
    dayTypes: [
      {
        id: "day",
        nutritionPlanVersionId: "nutrition",
        dayTypeId: "day",
        ordinal: 1,
        label: "Dia sintético",
        energyBandId: "band",
        minimumKcal: 0,
        maximumKcal: 1,
        energyBandStatus: "not_validated",
        minimumModules: 0,
        maximumModules: 1,
        mealRule: "rule",
      },
    ],
    dayTypeMeals: [
      { nutritionPlanVersionId: "nutrition", dayTypeId: "day", mealId: "meal", ordinal: 1 },
    ],
    activations: [
      {
        id: "trainingActivation",
        domain: "training",
        logicalEnvironment: "local",
        trainingPlanVersionId: "training",
        nutritionPlanVersionId: null,
        pointerImportBatchId: "batch4",
        supersededAt: null,
      },
      {
        id: "nutritionActivation",
        domain: "nutrition",
        logicalEnvironment: "local",
        trainingPlanVersionId: null,
        nutritionPlanVersionId: "nutrition",
        pointerImportBatchId: "batch5",
        supersededAt: null,
      },
    ],
  };
  return { canonical, persisted };
}
