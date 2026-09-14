import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { PlanDefinitionSource, JsonValue } from "../domain/plan-definition-import.types";
import type { NutritionPlan, TrainingPlan } from "../domain/plan-definition-source.types";
export function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
export function toCivilDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}
export function mapTrainingPlanVersion(
  source: PlanDefinitionSource,
  batchId: string,
): Prisma.TrainingPlanVersionUncheckedCreateInput {
  const plan = source.document as unknown as TrainingPlan;
  return {
    planId: plan.plan_id,
    version: plan.version,
    sourceStatus: plan.status,
    sourceCreatedOn: toCivilDate(plan.created_at),
    sourceUpdatedOn: toCivilDate(plan.last_updated),
    importBatchId: batchId,
  };
}
export function mapNutritionPlanVersion(
  source: PlanDefinitionSource,
  batchId: string,
): Prisma.NutritionPlanVersionUncheckedCreateInput {
  const plan = source.document as unknown as NutritionPlan;
  return {
    planId: plan.plan_id,
    version: plan.version,
    lifecycleStatus: plan.lifecycle_status,
    professionalStatus: plan.professional_status,
    sourceCreatedOn: toCivilDate(plan.created_at),
    sourceUpdatedOn: toCivilDate(plan.last_updated),
    effectiveFrom: toCivilDate(plan.effective_from),
    effectiveUntil: plan.effective_until ? toCivilDate(plan.effective_until) : null,
    timezone: plan.timezone,
    importBatchId: batchId,
  };
}
export function toMealTime(value: string | null): Date | null {
  return value ? new Date(`1970-01-01T${value}:00.000Z`) : null;
}
export function toPrismaDoseJson(value: {
  source_text: string;
  minimum: number;
  maximum: number;
  unit: string;
  scope: string;
  qualifier: string | null;
}): Prisma.InputJsonValue {
  return toPrismaJson(value as unknown as JsonValue);
}
