ALTER TABLE "daily_training_assignment"
  ADD COLUMN "planned_start_minute" INTEGER,
  ADD COLUMN "planned_end_minute" INTEGER;

ALTER TABLE "training_execution"
  ADD COLUMN "actual_start_minute" INTEGER,
  ADD COLUMN "actual_end_minute" INTEGER;

ALTER TABLE "daily_training_assignment"
  ADD CONSTRAINT "daily_training_assignment_planned_time_ck"
    CHECK (("kind" = 'rest'::"training_assignment_kind" AND "planned_start_minute" IS NULL AND "planned_end_minute" IS NULL) OR ("kind" <> 'rest'::"training_assignment_kind" AND (("planned_start_minute" IS NULL AND "planned_end_minute" IS NULL) OR ("planned_start_minute" >= 0 AND "planned_start_minute" < 1440 AND "planned_end_minute" > "planned_start_minute" AND "planned_end_minute" <= 1440))));

ALTER TABLE "training_execution"
  ADD CONSTRAINT "training_execution_actual_time_ck"
    CHECK (("actual_start_minute" IS NULL AND "actual_end_minute" IS NULL) OR ("actual_start_minute" >= 0 AND "actual_start_minute" < 1440 AND "actual_end_minute" > "actual_start_minute" AND "actual_end_minute" <= 1440));
