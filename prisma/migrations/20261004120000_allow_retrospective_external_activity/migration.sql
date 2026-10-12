-- A conclusão retrospectiva usa created_at/updated_at para auditoria.
-- Nenhum horário de prática é inferido a partir do instante do registro.
-- Rollback da aplicação: manter esta constraint e os registros retrospectivos.
-- Não restaurar a constraint antiga nem fabricar horários; corrigir adiante
-- com nova migration, preservando os registros e as migrations aplicadas.
ALTER TABLE "training_day_activity"
  DROP CONSTRAINT "training_day_activity_timestamps_ck",
  ADD CONSTRAINT "training_day_activity_timestamps_ck" CHECK (
    ("status" = 'scheduled'::"training_activity_status"
      AND "started_at" IS NULL AND "completed_at" IS NULL)
    OR
    ("status" IN ('in_progress'::"training_activity_status", 'paused'::"training_activity_status")
      AND "started_at" IS NOT NULL AND "completed_at" IS NULL)
    OR
    ("status" = 'completed'::"training_activity_status" AND (
      ("started_at" IS NOT NULL AND "completed_at" IS NOT NULL
        AND "completed_at" >= "started_at")
      OR
      ("type" IN ('sport_practice'::"training_activity_type", 'specific_training'::"training_activity_type")
        AND "role" = 'primary'::"training_activity_role"
        AND "started_at" IS NULL AND "completed_at" IS NULL
        AND "actual_start_minute" IS NULL AND "actual_end_minute" IS NULL)
    ))
    OR
    ("status" = 'skipped'::"training_activity_status")
  );
