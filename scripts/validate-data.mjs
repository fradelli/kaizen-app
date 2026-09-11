import { existsSync, readFileSync, readdirSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schemaAssignments = [
  {
    matches: (path) => path === "data/exercises.json",
    schema: "https://example.local/schemas/exercise-library.schema.json",
  },
  {
    matches: (path) => /^data\/plans\/[^/]+\.json$/.test(path),
    schema: "https://example.local/schemas/training-plan.schema.json",
  },
  {
    matches: (path) => /^data\/nutrition\/plans\/[^/]+\.json$/.test(path),
    schema: "https://example.local/schemas/nutrition-plan.schema.json",
  },
];

function toRepositoryPath(repositoryRoot, path) {
  return relative(repositoryRoot, path).split(sep).join("/");
}

function walkJsonFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return walkJsonFiles(path);
    }

    return entry.isFile() && entry.name.endsWith(".json") ? [path] : [];
  });
}

function parseJsonFiles(repositoryRoot, files) {
  const documents = new Map();
  const errors = [];

  for (const file of files.sort()) {
    const path = toRepositoryPath(repositoryRoot, file);

    try {
      documents.set(path, JSON.parse(readFileSync(file, "utf8")));
    } catch (error) {
      errors.push(`${path}: JSON inválido (${error.message}).`);
    }
  }

  return { documents, errors };
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates].sort();
}

function validateUniqueIds(errors, path, label, values) {
  for (const duplicate of findDuplicates(values)) {
    errors.push(`${path}: ${label} duplicado: ${duplicate}.`);
  }
}

