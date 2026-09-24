ALTER TABLE "import_batch"
  DROP CONSTRAINT "import_batch_c2";

ALTER TABLE "import_batch"
  ADD CONSTRAINT "import_batch_c2"
    CHECK ((source_kind IN (
      'exercise_library',
      'execution_metadata',
      'training_schedule',
      'training_plan',
      'nutrition_plan',
      'training_pointer',
      'nutrition_pointer'
    )) IS TRUE);

-- Existing imported plan versions predate the weekly schedule. Permit exactly
-- one attachment of that definition without opening other immutable fields.
CREATE FUNCTION protect_training_plan_schedule_backfill() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.weekly_schedule IS NULL
    AND OLD.weekly_schedule_sha256 IS NULL
    AND NEW.weekly_schedule IS NOT NULL
    AND NEW.weekly_schedule_sha256 IS NOT NULL
    AND (to_jsonb(NEW) - 'weekly_schedule' - 'weekly_schedule_sha256')
      = (to_jsonb(OLD) - 'weekly_schedule' - 'weekly_schedule_sha256')
  THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'DEFINITION_IMMUTABLE';
END;
$$;

DROP TRIGGER "definition_immutable" ON "training_plan_version";
CREATE TRIGGER "definition_immutable"
  BEFORE UPDATE ON "training_plan_version"
  FOR EACH ROW EXECUTE FUNCTION protect_training_plan_schedule_backfill();
