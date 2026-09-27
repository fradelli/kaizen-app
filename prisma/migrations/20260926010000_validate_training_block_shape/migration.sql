ALTER TABLE "training_exercise_definition"
  DROP CONSTRAINT "training_exercise_definition_block_shape_ck";

ALTER TABLE "training_exercise_definition"
  ADD CONSTRAINT "training_exercise_definition_block_shape_ck"
  CHECK (
    ("block_id" IS NULL AND "block_mode" IS NULL AND "block_ordinal" IS NULL AND "block_position" IS NULL)
    OR
    ("block_id" IS NOT NULL AND "block_mode" IS NOT NULL
      AND "block_ordinal" IS NOT NULL AND "block_position" IS NOT NULL
      AND "block_ordinal" > 0
      AND (("block_mode" = 'single' AND "block_position" = 1)
        OR ("block_mode" = 'alternating' AND "block_position" BETWEEN 1 AND 2)))
  );
