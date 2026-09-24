ALTER TYPE "training_activity_status" ADD VALUE IF NOT EXISTS 'paused';

CREATE TYPE "training_activity_source" AS ENUM ('plan', 'manual');

ALTER TABLE "training_day_activity"
  ADD COLUMN "source" "training_activity_source" NOT NULL DEFAULT 'manual',
  ADD COLUMN "started_at" TIMESTAMPTZ(6),
  ADD COLUMN "completed_at" TIMESTAMPTZ(6),
  ADD COLUMN "assignment_id" UUID,
  ADD COLUMN "training_plan_version_id" UUID,
  ADD COLUMN "session_definition_id" UUID,
  ADD COLUMN "preparation_session_definition_id" UUID;

UPDATE "training_day_activity"
SET
  "started_at" = (
    "civil_date"::timestamp + make_interval(mins => "actual_start_minute")
  ) AT TIME ZONE 'America/Sao_Paulo',
  "completed_at" = CASE
    WHEN "status" = 'completed'::"training_activity_status" THEN (
      "civil_date"::timestamp + make_interval(mins => "actual_end_minute")
    ) AT TIME ZONE 'America/Sao_Paulo'
    ELSE NULL
  END
WHERE "status" IN (
  'in_progress'::"training_activity_status",
  'completed'::"training_activity_status"
)
  AND "actual_start_minute" IS NOT NULL;

ALTER TABLE "training_day_activity"
  DROP CONSTRAINT "training_day_activity_execution_lifecycle_ck",
  DROP CONSTRAINT "training_day_activity_feedback_lifecycle_ck";

