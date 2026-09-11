import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";

import { validateData } from "./validate-data.mjs";

let repositoryRoot;

function writeJson(path, value) {
  mkdirSync(join(repositoryRoot, path, ".."), { recursive: true });
  writeFileSync(join(repositoryRoot, path), JSON.stringify(value));
}

function createSchema(id, required = []) {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: id,
    type: "object",
    required,
  };
}

function createValidFixture() {
  repositoryRoot = join(tmpdir(), `kaizen-data-${process.pid}-${Date.now()}-${Math.random()}`);
  mkdirSync(join(repositoryRoot, "docs", "guides"), { recursive: true });
  writeFileSync(join(repositoryRoot, "docs", "guides", "TRAINING-GUIDE.md"), "# Treino\n");
  writeFileSync(join(repositoryRoot, "docs", "guides", "NUTRITION.md"), "# Nutrição\n");

  writeJson(
    "schemas/exercise-library.schema.json",
    createSchema("https://example.local/schemas/exercise-library.schema.json", ["exercises"]),
  );
  writeJson(
    "schemas/training-plan.schema.json",
    createSchema("https://example.local/schemas/training-plan.schema.json", [
      "plan_id",
      "sessions",
    ]),
  );
  writeJson(
    "schemas/nutrition-plan.schema.json",
    createSchema("https://example.local/schemas/nutrition-plan.schema.json", ["plan_id", "meals"]),
  );
  writeJson("data/exercises.json", { exercises: [{ id: "jump" }] });
  writeJson("data/plans/training.json", {
    plan_id: "training_v1",
    sessions: {
      main: { exercises: [{ exercise_id: "jump" }] },
    },
  });
  writeJson("data/reviews/review.json", { review_id: "review_v1" });
  writeJson("data/active.json", {
    active_plan_id: "training_v1",
    active_plan_path: "data/plans/training.json",
    review_path: "data/reviews/review.json",
    human_guide_path: "docs/guides/TRAINING-GUIDE.md",
  });
  writeJson("data/nutrition/plans/nutrition.json", {
    plan_id: "nutrition_v1",
    provenance: { active_training_plan_id: "training_v1" },
    energy_bands: { standard: {} },
    day_types: [
      {
        id: "training_day",
        energy_band_id: "standard",
        meal_ids: ["breakfast"],
      },
    ],
    timing_rules: [
      {
        id: "breakfast_time",
        meal_id: "breakfast",
        option_ids: ["standard_breakfast"],
      },
    ],
    meals: [
      {
        id: "breakfast",
        options: [{ id: "standard_breakfast" }],
      },
    ],
    carbohydrate_modules: [],
  });
  writeJson("data/nutrition/active.json", {
    active_plan_id: "nutrition_v1",
    active_plan_path: "data/nutrition/plans/nutrition.json",
    plan_schema_path: "schemas/nutrition-plan.schema.json",
    human_guide_path: "docs/guides/NUTRITION.md",
  });
}

beforeEach(createValidFixture);

afterEach(() => {
  rmSync(repositoryRoot, { force: true, recursive: true });
});

describe("validateData", () => {
  test("aceita schemas, ponteiros e referências válidos", () => {
    assert.deepEqual(validateData({ repositoryRoot }), []);
  });

  test("rejeita JSON inválido", () => {
    writeFileSync(join(repositoryRoot, "data", "broken.json"), "{");
    const errors = validateData({ repositoryRoot });

    assert.ok(errors.some((error) => error.includes("broken.json: JSON inválido")));
  });

  test("rejeita documento incompatível com o schema", () => {
    writeJson("data/exercises.json", {});
    const errors = validateData({ repositoryRoot });

    assert.ok(
      errors.some((error) => error.includes("data/exercises.json/") && error.includes("exercises")),
    );
  });

  test("rejeita schema que não pode ser compilado", () => {
    writeJson("schemas/exercise-library.schema.json", {
      ...createSchema("https://example.local/schemas/exercise-library.schema.json", ["exercises"]),
      unsupported_keyword: true,
    });
    const errors = validateData({ repositoryRoot });

    assert.ok(errors.some((error) => error.includes("schema inválido")));
  });

  test("rejeita IDs duplicados e exercício inexistente", () => {
    writeJson("data/exercises.json", {
      exercises: [{ id: "jump" }, { id: "jump" }],
    });
    writeJson("data/plans/training.json", {
      plan_id: "training_v1",
      sessions: {
        main: { exercises: [{ exercise_id: "missing" }] },
      },
    });
    const errors = validateData({ repositoryRoot });

    assert.ok(errors.some((error) => error.includes("ID de exercício duplicado")));
    assert.ok(errors.some((error) => error.includes("exercício inexistente")));
  });

  test("rejeita ponteiro que escapa ou não existe", () => {
    writeJson("data/active.json", {
      active_plan_id: "training_v1",
      active_plan_path: "../private.json",
      review_path: "data/reviews/missing.json",
      human_guide_path: "docs/guides/TRAINING-GUIDE.md",
    });
    const errors = validateData({ repositoryRoot });

    assert.ok(errors.some((error) => error.includes("dentro do repositório")));
    assert.ok(errors.some((error) => error.includes("destino inexistente")));
  });

  test("rejeita referências nutricionais quebradas", () => {
    const planPath = join(repositoryRoot, "data", "nutrition", "plans", "nutrition.json");
    const plan = JSON.parse(readFileSync(planPath, "utf8"));
    plan.day_types[0].energy_band_id = "missing";
    plan.timing_rules[0].option_ids = ["missing"];
    plan.meals[0].options.push({
      id: "reference",
      reference_option: "missing.option",
    });
    writeFileSync(planPath, JSON.stringify(plan));
    const errors = validateData({ repositoryRoot });

    assert.ok(errors.some((error) => error.includes("faixa de energia inexistente")));
    assert.ok(errors.some((error) => error.includes("opção inexistente")));
    assert.ok(errors.some((error) => error.includes("referência de opção inexistente")));
  });
});
