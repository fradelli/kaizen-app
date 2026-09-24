ALTER TABLE "training_day_activity"
  DROP CONSTRAINT "training_day_activity_actual_time_ck",
  DROP CONSTRAINT "training_day_activity_completion_ck";

ALTER TABLE "training_day_activity"
  ADD CONSTRAINT "training_day_activity_execution_lifecycle_ck"
    CHECK (
      ("status" IN ('scheduled'::"training_activity_status", 'skipped'::"training_activity_status")
        AND "actual_start_minute" IS NULL
        AND "actual_end_minute" IS NULL)
      OR
      ("status" = 'in_progress'::"training_activity_status"
        AND "actual_start_minute" >= 0
        AND "actual_start_minute" < 1440
        AND "actual_end_minute" IS NULL)
      OR
      ("status" = 'completed'::"training_activity_status"
        AND "actual_start_minute" >= 0
        AND "actual_start_minute" < 1440
        AND "actual_end_minute" > "actual_start_minute"
        AND "actual_end_minute" <= 1440)
    ),
  ADD CONSTRAINT "training_day_activity_feedback_lifecycle_ck"
    CHECK (
      "status" = 'completed'::"training_activity_status"
      OR ("intensity" IS NULL AND "energy" IS NULL)
    );