ALTER TABLE "training_day_activity"
  ADD CONSTRAINT "training_day_activity_assignment_fk"
    FOREIGN KEY ("workspace_id", "assignment_id")
    REFERENCES "daily_training_assignment"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT "training_day_activity_plan_fk"
    FOREIGN KEY ("training_plan_version_id")
    REFERENCES "training_plan_version"("id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT "training_day_activity_main_session_fk"
    FOREIGN KEY ("training_plan_version_id", "session_definition_id")
    REFERENCES "training_session_definition"("training_plan_version_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT "training_day_activity_preparation_session_fk"
    FOREIGN KEY ("training_plan_version_id", "preparation_session_definition_id")
    REFERENCES "training_session_definition"("training_plan_version_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT "training_day_activity_definition_ck"
    CHECK (
      ("type" = 'structured_training'::"training_activity_type"
        AND "training_plan_version_id" IS NOT NULL
        AND "session_definition_id" IS NOT NULL)
      OR
      ("type" <> 'structured_training'::"training_activity_type"
        AND "session_definition_id" IS NULL
        AND "preparation_session_definition_id" IS NULL)
    ),
  ADD CONSTRAINT "training_day_activity_timestamps_ck"
    CHECK (
      ("status" = 'scheduled'::"training_activity_status"
        AND "started_at" IS NULL
        AND "completed_at" IS NULL)
      OR
      ("status" IN ('in_progress'::"training_activity_status", 'paused'::"training_activity_status")
        AND "started_at" IS NOT NULL
        AND "completed_at" IS NULL)
      OR
      ("status" = 'completed'::"training_activity_status"
        AND "started_at" IS NOT NULL
        AND "completed_at" >= "started_at")
      OR
      ("status" = 'skipped'::"training_activity_status")
    ),
  ADD CONSTRAINT "training_day_activity_actual_time_v2_ck"
    CHECK (
      ("actual_start_minute" IS NULL AND "actual_end_minute" IS NULL)
      OR
      ("actual_start_minute" >= 0
        AND "actual_start_minute" < 1440
        AND "actual_end_minute" > "actual_start_minute"
        AND "actual_end_minute" <= 1440)
    ),
  ADD CONSTRAINT "training_day_activity_feedback_v2_ck"
    CHECK (
      "status" = 'completed'::"training_activity_status"
      OR ("intensity" IS NULL AND "energy" IS NULL)
    );

CREATE UNIQUE INDEX "training_day_activity_u2"
  ON "training_day_activity"("workspace_id", "assignment_id");
CREATE INDEX "training_day_activity_i3"
  ON "training_day_activity"("training_plan_version_id", "session_definition_id");
CREATE INDEX "training_day_activity_i4"
  ON "training_day_activity"("training_plan_version_id", "preparation_session_definition_id");

CREATE TABLE "training_activity_execution_interval" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL,
  "activity_id" UUID NOT NULL,
  "started_at" TIMESTAMPTZ(6) NOT NULL,
  "ended_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "training_activity_execution_interval_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "training_activity_execution_interval_time_ck"
    CHECK ("ended_at" IS NULL OR "ended_at" >= "started_at"),
  CONSTRAINT "training_activity_execution_interval_activity_fk"
    FOREIGN KEY ("workspace_id", "activity_id")
    REFERENCES "training_day_activity"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "training_activity_execution_interval_workspace_fk"
    FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
    ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "training_activity_execution_interval_u1"
  ON "training_activity_execution_interval"("workspace_id", "id");
CREATE INDEX "training_activity_execution_interval_i1"
  ON "training_activity_execution_interval"("workspace_id", "activity_id", "started_at");
CREATE UNIQUE INDEX "training_activity_execution_interval_open_u1"
  ON "training_activity_execution_interval"("workspace_id") WHERE "ended_at" IS NULL;

CREATE TABLE "training_activity_exercise_execution" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL,
  "activity_id" UUID NOT NULL,
  "training_plan_version_id" UUID NOT NULL,
  "session_definition_id" UUID NOT NULL,
  "exercise_definition_id" UUID NOT NULL,
  "role" "exercise_role" NOT NULL,
  "completed_at" TIMESTAMPTZ(6),
  "comment" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revision" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "training_activity_exercise_execution_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "training_activity_exercise_execution_comment_ck"
    CHECK ("comment" IS NULL OR char_length("comment") <= 1000),
  CONSTRAINT "training_activity_exercise_execution_activity_fk"
    FOREIGN KEY ("workspace_id", "activity_id")
    REFERENCES "training_day_activity"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "training_activity_exercise_execution_prescription_fk"
    FOREIGN KEY ("training_plan_version_id", "session_definition_id", "exercise_definition_id")
    REFERENCES "training_exercise_definition"("training_plan_version_id", "session_definition_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "training_activity_exercise_execution_workspace_fk"
    FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
    ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "training_activity_exercise_execution_u1"
  ON "training_activity_exercise_execution"("workspace_id", "activity_id", "exercise_definition_id", "role");
CREATE UNIQUE INDEX "training_activity_exercise_execution_u2"
  ON "training_activity_exercise_execution"("workspace_id", "id");
CREATE INDEX "training_activity_exercise_execution_i1"
  ON "training_activity_exercise_execution"("training_plan_version_id", "session_definition_id", "exercise_definition_id");

CREATE TABLE "training_activity_set_execution" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "workspace_id" UUID NOT NULL,
  "exercise_execution_id" UUID NOT NULL,
  "set_number" INTEGER NOT NULL,
  "value" INTEGER NOT NULL DEFAULT 0,
  "left_value" INTEGER,
  "right_value" INTEGER,
  "direction_values" JSONB,
  "load_kg" DECIMAL(10,3),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revision" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "training_activity_set_execution_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "training_activity_set_execution_values_ck"
    CHECK (
      "value" >= 0
      AND ("left_value" IS NULL OR "left_value" >= 0)
      AND ("right_value" IS NULL OR "right_value" >= 0)
      AND ("load_kg" IS NULL OR "load_kg" >= 0)
    ),
  CONSTRAINT "training_activity_set_execution_exercise_execution_fk"
    FOREIGN KEY ("workspace_id", "exercise_execution_id")
    REFERENCES "training_activity_exercise_execution"("workspace_id", "id")
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "training_activity_set_execution_workspace_fk"
    FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id")
    ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "training_activity_set_execution_u1"
  ON "training_activity_set_execution"("workspace_id", "exercise_execution_id", "set_number");
CREATE UNIQUE INDEX "training_activity_set_execution_u2"
  ON "training_activity_set_execution"("workspace_id", "id");

INSERT INTO "training_day_activity" (
  "workspace_id", "civil_date", "type", "source", "role", "name", "status",
  "planned_start_minute", "planned_end_minute", "started_at", "completed_at",
  "intensity", "energy", "comment", "assignment_id", "training_plan_version_id",
  "session_definition_id", "preparation_session_definition_id"
)
SELECT
  assignment."workspace_id",
  assignment."civil_date",
  CASE WHEN assignment."kind" = 'training'::"training_assignment_kind"
    THEN 'structured_training'::"training_activity_type"
    ELSE 'mobility'::"training_activity_type" END,
  'plan'::"training_activity_source",
  'primary'::"training_activity_role",
  session."name",
  CASE execution."status"
    WHEN 'in_progress'::"training_execution_status" THEN 'in_progress'::"training_activity_status"
    WHEN 'completed'::"training_execution_status" THEN 'completed'::"training_activity_status"
    WHEN 'skipped'::"training_execution_status" THEN 'skipped'::"training_activity_status"
    ELSE 'scheduled'::"training_activity_status" END,
  COALESCE(assignment."planned_start_minute", 540),
  COALESCE(assignment."planned_end_minute", 540 + session."target_duration_minutes"),
  execution."started_at",
  execution."completed_at",
  execution."intensity",
  execution."energy",
  execution."comment",
  assignment."id",
  assignment."training_plan_version_id",
  assignment."main_session_id",
  assignment."preparation_session_id"
FROM "daily_training_assignment" assignment
JOIN "training_session_definition" session ON session."id" = assignment."main_session_id"
LEFT JOIN "training_execution" execution ON execution."assignment_id" = assignment."id"
WHERE assignment."kind" IN ('training'::"training_assignment_kind", 'mobility'::"training_assignment_kind")
ON CONFLICT ("workspace_id", "assignment_id") DO NOTHING;

INSERT INTO "training_activity_execution_interval" (
  "workspace_id", "activity_id", "started_at", "ended_at"
)
SELECT activity."workspace_id", activity."id", execution."started_at", execution."completed_at"
FROM "training_execution" execution
JOIN "training_day_activity" activity ON activity."assignment_id" = execution."assignment_id"
WHERE execution."started_at" IS NOT NULL
  AND execution."status" <> 'skipped'::"training_execution_status";

INSERT INTO "training_activity_exercise_execution" (
  "id", "workspace_id", "activity_id", "training_plan_version_id",
  "session_definition_id", "exercise_definition_id", "role", "completed_at",
  "comment", "created_at", "updated_at", "revision"
)
SELECT
  exercise."id", exercise."workspace_id", activity."id", exercise."training_plan_version_id",
  exercise."session_definition_id", exercise."exercise_definition_id", exercise."role",
  CASE WHEN exercise."item_status" = 'completed'::"item_status" THEN exercise."updated_at" ELSE NULL END,
  exercise."comment", exercise."created_at", exercise."updated_at", exercise."revision"
FROM "training_exercise_execution" exercise
JOIN "training_execution" execution ON execution."id" = exercise."training_execution_id"
JOIN "training_day_activity" activity ON activity."assignment_id" = execution."assignment_id"
ON CONFLICT DO NOTHING;

INSERT INTO "training_activity_set_execution" (
  "id", "workspace_id", "exercise_execution_id", "set_number", "value",
  "left_value", "right_value", "direction_values", "load_kg", "created_at", "updated_at", "revision"
)
SELECT
  set_execution."id", set_execution."workspace_id", set_execution."exercise_execution_id",
  set_execution."set_number", COALESCE(set_execution."value", 0), set_execution."left_value",
  set_execution."right_value", set_execution."direction_values", set_execution."load_kg",
  set_execution."created_at", set_execution."updated_at", set_execution."revision"
FROM "training_set_execution" set_execution
WHERE EXISTS (
  SELECT 1 FROM "training_activity_exercise_execution" exercise
  WHERE exercise."id" = set_execution."exercise_execution_id"
)
ON CONFLICT DO NOTHING;
