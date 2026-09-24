CREATE TYPE "training_activity_type" AS ENUM ('structured_training', 'sport_practice', 'specific_training', 'mobility');
CREATE TYPE "training_activity_status" AS ENUM ('scheduled', 'in_progress', 'completed', 'skipped');
CREATE TYPE "training_activity_role" AS ENUM ('primary', 'preparation');
CREATE TYPE "training_activity_energy" AS ENUM ('tired', 'normal', 'energized');

ALTER TABLE "training_execution"
  ADD COLUMN "intensity" "training_activity_intensity",
  ADD COLUMN "energy" "training_activity_energy";

ALTER TABLE "training_activity_log" RENAME TO "training_day_activity";
ALTER TABLE "training_day_activity" RENAME COLUMN "start_minute" TO "planned_start_minute";
ALTER TABLE "training_day_activity" RENAME COLUMN "end_minute" TO "planned_end_minute";
ALTER TABLE "training_day_activity" RENAME COLUMN "description" TO "comment";
ALTER TABLE "training_day_activity" RENAME CONSTRAINT "training_activity_log_pkey" TO "training_day_activity_pkey";
ALTER TABLE "training_day_activity" RENAME CONSTRAINT "training_activity_log_workspace_fk" TO "training_day_activity_workspace_fk";
ALTER INDEX "training_activity_log_i1" RENAME TO "training_day_activity_i1";

ALTER TABLE "training_day_activity"
  ADD COLUMN "type" "training_activity_type",
  ADD COLUMN "role" "training_activity_role" NOT NULL DEFAULT 'primary',
  ADD COLUMN "name" TEXT,
  ADD COLUMN "sport" TEXT,
  ADD COLUMN "status" "training_activity_status" NOT NULL DEFAULT 'scheduled',
  ADD COLUMN "actual_start_minute" INTEGER,
  ADD COLUMN "actual_end_minute" INTEGER,
  ADD COLUMN "energy" "training_activity_energy",
  ADD COLUMN "deleted_at" TIMESTAMPTZ(6),
  ADD COLUMN "parent_activity_id" UUID;

UPDATE "training_day_activity"
SET
  "type" = CASE
    WHEN "kind" = 'mobility'::"training_activity_kind" THEN 'mobility'::"training_activity_type"
    ELSE 'sport_practice'::"training_activity_type"
  END,
  "name" = COALESCE(NULLIF(btrim("comment"), ''), CASE
    WHEN "kind" = 'footvolley'::"training_activity_kind" AND "format" = 'game'::"training_activity_format" THEN 'Jogo de futevôlei'
    WHEN "kind" = 'footvolley'::"training_activity_kind" THEN 'Prática de futevôlei'
    WHEN "kind" = 'mobility'::"training_activity_kind" THEN 'Mobilidade'
    ELSE 'Atividade migrada'
  END),
  "sport" = CASE WHEN "kind" = 'footvolley'::"training_activity_kind" THEN 'Futevôlei' ELSE NULL END,
  "status" = 'completed'::"training_activity_status",
  "actual_start_minute" = "planned_start_minute",
  "actual_end_minute" = "planned_end_minute";

ALTER TABLE "training_day_activity"
  ALTER COLUMN "type" SET NOT NULL,
  ALTER COLUMN "name" SET NOT NULL,
  ALTER COLUMN "intensity" DROP NOT NULL,
  DROP COLUMN "kind",
  DROP COLUMN "format";

ALTER TABLE "training_day_activity" DROP CONSTRAINT IF EXISTS "training_activity_log_time_range_ck";
ALTER TABLE "training_day_activity" DROP CONSTRAINT IF EXISTS "training_activity_log_description_ck";
ALTER TABLE "training_day_activity" DROP CONSTRAINT IF EXISTS "training_activity_log_other_description_ck";

ALTER TABLE "training_day_activity"
  ADD CONSTRAINT "training_day_activity_u1" UNIQUE ("workspace_id", "id"),
  ADD CONSTRAINT "training_day_activity_parent_fk"
    FOREIGN KEY ("workspace_id", "parent_activity_id") REFERENCES "training_day_activity"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT "training_day_activity_parent_role_ck"
    CHECK (("role" = 'primary'::"training_activity_role" AND "parent_activity_id" IS NULL) OR ("role" = 'preparation'::"training_activity_role" AND "parent_activity_id" IS NOT NULL AND "type" = 'mobility'::"training_activity_type")),
  ADD CONSTRAINT "training_day_activity_name_ck"
    CHECK (char_length(btrim("name")) BETWEEN 1 AND 120),
  ADD CONSTRAINT "training_day_activity_sport_ck"
    CHECK ("sport" IS NULL OR char_length(btrim("sport")) BETWEEN 1 AND 80),
  ADD CONSTRAINT "training_day_activity_planned_time_ck"
    CHECK ("planned_start_minute" >= 0 AND "planned_start_minute" < 1440 AND "planned_end_minute" > "planned_start_minute" AND "planned_end_minute" <= 1440),
  ADD CONSTRAINT "training_day_activity_actual_time_ck"
    CHECK (("actual_start_minute" IS NULL AND "actual_end_minute" IS NULL) OR ("actual_start_minute" >= 0 AND "actual_start_minute" < 1440 AND "actual_end_minute" > "actual_start_minute" AND "actual_end_minute" <= 1440)),
  ADD CONSTRAINT "training_day_activity_completion_ck"
    CHECK ("status" <> 'completed'::"training_activity_status" OR "actual_start_minute" IS NOT NULL),
  ADD CONSTRAINT "training_day_activity_mobility_feedback_ck"
    CHECK ("type" <> 'mobility'::"training_activity_type" OR ("intensity" IS NULL AND "energy" IS NULL)),
  ADD CONSTRAINT "training_day_activity_comment_ck"
    CHECK ("comment" IS NULL OR char_length("comment") <= 1000);

CREATE INDEX "training_day_activity_i2"
ON "training_day_activity"("workspace_id", "parent_activity_id");

DROP TYPE "training_activity_kind";
DROP TYPE "training_activity_format";
