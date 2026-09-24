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
        AND (
          ("training_plan_version_id" IS NULL AND "session_definition_id" IS NULL)
          OR
          ("training_plan_version_id" IS NOT NULL AND "session_definition_id" IS NOT NULL)
        ))
      OR
      ("type" IN ('sport_practice'::"training_activity_type", 'specific_training'::"training_activity_type")
        AND "training_plan_version_id" IS NULL
        AND "session_definition_id" IS NULL
        AND "preparation_session_definition_id" IS NULL)
    );
