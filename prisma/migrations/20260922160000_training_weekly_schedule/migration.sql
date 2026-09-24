ALTER TABLE "training_plan_version"
  ADD COLUMN "weekly_schedule" JSONB,
  ADD COLUMN "weekly_schedule_sha256" CHAR(64);

ALTER TABLE "training_day_activity"
  ALTER COLUMN "planned_start_minute" DROP NOT NULL,
  ALTER COLUMN "planned_end_minute" DROP NOT NULL,
  DROP CONSTRAINT "training_day_activity_planned_time_ck";

ALTER TABLE "training_day_activity"
  ADD CONSTRAINT "training_day_activity_planned_time_ck"
    CHECK (
      ("planned_start_minute" IS NULL OR
        ("planned_start_minute" >= 0 AND "planned_start_minute" < 1440))
      AND ("planned_end_minute" IS NULL OR
        ("planned_end_minute" > 0 AND "planned_end_minute" <= 1440))
      AND ("planned_start_minute" IS NULL OR "planned_end_minute" IS NULL OR
        "planned_end_minute" > "planned_start_minute")
    );

ALTER TABLE "training_day_activity"
  DROP CONSTRAINT "training_day_activity_definition_ck";

ALTER TABLE "training_day_activity"
  ADD CONSTRAINT "training_day_activity_definition_ck"
    CHECK (
      ("type" = 'structured_training'::"training_activity_type"
        AND "training_plan_version_id" IS NOT NULL
        AND "session_definition_id" IS NOT NULL)
      OR
      ("type" = 'mobility'::"training_activity_type"
        AND "preparation_session_definition_id" IS NULL
        AND ("training_plan_version_id" IS NOT NULL OR "session_definition_id" IS NULL))
      OR
      ("type" IN ('sport_practice'::"training_activity_type", 'specific_training'::"training_activity_type")
        AND "session_definition_id" IS NULL
        AND "preparation_session_definition_id" IS NULL)
    );
