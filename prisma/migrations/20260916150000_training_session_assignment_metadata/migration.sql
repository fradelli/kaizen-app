ALTER TABLE "training_session_definition"
ADD COLUMN IF NOT EXISTS "assignment_role" "exercise_role",
ADD COLUMN IF NOT EXISTS "compatible_preparation_session_ids" JSONB;

ALTER TABLE "training_session_definition" DISABLE TRIGGER "definition_immutable";

UPDATE "training_session_definition"
SET
  "assignment_role" = CASE
    WHEN "session_id" IN ('lower_a', 'upper_a', 'lower_b', 'lower_b_microdose', 'upper_b')
      THEN 'main'::"exercise_role"
    WHEN "session_id" IN ('pre_upper_warmup', 'pre_lower_warmup', 'pre_footvolley_warmup')
      THEN 'preparation'::"exercise_role"
  END,
  "compatible_preparation_session_ids" = CASE
    WHEN "session_id" IN ('lower_a', 'lower_b', 'lower_b_microdose')
      AND EXISTS (
        SELECT 1 FROM "training_session_definition" AS "candidate"
        WHERE "candidate"."training_plan_version_id" = "training_session_definition"."training_plan_version_id"
          AND "candidate"."session_id" = 'pre_lower_warmup'
      ) THEN '["pre_lower_warmup"]'::jsonb
    WHEN "session_id" IN ('upper_a', 'upper_b')
      AND EXISTS (
        SELECT 1 FROM "training_session_definition" AS "candidate"
        WHERE "candidate"."training_plan_version_id" = "training_session_definition"."training_plan_version_id"
          AND "candidate"."session_id" = 'pre_upper_warmup'
      ) THEN '["pre_upper_warmup"]'::jsonb
    ELSE '[]'::jsonb
  END;

ALTER TABLE "training_session_definition" ENABLE TRIGGER "definition_immutable";

ALTER TABLE "training_session_definition"
ALTER COLUMN "assignment_role" SET NOT NULL,
ALTER COLUMN "assignment_role" SET DEFAULT 'main'::"exercise_role",
ALTER COLUMN "compatible_preparation_session_ids" SET NOT NULL,
ALTER COLUMN "compatible_preparation_session_ids" SET DEFAULT '[]'::jsonb;

ALTER TABLE "training_session_definition"
ADD CONSTRAINT "training_session_definition_compatible_preparation_ids_array_ck"
CHECK (jsonb_typeof("compatible_preparation_session_ids") = 'array');
