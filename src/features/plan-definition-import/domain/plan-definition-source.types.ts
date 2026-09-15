import type { JsonValue } from "./json-value.types";
export type Dose = {
  source_text: string;
  minimum: number;
  maximum: number;
  unit: string;
  scope: string;
  qualifier: string | null;
};
export type ExecutionMetadata = {
  exercises: {
    exercise_id: string;
    measurement_type: "repetitions" | "seconds" | "contacts" | "per_side";
    load_applicable: boolean;
    load_unit: string | null;
    normalization_rule: { prescriptions: Dose[] };
  }[];
};
export type ExerciseLibrary = { exercises: { id: string; name_pt: string }[] };
export type ActivePlanPointer = {
  schema_version: string;
  active_plan_id: string;
  active_plan_path: string;
};
export type TrainingPlan = {
  plan_id: string;
  version: string;
  status: string;
  created_at: string;
  last_updated: string;
  sessions: Record<
    string,
    {
      name: string;
      target_duration_minutes: number;
      short_version_target_minutes?: number;
      intensity?: string;
      notes?: string;
      exercises: {
        exercise_id: string;
        sets: number;
        reps: string;
        rest_seconds?: number;
        priority?: string;
        notes?: string;
      }[];
    }
  >;
};
type MealOptionBase = {
  id: string;
  label: string;
  use_when?: string;
  follow_up_rule?: string;
  unknowns?: JsonValue[];
};
export type MealOption = MealOptionBase &
  (
    | { items: JsonValue[]; reference_option?: never }
    | {
        items?: never;
        reference_option: string;
      }
  );
export type NutritionPlan = {
  plan_id: string;
  version: string;
  lifecycle_status: string;
  professional_status: string;
  created_at: string;
  last_updated: string;
  effective_from: string;
  effective_until: string | null;
  timezone: string;
  energy_bands: Record<string, { minimum_kcal: number; maximum_kcal: number; status: string }>;
  day_types: {
    id: string;
    label: string;
    energy_band_id: string;
    carbohydrate_modules: { minimum: number; maximum: number };
    meal_rule: string;
    meal_ids: string[];
  }[];
  meals: {
    id: string;
    label: string;
    default_time: string | null;
    required: boolean;
    use_when?: string;
    options: MealOption[];
  }[];
  timing_rules: ({ meal_id: string } & Record<string, JsonValue>)[];
};