function resolveRepositoryLink(repositoryRoot, sourcePath, value, errors) {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${sourcePath}: caminho ausente ou inválido.`);
    return undefined;
  }

  if (isAbsolute(value) || value.split(/[\\/]/).includes("..")) {
    errors.push(`${sourcePath}: caminho deve permanecer dentro do repositório.`);
    return undefined;
  }

  const target = resolve(repositoryRoot, value);
  const rootPrefix = `${resolve(repositoryRoot)}${sep}`;

  if (target !== resolve(repositoryRoot) && !target.startsWith(rootPrefix)) {
    errors.push(`${sourcePath}: caminho escapa do repositório.`);
    return undefined;
  }

  if (!existsSync(target)) {
    errors.push(`${sourcePath}: destino inexistente: ${value}.`);
    return undefined;
  }

  return value.split("\\").join("/");
}

function validateSchemas(documents) {
  const errors = [];
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictRequired: false,
  });
  addFormats(ajv);

  for (const [path, document] of documents) {
    if (!path.startsWith("schemas/") || !path.endsWith(".schema.json")) {
      continue;
    }

    try {
      ajv.addSchema(document);
      ajv.getSchema(document.$id);
    } catch (error) {
      errors.push(`${path}: schema inválido (${error.message}).`);
    }
  }

  for (const [path, document] of documents) {
    const assignment = schemaAssignments.find(({ matches }) => matches(path));

    if (!assignment) {
      continue;
    }

    let validate;

    try {
      validate = ajv.getSchema(assignment.schema);
    } catch (error) {
      errors.push(`${path}: schema não pôde ser compilado (${error.message}).`);
      continue;
    }

    if (!validate) {
      errors.push(`${path}: schema não carregado: ${assignment.schema}.`);
      continue;
    }

    if (!validate(document)) {
      for (const issue of validate.errors ?? []) {
        errors.push(`${path}${issue.instancePath || "/"}: ${issue.message ?? "schema inválido"}.`);
      }
    }
  }

  return errors;
}

function validateTrainingData(documents) {
  const errors = [];
  const exerciseLibrary = documents.get("data/exercises.json");
  const exerciseIdValues = Array.isArray(exerciseLibrary?.exercises)
    ? exerciseLibrary.exercises.map((exercise) => exercise.id)
    : [];
  const exerciseIds = new Set(exerciseIdValues);
  const planEntries = [...documents].filter(([path]) => /^data\/plans\/[^/]+\.json$/.test(path));

  validateUniqueIds(errors, "data/exercises.json", "ID de exercício", exerciseIdValues);
  validateUniqueIds(
    errors,
    "data/plans",
    "ID de plano",
    planEntries.map(([, plan]) => plan.plan_id),
  );

  for (const [path, plan] of planEntries) {
    for (const [sessionId, session] of Object.entries(plan.sessions ?? {})) {
      for (const [index, exercise] of (session.exercises ?? []).entries()) {
        if (!exerciseIds.has(exercise.exercise_id)) {
          errors.push(
            `${path}/sessions/${sessionId}/exercises/${index}: exercício inexistente: ${exercise.exercise_id}.`,
          );
        }
      }
    }
  }

  return {
    errors,
    planIds: new Set(planEntries.map(([, plan]) => plan.plan_id)),
  };
}

function validateNutritionPlan(path, plan, trainingPlanIds) {
  const errors = [];
  const mealIds = (plan.meals ?? []).map((meal) => meal.id);
  const meals = new Map((plan.meals ?? []).map((meal) => [meal.id, meal]));
  const optionReferences = new Set();

  validateUniqueIds(errors, path, "ID de refeição", mealIds);
  validateUniqueIds(
    errors,
    path,
    "ID de tipo de dia",
    (plan.day_types ?? []).map((dayType) => dayType.id),
  );
  validateUniqueIds(
    errors,
    path,
    "ID de regra de horário",
    (plan.timing_rules ?? []).map((rule) => rule.id),
  );
  validateUniqueIds(
    errors,
    path,
    "ID de módulo de carboidrato",
    (plan.carbohydrate_modules ?? []).map((module) => module.id),
  );

  for (const meal of plan.meals ?? []) {
    validateUniqueIds(
      errors,
      `${path}/meals/${meal.id}`,
      "ID de opção",
      (meal.options ?? []).map((option) => option.id),
    );

    for (const option of meal.options ?? []) {
      optionReferences.add(`${meal.id}.${option.id}`);
    }
  }

  for (const [index, dayType] of (plan.day_types ?? []).entries()) {
    if (!(dayType.energy_band_id in (plan.energy_bands ?? {}))) {
      errors.push(
        `${path}/day_types/${index}: faixa de energia inexistente: ${dayType.energy_band_id}.`,
      );
    }

    for (const mealId of dayType.meal_ids ?? []) {
      if (!meals.has(mealId)) {
        errors.push(`${path}/day_types/${index}: refeição inexistente: ${mealId}.`);
      }
    }
  }

  for (const [index, rule] of (plan.timing_rules ?? []).entries()) {
    const meal = meals.get(rule.meal_id);

    if (!meal) {
      errors.push(`${path}/timing_rules/${index}: refeição inexistente: ${rule.meal_id}.`);
      continue;
    }

    const availableOptions = new Set((meal.options ?? []).map((option) => option.id));

    for (const optionId of rule.option_ids ?? []) {
      if (!availableOptions.has(optionId)) {
        errors.push(
          `${path}/timing_rules/${index}: opção inexistente em ${rule.meal_id}: ${optionId}.`,
        );
      }
    }
  }

  for (const [mealIndex, meal] of (plan.meals ?? []).entries()) {
    for (const [optionIndex, option] of (meal.options ?? []).entries()) {
      if (option.reference_option && !optionReferences.has(option.reference_option)) {
        errors.push(
          `${path}/meals/${mealIndex}/options/${optionIndex}: referência de opção inexistente: ${option.reference_option}.`,
        );
      }
    }
  }

  if (!trainingPlanIds.has(plan.provenance?.active_training_plan_id)) {
    errors.push(
      `${path}/provenance/active_training_plan_id: plano de treino inexistente: ${plan.provenance?.active_training_plan_id}.`,
    );
  }

  return errors;
}

function validatePointers(repositoryRoot, documents, trainingPlanIds) {
  const errors = [];
  const trainingActive = documents.get("data/active.json");
  const nutritionActive = documents.get("data/nutrition/active.json");

  if (trainingActive) {
    const activePlanPath = resolveRepositoryLink(
      repositoryRoot,
      "data/active.json/active_plan_path",
      trainingActive.active_plan_path,
      errors,
    );
    resolveRepositoryLink(
      repositoryRoot,
      "data/active.json/review_path",
      trainingActive.review_path,
      errors,
    );
    resolveRepositoryLink(
      repositoryRoot,
      "data/active.json/human_guide_path",
      trainingActive.human_guide_path,
      errors,
    );

    const activePlan = activePlanPath ? documents.get(activePlanPath) : undefined;

    if (activePlan && activePlan.plan_id !== trainingActive.active_plan_id) {
      errors.push("data/active.json: active_plan_id diverge do arquivo apontado.");
    }
  }

  if (nutritionActive) {
    const activePlanPath = resolveRepositoryLink(
      repositoryRoot,
      "data/nutrition/active.json/active_plan_path",
      nutritionActive.active_plan_path,
      errors,
    );
    resolveRepositoryLink(
      repositoryRoot,
      "data/nutrition/active.json/plan_schema_path",
      nutritionActive.plan_schema_path,
      errors,
    );
    resolveRepositoryLink(
      repositoryRoot,
      "data/nutrition/active.json/human_guide_path",
      nutritionActive.human_guide_path,
      errors,
    );

    const activePlan = activePlanPath ? documents.get(activePlanPath) : undefined;

    if (activePlan && activePlan.plan_id !== nutritionActive.active_plan_id) {
      errors.push("data/nutrition/active.json: active_plan_id diverge do arquivo apontado.");
    }
  }

  const nutritionPlans = [...documents].filter(([path]) =>
    /^data\/nutrition\/plans\/[^/]+\.json$/.test(path),
  );

  validateUniqueIds(
    errors,
    "data/nutrition/plans",
    "ID de plano",
    nutritionPlans.map(([, plan]) => plan.plan_id),
  );

  for (const [path, plan] of nutritionPlans) {
    errors.push(...validateNutritionPlan(path, plan, trainingPlanIds));
  }

  return errors;
}

export function validateData({ repositoryRoot = process.cwd() } = {}) {
  const root = resolve(repositoryRoot);
  const files = [
    ...walkJsonFiles(resolve(root, "data")),
    ...walkJsonFiles(resolve(root, "schemas")),
  ];
  const { documents, errors } = parseJsonFiles(root, files);
  const schemaErrors = validateSchemas(documents);
  const { errors: trainingErrors, planIds } = validateTrainingData(documents);
  const pointerErrors = validatePointers(root, documents, planIds);

  return [...errors, ...schemaErrors, ...trainingErrors, ...pointerErrors].sort();
}

function run() {
  const errors = validateData();

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[Data integrity] ${error}`);
    }

    process.exitCode = 1;
    return;
  }

  console.log("Data integrity validation passed.");
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  run();
}
