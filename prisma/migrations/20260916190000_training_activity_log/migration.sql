CREATE TYPE "training_activity_kind" AS ENUM ('footvolley', 'mobility', 'other');
CREATE TYPE "training_activity_format" AS ENUM ('training', 'game');
CREATE TYPE "training_activity_intensity" AS ENUM ('low', 'moderate', 'high');

CREATE TABLE "training_activity_log" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL,
  "civil_date" DATE NOT NULL,
  "kind" "training_activity_kind" NOT NULL,
  "format" "training_activity_format" NOT NULL,
  "intensity" "training_activity_intensity" NOT NULL,
  "start_minute" INTEGER NOT NULL,
  "end_minute" INTEGER NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revision" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "training_activity_log_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "training_activity_log_workspace_fk"
    FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "training_activity_log_time_range_ck"
    CHECK ("start_minute" >= 0 AND "start_minute" < 1440 AND "end_minute" > "start_minute" AND "end_minute" <= 1440),
  CONSTRAINT "training_activity_log_description_ck"
    CHECK ("description" IS NULL OR char_length("description") <= 1000),
  CONSTRAINT "training_activity_log_other_description_ck"
    CHECK ("kind" <> 'other'::"training_activity_kind" OR NULLIF(btrim("description"), '') IS NOT NULL)
);

CREATE INDEX "training_activity_log_i1"
ON "training_activity_log"("workspace_id", "civil_date", "start_minute");
