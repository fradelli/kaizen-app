ALTER TABLE "training_exercise_definition"
  ADD COLUMN "block_id" TEXT,
  ADD COLUMN "block_mode" TEXT,
  ADD COLUMN "block_ordinal" INTEGER,
  ADD COLUMN "block_position" INTEGER;

ALTER TABLE "training_exercise_definition"
  ADD CONSTRAINT "training_exercise_definition_block_shape_ck"
  CHECK (
    ("block_id" IS NULL AND "block_mode" IS NULL AND "block_ordinal" IS NULL AND "block_position" IS NULL)
    OR
    ("block_id" IS NOT NULL AND "block_mode" IN ('single', 'alternating')
      AND "block_ordinal" > 0 AND "block_position" BETWEEN 1 AND 2)
  );

CREATE INDEX "training_exercise_definition_block_i1"
  ON "training_exercise_definition" ("session_definition_id", "block_ordinal", "block_position");

ALTER TABLE "training_day_activity" DROP CONSTRAINT "training_day_activity_definition_ck";
ALTER TABLE "training_day_activity"
  ADD CONSTRAINT "training_day_activity_definition_ck"
  CHECK (
    ("type" = 'structured_training'::"training_activity_type"
      AND "training_plan_version_id" IS NOT NULL
      AND "session_definition_id" IS NOT NULL)
    OR
    ("type" <> 'structured_training'::"training_activity_type"
      AND "session_definition_id" IS NULL
      AND ("preparation_session_definition_id" IS NULL
        OR ("training_plan_version_id" IS NOT NULL
          AND "type" IN ('specific_training'::"training_activity_type", 'sport_practice'::"training_activity_type"))))
  );
