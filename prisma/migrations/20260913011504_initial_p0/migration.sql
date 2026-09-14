-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

BEGIN;

-- CreateEnum
CREATE TYPE "import_result" AS ENUM ('in_progress', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "plan_domain" AS ENUM ('training', 'nutrition');

-- CreateEnum
CREATE TYPE "logical_environment" AS ENUM ('local', 'preview', 'staging', 'production');

-- CreateEnum
CREATE TYPE "measurement_type" AS ENUM ('repetitions', 'seconds', 'contacts', 'per_side');

-- CreateEnum
CREATE TYPE "training_assignment_kind" AS ENUM ('training', 'mobility', 'rest', 'unassigned');

-- CreateEnum
CREATE TYPE "training_execution_status" AS ENUM ('not_started', 'in_progress', 'completed', 'followed_different', 'skipped');

-- CreateEnum
CREATE TYPE "item_status" AS ENUM ('pending', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "exercise_role" AS ENUM ('main', 'preparation', 'mobility');

-- CreateEnum
CREATE TYPE "meal_execution_status" AS ENUM ('pending', 'followed_plan', 'followed_different', 'skipped');

-- CreateTable
CREATE TABLE "workspace" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_batch" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_kind" TEXT NOT NULL,
    "source_path" TEXT NOT NULL,
    "source_sha256" CHAR(64) NOT NULL,
    "source_schema_version" TEXT NOT NULL,
    "application_commit" CHAR(40) NOT NULL,
    "source_document" JSONB NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "finished_at" TIMESTAMPTZ(6),
    "result" "import_result" NOT NULL,
    "error_code" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_activation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "domain" "plan_domain" NOT NULL,
    "logical_environment" "logical_environment" NOT NULL,
    "training_plan_version_id" UUID,
    "nutrition_plan_version_id" UUID,
    "pointer_import_batch_id" UUID NOT NULL,
    "activated_at" TIMESTAMPTZ(6) NOT NULL,
    "superseded_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_activation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pairing_rate_limit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "bucket_key" TEXT NOT NULL,
    "window_started_at" TIMESTAMPTZ(6) NOT NULL,
    "attempt_count" INTEGER NOT NULL,
    "blocked_until" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pairing_rate_limit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_definition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exercise_id" TEXT NOT NULL,
    "library_import_batch_id" UUID NOT NULL,
    "metadata_import_batch_id" UUID NOT NULL,
    "name_pt" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "measurement_type" "measurement_type" NOT NULL,
    "load_applicable" BOOLEAN NOT NULL,
    "load_unit" TEXT,
    "normalization_rule" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_plan_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plan_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "source_status" TEXT NOT NULL,
    "source_created_on" DATE NOT NULL,
    "source_updated_on" DATE NOT NULL,
    "import_batch_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_plan_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_session_definition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "training_plan_version_id" UUID NOT NULL,
    "session_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_duration_minutes" INTEGER NOT NULL,
    "short_duration_minutes" INTEGER,
    "intensity" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_session_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_exercise_definition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "training_plan_version_id" UUID NOT NULL,
    "session_definition_id" UUID NOT NULL,
    "exercise_definition_id" UUID NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "prescribed_text" TEXT NOT NULL,
    "rest_seconds" INTEGER,
    "priority" TEXT,
    "notes" TEXT,
    "normalized_dose" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_exercise_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_training_assignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "civil_date" DATE NOT NULL,
    "kind" "training_assignment_kind" NOT NULL,
    "training_plan_version_id" UUID,
    "main_session_id" UUID,
    "preparation_session_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_training_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_execution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "training_plan_version_id" UUID,
    "status" "training_execution_status" NOT NULL,
    "comment" TEXT,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "training_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_exercise_execution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "training_execution_id" UUID NOT NULL,
    "training_plan_version_id" UUID NOT NULL,
    "session_definition_id" UUID NOT NULL,
    "exercise_definition_id" UUID NOT NULL,
    "role" "exercise_role" NOT NULL,
    "item_status" "item_status" NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "training_exercise_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_set_execution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "exercise_execution_id" UUID NOT NULL,
    "set_number" INTEGER NOT NULL,
    "status" "item_status" NOT NULL,
    "value" INTEGER,
    "left_value" INTEGER,
    "right_value" INTEGER,
    "direction_values" JSONB,
    "load_kg" DECIMAL(10,3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "training_set_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_plan_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plan_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "lifecycle_status" TEXT NOT NULL,
    "professional_status" TEXT NOT NULL,
    "source_created_on" DATE NOT NULL,
    "source_updated_on" DATE NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_until" DATE,
    "timezone" TEXT NOT NULL,
    "import_batch_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_plan_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_day_type_definition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nutrition_plan_version_id" UUID NOT NULL,
    "day_type_id" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "energy_band_id" TEXT NOT NULL,
    "minimum_kcal" INTEGER NOT NULL,
    "maximum_kcal" INTEGER NOT NULL,
    "energy_band_status" TEXT NOT NULL,
    "minimum_modules" INTEGER NOT NULL,
    "maximum_modules" INTEGER NOT NULL,
    "meal_rule" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_day_type_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_definition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nutrition_plan_version_id" UUID NOT NULL,
    "meal_id" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "default_time" TIME(0),
    "required" BOOLEAN NOT NULL,
    "use_when" TEXT,
    "timing_rules" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_day_type_meal" (
    "nutrition_plan_version_id" UUID NOT NULL,
    "day_type_id" UUID NOT NULL,
    "meal_id" UUID NOT NULL,
    "ordinal" INTEGER NOT NULL,

    CONSTRAINT "nutrition_day_type_meal_pkey" PRIMARY KEY ("day_type_id","meal_id")
);

-- CreateTable
CREATE TABLE "meal_option_definition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nutrition_plan_version_id" UUID NOT NULL,
    "meal_definition_id" UUID NOT NULL,
    "option_id" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "use_when" TEXT,
    "follow_up_rule" TEXT,
    "items" JSONB,
    "unknowns" JSONB,
    "reference_option_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_option_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_nutrition_assignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "civil_date" DATE NOT NULL,
    "nutrition_plan_version_id" UUID NOT NULL,
    "day_type_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_nutrition_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_execution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "nutrition_plan_version_id" UUID NOT NULL,
    "meal_definition_id" UUID NOT NULL,
    "status" "meal_execution_status" NOT NULL,
    "option_definition_id" UUID,
    "alternative_description" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "meal_execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_batch_i1" ON "import_batch"("application_commit");

-- CreateIndex
CREATE UNIQUE INDEX "import_batch_u1" ON "import_batch"("source_path", "source_sha256");

-- CreateIndex
CREATE INDEX "plan_activation_i1" ON "plan_activation"("logical_environment", "domain", "activated_at");

-- CreateIndex
CREATE INDEX "plan_activation_i2" ON "plan_activation"("training_plan_version_id");

-- CreateIndex
CREATE INDEX "plan_activation_i3" ON "plan_activation"("nutrition_plan_version_id");

-- CreateIndex
CREATE INDEX "plan_activation_i4" ON "plan_activation"("pointer_import_batch_id");

-- CreateIndex
CREATE INDEX "pairing_rate_limit_i1" ON "pairing_rate_limit"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "pairing_rate_limit_u1" ON "pairing_rate_limit"("workspace_id", "bucket_key");

-- CreateIndex
CREATE UNIQUE INDEX "pairing_rate_limit_u2" ON "pairing_rate_limit"("workspace_id", "id");

-- CreateIndex
CREATE INDEX "exercise_definition_i1" ON "exercise_definition"("metadata_import_batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_definition_u1" ON "exercise_definition"("library_import_batch_id", "metadata_import_batch_id", "exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_plan_version_u1" ON "training_plan_version"("plan_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "training_plan_version_u2" ON "training_plan_version"("import_batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_session_definition_u1" ON "training_session_definition"("training_plan_version_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_session_definition_u2" ON "training_session_definition"("training_plan_version_id", "id");

-- CreateIndex
CREATE INDEX "training_exercise_definition_i1" ON "training_exercise_definition"("exercise_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_exercise_definition_u1" ON "training_exercise_definition"("session_definition_id", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "training_exercise_definition_u2" ON "training_exercise_definition"("training_plan_version_id", "session_definition_id", "id");

-- CreateIndex
CREATE INDEX "daily_training_assignment_i1" ON "daily_training_assignment"("training_plan_version_id", "main_session_id");

-- CreateIndex
CREATE INDEX "daily_training_assignment_i2" ON "daily_training_assignment"("training_plan_version_id", "preparation_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_training_assignment_u1" ON "daily_training_assignment"("workspace_id", "civil_date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_training_assignment_u2" ON "daily_training_assignment"("workspace_id", "id", "training_plan_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_training_assignment_u3" ON "daily_training_assignment"("workspace_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "training_execution_u1" ON "training_execution"("workspace_id", "assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_execution_u2" ON "training_execution"("workspace_id", "id", "training_plan_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_execution_u3" ON "training_execution"("workspace_id", "id");

-- CreateIndex
CREATE INDEX "training_exercise_execution_i1" ON "training_exercise_execution"("workspace_id", "training_execution_id", "training_plan_version_id");

-- CreateIndex
CREATE INDEX "training_exercise_execution_i2" ON "training_exercise_execution"("training_plan_version_id", "session_definition_id", "exercise_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_exercise_execution_u1" ON "training_exercise_execution"("workspace_id", "training_execution_id", "exercise_definition_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "training_exercise_execution_u2" ON "training_exercise_execution"("workspace_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "training_set_execution_u1" ON "training_set_execution"("workspace_id", "exercise_execution_id", "set_number");

-- CreateIndex
CREATE UNIQUE INDEX "training_set_execution_u2" ON "training_set_execution"("workspace_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_plan_version_u1" ON "nutrition_plan_version"("plan_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_plan_version_u2" ON "nutrition_plan_version"("import_batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_day_type_definition_u1" ON "nutrition_day_type_definition"("nutrition_plan_version_id", "day_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_day_type_definition_u2" ON "nutrition_day_type_definition"("nutrition_plan_version_id", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_day_type_definition_u3" ON "nutrition_day_type_definition"("nutrition_plan_version_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_definition_u1" ON "meal_definition"("nutrition_plan_version_id", "meal_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_definition_u2" ON "meal_definition"("nutrition_plan_version_id", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "meal_definition_u3" ON "meal_definition"("nutrition_plan_version_id", "id");

-- CreateIndex
CREATE INDEX "nutrition_day_type_meal_i1" ON "nutrition_day_type_meal"("meal_id");

-- CreateIndex
CREATE INDEX "nutrition_day_type_meal_i2" ON "nutrition_day_type_meal"("nutrition_plan_version_id", "day_type_id");

-- CreateIndex
CREATE INDEX "nutrition_day_type_meal_i3" ON "nutrition_day_type_meal"("nutrition_plan_version_id", "meal_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_day_type_meal_u1" ON "nutrition_day_type_meal"("day_type_id", "ordinal");

-- CreateIndex
CREATE INDEX "meal_option_definition_i1" ON "meal_option_definition"("nutrition_plan_version_id", "reference_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_option_definition_u1" ON "meal_option_definition"("meal_definition_id", "option_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_option_definition_u2" ON "meal_option_definition"("meal_definition_id", "ordinal");

-- CreateIndex
CREATE UNIQUE INDEX "meal_option_definition_u3" ON "meal_option_definition"("nutrition_plan_version_id", "meal_definition_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_option_definition_u4" ON "meal_option_definition"("nutrition_plan_version_id", "id");

-- CreateIndex
CREATE INDEX "daily_nutrition_assignment_i1" ON "daily_nutrition_assignment"("nutrition_plan_version_id", "day_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_nutrition_assignment_u1" ON "daily_nutrition_assignment"("workspace_id", "civil_date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_nutrition_assignment_u2" ON "daily_nutrition_assignment"("workspace_id", "id", "nutrition_plan_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_nutrition_assignment_u3" ON "daily_nutrition_assignment"("workspace_id", "id");

-- CreateIndex
CREATE INDEX "meal_execution_i1" ON "meal_execution"("workspace_id", "assignment_id", "nutrition_plan_version_id");

-- CreateIndex
CREATE INDEX "meal_execution_i2" ON "meal_execution"("nutrition_plan_version_id", "meal_definition_id");

-- CreateIndex
CREATE INDEX "meal_execution_i3" ON "meal_execution"("nutrition_plan_version_id", "meal_definition_id", "option_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_execution_u1" ON "meal_execution"("workspace_id", "assignment_id", "meal_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_execution_u2" ON "meal_execution"("workspace_id", "id");

-- AddForeignKey
ALTER TABLE "plan_activation" ADD CONSTRAINT "plan_activation_training_plan_fk" FOREIGN KEY ("training_plan_version_id") REFERENCES "training_plan_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "plan_activation" ADD CONSTRAINT "plan_activation_nutrition_plan_fk" FOREIGN KEY ("nutrition_plan_version_id") REFERENCES "nutrition_plan_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "plan_activation" ADD CONSTRAINT "plan_activation_pointer_batch_fk" FOREIGN KEY ("pointer_import_batch_id") REFERENCES "import_batch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "pairing_rate_limit" ADD CONSTRAINT "pairing_rate_limit_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "exercise_definition" ADD CONSTRAINT "exercise_definition_library_batch_fk" FOREIGN KEY ("library_import_batch_id") REFERENCES "import_batch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "exercise_definition" ADD CONSTRAINT "exercise_definition_metadata_batch_fk" FOREIGN KEY ("metadata_import_batch_id") REFERENCES "import_batch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_plan_version" ADD CONSTRAINT "training_plan_version_import_batch_fk" FOREIGN KEY ("import_batch_id") REFERENCES "import_batch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_session_definition" ADD CONSTRAINT "training_session_definition_plan_fk" FOREIGN KEY ("training_plan_version_id") REFERENCES "training_plan_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_exercise_definition" ADD CONSTRAINT "training_exercise_definition_session_fk" FOREIGN KEY ("training_plan_version_id", "session_definition_id") REFERENCES "training_session_definition"("training_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_exercise_definition" ADD CONSTRAINT "training_exercise_definition_exercise_fk" FOREIGN KEY ("exercise_definition_id") REFERENCES "exercise_definition"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_plan_fk" FOREIGN KEY ("training_plan_version_id") REFERENCES "training_plan_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_main_session_fk" FOREIGN KEY ("training_plan_version_id", "main_session_id") REFERENCES "training_session_definition"("training_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_preparation_session_fk" FOREIGN KEY ("training_plan_version_id", "preparation_session_id") REFERENCES "training_session_definition"("training_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_assignment_fk" FOREIGN KEY ("workspace_id", "assignment_id") REFERENCES "daily_training_assignment"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_assignment_version_fk" FOREIGN KEY ("workspace_id", "assignment_id", "training_plan_version_id") REFERENCES "daily_training_assignment"("workspace_id", "id", "training_plan_version_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_exercise_execution" ADD CONSTRAINT "training_exercise_execution_execution_fk" FOREIGN KEY ("workspace_id", "training_execution_id", "training_plan_version_id") REFERENCES "training_execution"("workspace_id", "id", "training_plan_version_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_exercise_execution" ADD CONSTRAINT "training_exercise_execution_prescription_fk" FOREIGN KEY ("training_plan_version_id", "session_definition_id", "exercise_definition_id") REFERENCES "training_exercise_definition"("training_plan_version_id", "session_definition_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_exercise_execution" ADD CONSTRAINT "training_exercise_execution_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_set_execution" ADD CONSTRAINT "training_set_execution_exercise_execution_fk" FOREIGN KEY ("workspace_id", "exercise_execution_id") REFERENCES "training_exercise_execution"("workspace_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "training_set_execution" ADD CONSTRAINT "training_set_execution_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "nutrition_plan_version" ADD CONSTRAINT "nutrition_plan_version_import_batch_fk" FOREIGN KEY ("import_batch_id") REFERENCES "import_batch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "nutrition_day_type_definition" ADD CONSTRAINT "nutrition_day_type_definition_plan_fk" FOREIGN KEY ("nutrition_plan_version_id") REFERENCES "nutrition_plan_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_definition" ADD CONSTRAINT "meal_definition_plan_fk" FOREIGN KEY ("nutrition_plan_version_id") REFERENCES "nutrition_plan_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "nutrition_day_type_meal" ADD CONSTRAINT "nutrition_day_type_meal_day_type_fk" FOREIGN KEY ("nutrition_plan_version_id", "day_type_id") REFERENCES "nutrition_day_type_definition"("nutrition_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "nutrition_day_type_meal" ADD CONSTRAINT "nutrition_day_type_meal_meal_fk" FOREIGN KEY ("nutrition_plan_version_id", "meal_id") REFERENCES "meal_definition"("nutrition_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_option_definition" ADD CONSTRAINT "meal_option_definition_meal_fk" FOREIGN KEY ("nutrition_plan_version_id", "meal_definition_id") REFERENCES "meal_definition"("nutrition_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_option_definition" ADD CONSTRAINT "meal_option_definition_reference_fk" FOREIGN KEY ("nutrition_plan_version_id", "reference_option_id") REFERENCES "meal_option_definition"("nutrition_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "daily_nutrition_assignment" ADD CONSTRAINT "daily_nutrition_assignment_day_type_fk" FOREIGN KEY ("nutrition_plan_version_id", "day_type_id") REFERENCES "nutrition_day_type_definition"("nutrition_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "daily_nutrition_assignment" ADD CONSTRAINT "daily_nutrition_assignment_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_assignment_fk" FOREIGN KEY ("workspace_id", "assignment_id", "nutrition_plan_version_id") REFERENCES "daily_nutrition_assignment"("workspace_id", "id", "nutrition_plan_version_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_meal_fk" FOREIGN KEY ("nutrition_plan_version_id", "meal_definition_id") REFERENCES "meal_definition"("nutrition_plan_version_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_option_fk" FOREIGN KEY ("nutrition_plan_version_id", "meal_definition_id", "option_definition_id") REFERENCES "meal_option_definition"("nutrition_plan_version_id", "meal_definition_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Integridade complementar do P0: PostgreSQL é a autoridade das relações.
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_c1" CHECK ((source_sha256 ~ '^[0-9a-f]{64}$' AND application_commit ~ '^[0-9a-f]{40}$') IS TRUE);
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_c2" CHECK ((source_kind IN ('exercise_library','execution_metadata','training_plan','nutrition_plan','training_pointer','nutrition_pointer')) IS TRUE);
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_c3" CHECK ((source_path ~ '^data/[a-zA-Z0-9_./-]+\.json$' AND source_path !~ '(^|/)\.{1,2}(/|$)' AND source_path NOT LIKE '%//%') IS TRUE);
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_c4" CHECK ((finished_at IS NULL OR finished_at >= started_at) IS TRUE);
ALTER TABLE "import_batch" ADD CONSTRAINT "import_batch_c5" CHECK (((result = 'in_progress' AND finished_at IS NULL AND error_code IS NULL) OR (result = 'completed' AND finished_at IS NOT NULL AND error_code IS NULL) OR (result = 'failed' AND finished_at IS NOT NULL AND error_code IS NOT NULL AND error_code ~ '^[A-Z][A-Z0-9_]{0,63}$')) IS TRUE);
ALTER TABLE "plan_activation" ADD CONSTRAINT "plan_activation_c1" CHECK (((domain = 'training' AND training_plan_version_id IS NOT NULL AND nutrition_plan_version_id IS NULL) OR (domain = 'nutrition' AND nutrition_plan_version_id IS NOT NULL AND training_plan_version_id IS NULL)) IS TRUE);
ALTER TABLE "plan_activation" ADD CONSTRAINT "plan_activation_c2" CHECK ((superseded_at IS NULL OR superseded_at >= activated_at) IS TRUE);
ALTER TABLE "pairing_rate_limit" ADD CONSTRAINT "pairing_rate_limit_c1" CHECK ((attempt_count >= 0 AND expires_at > window_started_at AND (blocked_until IS NULL OR blocked_until >= window_started_at)) IS TRUE);
ALTER TABLE "pairing_rate_limit" ADD CONSTRAINT "pairing_rate_limit_c2" CHECK ((bucket_key = 'global' OR bucket_key ~ '^origin:[0-9a-f]{64}$') IS TRUE);
ALTER TABLE "pairing_rate_limit" ADD CONSTRAINT "pairing_rate_limit_c3" CHECK ((revision >= 0) IS TRUE);
ALTER TABLE "exercise_definition" ADD CONSTRAINT "exercise_definition_c1" CHECK (((load_applicable AND load_unit IS NOT NULL AND load_unit = 'kg') OR (NOT load_applicable AND load_unit IS NULL)) IS TRUE);
ALTER TABLE "exercise_definition" ADD CONSTRAINT "exercise_definition_c2" CHECK ((jsonb_typeof(definition) = 'object' AND jsonb_typeof(normalization_rule) = 'object' AND jsonb_typeof(normalization_rule->'prescriptions') = 'array') IS TRUE);
ALTER TABLE "training_plan_version" ADD CONSTRAINT "training_plan_version_c1" CHECK ((source_updated_on >= source_created_on) IS TRUE);
ALTER TABLE "training_session_definition" ADD CONSTRAINT "training_session_definition_c1" CHECK ((target_duration_minutes > 0 AND (short_duration_minutes IS NULL OR short_duration_minutes > 0)) IS TRUE);
ALTER TABLE "training_exercise_definition" ADD CONSTRAINT "training_exercise_definition_c1" CHECK ((ordinal > 0 AND sets > 0 AND (rest_seconds IS NULL OR rest_seconds >= 0)) IS TRUE);
ALTER TABLE "training_exercise_definition" ADD CONSTRAINT "training_exercise_definition_c2" CHECK ((jsonb_typeof(normalized_dose) = 'object') IS TRUE);
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_c1" CHECK ((((kind IN ('training','mobility') AND training_plan_version_id IS NOT NULL AND main_session_id IS NOT NULL) OR (kind IN ('rest','unassigned') AND training_plan_version_id IS NULL AND main_session_id IS NULL AND preparation_session_id IS NULL)) AND (preparation_session_id IS NULL OR (kind = 'training' AND preparation_session_id <> main_session_id))) IS TRUE);
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_c2" CHECK ((reason IS NULL OR char_length(reason) <= 1000) IS TRUE);
ALTER TABLE "daily_training_assignment" ADD CONSTRAINT "daily_training_assignment_c3" CHECK ((revision >= 0) IS TRUE);
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_c1" CHECK ((comment IS NULL OR char_length(comment) <= 1000) IS TRUE);
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_c2" CHECK ((status <> 'followed_different' OR (comment IS NOT NULL AND char_length(btrim(comment)) > 0)) IS TRUE);
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_c3" CHECK ((started_at IS NULL OR completed_at IS NULL OR completed_at >= started_at) IS TRUE);
ALTER TABLE "training_execution" ADD CONSTRAINT "training_execution_c4" CHECK ((revision >= 0) IS TRUE);
ALTER TABLE "training_exercise_execution" ADD CONSTRAINT "training_exercise_execution_c1" CHECK ((comment IS NULL OR char_length(comment) <= 1000) IS TRUE);
ALTER TABLE "training_exercise_execution" ADD CONSTRAINT "training_exercise_execution_c2" CHECK ((role <> 'main' OR item_status = 'pending') IS TRUE);
ALTER TABLE "training_exercise_execution" ADD CONSTRAINT "training_exercise_execution_c3" CHECK ((revision >= 0) IS TRUE);
ALTER TABLE "training_set_execution" ADD CONSTRAINT "training_set_execution_c1" CHECK ((set_number > 0 AND (value IS NULL OR value >= 0) AND (left_value IS NULL OR left_value >= 0) AND (right_value IS NULL OR right_value >= 0)) IS TRUE);
ALTER TABLE "training_set_execution" ADD CONSTRAINT "training_set_execution_c2" CHECK ((load_kg IS NULL OR (load_kg >= 0 AND load_kg < 'Infinity'::numeric)) IS TRUE);
ALTER TABLE "training_set_execution" ADD CONSTRAINT "training_set_execution_c3" CHECK ((status = 'completed' OR (value IS NULL AND left_value IS NULL AND right_value IS NULL AND direction_values IS NULL AND load_kg IS NULL)) IS TRUE);
ALTER TABLE "training_set_execution" ADD CONSTRAINT "training_set_execution_c4" CHECK ((revision >= 0) IS TRUE);
ALTER TABLE "nutrition_plan_version" ADD CONSTRAINT "nutrition_plan_version_c1" CHECK ((effective_until IS NULL OR effective_until >= effective_from) IS TRUE);
ALTER TABLE "nutrition_plan_version" ADD CONSTRAINT "nutrition_plan_version_c2" CHECK ((source_updated_on >= source_created_on) IS TRUE);
ALTER TABLE "nutrition_plan_version" ADD CONSTRAINT "nutrition_plan_version_c3" CHECK ((timezone = 'America/Sao_Paulo') IS TRUE);
ALTER TABLE "nutrition_day_type_definition" ADD CONSTRAINT "nutrition_day_type_definition_c1" CHECK ((ordinal > 0 AND minimum_kcal >= 0 AND maximum_kcal >= minimum_kcal AND minimum_modules >= 0 AND maximum_modules >= minimum_modules) IS TRUE);
ALTER TABLE "meal_definition" ADD CONSTRAINT "meal_definition_c1" CHECK ((ordinal > 0) IS TRUE);
ALTER TABLE "nutrition_day_type_meal" ADD CONSTRAINT "nutrition_day_type_meal_c1" CHECK ((ordinal > 0) IS TRUE);
ALTER TABLE "meal_option_definition" ADD CONSTRAINT "meal_option_definition_c1" CHECK ((ordinal > 0 AND ((items IS NOT NULL AND reference_option_id IS NULL) OR (items IS NULL AND reference_option_id IS NOT NULL)) AND (reference_option_id IS NULL OR reference_option_id <> id)) IS TRUE);
ALTER TABLE "meal_option_definition" ADD CONSTRAINT "meal_option_definition_c2" CHECK ((items IS NULL OR jsonb_typeof(items) = 'array') IS TRUE);
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_c1" CHECK ((comment IS NULL OR char_length(comment) <= 1000) IS TRUE);
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_c2" CHECK (((status IN ('pending','skipped') AND option_definition_id IS NULL AND alternative_description IS NULL) OR (status = 'followed_plan' AND option_definition_id IS NOT NULL AND alternative_description IS NULL) OR (status = 'followed_different' AND option_definition_id IS NULL AND alternative_description IS NOT NULL AND char_length(btrim(alternative_description)) > 0 AND char_length(alternative_description) <= 500)) IS TRUE);
ALTER TABLE "meal_execution" ADD CONSTRAINT "meal_execution_c3" CHECK ((revision >= 0) IS TRUE);
ALTER TABLE "daily_nutrition_assignment" ADD CONSTRAINT "daily_nutrition_assignment_c1" CHECK ((revision >= 0) IS TRUE);

CREATE UNIQUE INDEX plan_activation_current_unique
  ON plan_activation (logical_environment, domain) WHERE superseded_at IS NULL;

CREATE FUNCTION reject_history_delete() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'HISTORY_DELETE_FORBIDDEN';
END;
$$;

CREATE FUNCTION reject_definition_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'DEFINITION_IMMUTABLE';
END;
$$;

CREATE FUNCTION protect_import_batch() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.result = 'completed' THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'IMPORT_BATCH_IMMUTABLE';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION protect_activation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE expected_kind text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (to_jsonb(NEW) - 'superseded_at') IS DISTINCT FROM (to_jsonb(OLD) - 'superseded_at')
       OR OLD.superseded_at IS NOT NULL OR NEW.superseded_at IS NULL THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'ACTIVATION_IMMUTABLE';
    END IF;
  END IF;
  expected_kind := NEW.domain::text || '_pointer';
  IF NOT EXISTS (SELECT 1 FROM import_batch WHERE id = NEW.pointer_import_batch_id AND source_kind = expected_kind) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'ACTIVATION_POINTER_KIND_INVALID';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION validate_prescription() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE rule jsonb;
BEGIN
  SELECT normalization_rule INTO rule FROM exercise_definition WHERE id = NEW.exercise_definition_id;
  IF rule IS NULL OR jsonb_typeof(rule->'prescriptions') IS DISTINCT FROM 'array'
     OR NOT EXISTS (
       SELECT 1 FROM jsonb_array_elements(rule->'prescriptions') dose
       WHERE dose->>'source_text' = NEW.prescribed_text AND dose = NEW.normalized_dose
     ) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'PRESCRIPTION_NOT_REVIEWED';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION protect_training_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.training_plan_version_id,NEW.main_session_id,NEW.preparation_session_id,NEW.kind)
       IS DISTINCT FROM ROW(OLD.training_plan_version_id,OLD.main_session_id,OLD.preparation_session_id,OLD.kind)
     AND EXISTS (SELECT 1 FROM training_execution WHERE workspace_id=OLD.workspace_id AND assignment_id=OLD.id) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'ASSIGNMENT_BINDING_FROZEN';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION validate_training_execution() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE assigned_version uuid;
BEGIN
  SELECT training_plan_version_id INTO assigned_version FROM daily_training_assignment
    WHERE workspace_id=NEW.workspace_id AND id=NEW.assignment_id FOR UPDATE;
  IF NOT FOUND OR assigned_version IS DISTINCT FROM NEW.training_plan_version_id THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'TRAINING_EXECUTION_BINDING_INVALID';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION validate_exercise_execution() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE assignment daily_training_assignment%ROWTYPE;
BEGIN
  SELECT a.* INTO assignment FROM daily_training_assignment a
    JOIN training_execution e ON e.workspace_id=a.workspace_id AND e.assignment_id=a.id
    WHERE e.workspace_id=NEW.workspace_id AND e.id=NEW.training_execution_id;
  IF NOT FOUND OR NOT (
    (NEW.role='main' AND assignment.kind='training' AND NEW.session_definition_id=assignment.main_session_id)
    OR (NEW.role='preparation' AND assignment.kind='training' AND NEW.session_definition_id=assignment.preparation_session_id)
    OR (NEW.role='mobility' AND assignment.kind='mobility' AND NEW.session_definition_id=assignment.main_session_id)
  ) IS TRUE THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'EXERCISE_EXECUTION_BINDING_INVALID';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION valid_direction_values(document jsonb, expected_keys text[]) RETURNS boolean
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE entry record; key_count integer := 0; amount numeric;
BEGIN
  IF document IS NULL OR jsonb_typeof(document) <> 'object' THEN RETURN false; END IF;
  FOR entry IN SELECT * FROM jsonb_each(document) LOOP
    key_count := key_count + 1;
    IF NOT entry.key = ANY(expected_keys) OR jsonb_typeof(entry.value) <> 'number' THEN RETURN false; END IF;
    amount := entry.value::text::numeric;
    IF amount < 0 OR amount <> trunc(amount) OR amount > 2147483647 THEN RETURN false; END IF;
  END LOOP;
  RETURN key_count = cardinality(expected_keys);
END;
$$;

CREATE FUNCTION validate_set_execution() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE prescribed_sets integer; execution_role exercise_role; dose_scope text; permits_load boolean; shape_valid boolean;
BEGIN
  SELECT d.sets,e.role,d.normalized_dose->>'scope',x.load_applicable
    INTO prescribed_sets,execution_role,dose_scope,permits_load
    FROM training_exercise_execution e
    JOIN training_exercise_definition d ON d.id=e.exercise_definition_id
    JOIN exercise_definition x ON x.id=d.exercise_definition_id
    WHERE e.workspace_id=NEW.workspace_id AND e.id=NEW.exercise_execution_id;
  IF NOT FOUND OR execution_role <> 'main' OR NEW.set_number > prescribed_sets
     OR (NEW.load_kg IS NOT NULL AND NOT permits_load) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'SET_EXECUTION_BINDING_INVALID';
  END IF;
  IF NEW.status='completed' THEN
    shape_valid := CASE dose_scope
      WHEN 'total' THEN NEW.value IS NOT NULL AND NEW.left_value IS NULL AND NEW.right_value IS NULL AND NEW.direction_values IS NULL
      WHEN 'each_side' THEN NEW.value IS NULL AND NEW.left_value IS NOT NULL AND NEW.right_value IS NOT NULL AND NEW.direction_values IS NULL
      WHEN 'two_directions' THEN NEW.value IS NULL AND NEW.left_value IS NULL AND NEW.right_value IS NULL AND valid_direction_values(NEW.direction_values,ARRAY['forward','backward'])
      WHEN 'four_directions' THEN NEW.value IS NULL AND NEW.left_value IS NULL AND NEW.right_value IS NULL AND valid_direction_values(NEW.direction_values,ARRAY['flexion','extension','left','right'])
      ELSE false END;
    IF NOT shape_valid IS TRUE THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'SET_MEASUREMENT_INVALID';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION validate_option_reference() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reference_option_id IS NOT NULL AND EXISTS (
    WITH RECURSIVE chain AS (
      SELECT id, reference_option_id FROM meal_option_definition WHERE id=NEW.reference_option_id
      UNION
      SELECT o.id,o.reference_option_id FROM meal_option_definition o JOIN chain c ON o.id=c.reference_option_id
    ) SELECT 1 FROM chain WHERE id=NEW.id OR reference_option_id=NEW.id
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'OPTION_REFERENCE_CYCLE';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION protect_nutrition_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.nutrition_plan_version_id,NEW.day_type_id)
       IS DISTINCT FROM ROW(OLD.nutrition_plan_version_id,OLD.day_type_id)
     AND EXISTS (SELECT 1 FROM meal_execution WHERE workspace_id=OLD.workspace_id AND assignment_id=OLD.id) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'ASSIGNMENT_BINDING_FROZEN';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION validate_meal_execution() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE assigned_day_type uuid;
BEGIN
  SELECT day_type_id INTO assigned_day_type FROM daily_nutrition_assignment
    WHERE workspace_id=NEW.workspace_id AND id=NEW.assignment_id
      AND nutrition_plan_version_id=NEW.nutrition_plan_version_id FOR UPDATE;
  IF NOT FOUND OR NOT EXISTS (
    SELECT 1 FROM nutrition_day_type_meal WHERE nutrition_plan_version_id=NEW.nutrition_plan_version_id
      AND day_type_id=assigned_day_type AND meal_id=NEW.meal_definition_id
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'MEAL_DAY_TYPE_BINDING_INVALID';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION protect_operational_identity() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE column_name text;
BEGIN
  FOREACH column_name IN ARRAY TG_ARGV LOOP
    IF to_jsonb(NEW)->column_name IS DISTINCT FROM to_jsonb(OLD)->column_name THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'OPERATIONAL_IDENTITY_IMMUTABLE';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
CREATE TRIGGER history_delete BEFORE DELETE ON workspace FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON import_batch FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON plan_activation FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON exercise_definition FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON training_plan_version FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON training_session_definition FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON training_exercise_definition FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON daily_training_assignment FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON training_execution FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON training_exercise_execution FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON training_set_execution FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON nutrition_plan_version FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON nutrition_day_type_definition FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON meal_definition FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON nutrition_day_type_meal FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON meal_option_definition FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON daily_nutrition_assignment FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER history_delete BEFORE DELETE ON meal_execution FOR EACH ROW EXECUTE FUNCTION reject_history_delete();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON exercise_definition FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON training_plan_version FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON training_session_definition FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON training_exercise_definition FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON nutrition_plan_version FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON nutrition_day_type_definition FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON meal_definition FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON meal_option_definition FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER definition_immutable BEFORE UPDATE ON nutrition_day_type_meal FOR EACH ROW EXECUTE FUNCTION reject_definition_change();
CREATE TRIGGER protect_import_batch BEFORE UPDATE ON import_batch FOR EACH ROW EXECUTE FUNCTION protect_import_batch();
CREATE TRIGGER protect_activation BEFORE INSERT OR UPDATE ON plan_activation FOR EACH ROW EXECUTE FUNCTION protect_activation();
CREATE TRIGGER validate_prescription BEFORE INSERT ON training_exercise_definition FOR EACH ROW EXECUTE FUNCTION validate_prescription();
CREATE TRIGGER protect_training_assignment BEFORE UPDATE ON daily_training_assignment FOR EACH ROW EXECUTE FUNCTION protect_training_assignment();
CREATE TRIGGER validate_training_execution BEFORE INSERT OR UPDATE ON training_execution FOR EACH ROW EXECUTE FUNCTION validate_training_execution();
CREATE TRIGGER validate_exercise_execution BEFORE INSERT OR UPDATE ON training_exercise_execution FOR EACH ROW EXECUTE FUNCTION validate_exercise_execution();
CREATE TRIGGER validate_set_execution BEFORE INSERT OR UPDATE ON training_set_execution FOR EACH ROW EXECUTE FUNCTION validate_set_execution();
CREATE TRIGGER validate_option_reference BEFORE INSERT ON meal_option_definition FOR EACH ROW EXECUTE FUNCTION validate_option_reference();
CREATE TRIGGER protect_nutrition_assignment BEFORE UPDATE ON daily_nutrition_assignment FOR EACH ROW EXECUTE FUNCTION protect_nutrition_assignment();
CREATE TRIGGER validate_meal_execution BEFORE INSERT OR UPDATE ON meal_execution FOR EACH ROW EXECUTE FUNCTION validate_meal_execution();
CREATE TRIGGER operational_identity BEFORE UPDATE ON pairing_rate_limit FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','bucket_key');
CREATE TRIGGER operational_identity BEFORE UPDATE ON daily_training_assignment FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','civil_date');
CREATE TRIGGER operational_identity BEFORE UPDATE ON training_execution FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','assignment_id','training_plan_version_id');
CREATE TRIGGER operational_identity BEFORE UPDATE ON training_exercise_execution FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','training_execution_id','training_plan_version_id','session_definition_id','exercise_definition_id','role');
CREATE TRIGGER operational_identity BEFORE UPDATE ON training_set_execution FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','exercise_execution_id','set_number');
CREATE TRIGGER operational_identity BEFORE UPDATE ON daily_nutrition_assignment FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','civil_date');
CREATE TRIGGER operational_identity BEFORE UPDATE ON meal_execution FOR EACH ROW EXECUTE FUNCTION protect_operational_identity('id','workspace_id','created_at','assignment_id','nutrition_plan_version_id','meal_definition_id');

COMMIT;
