import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type {
  PlanDefinitionDocumentByKind,
  PlanDefinitionSource,
} from "../domain/plan-definition-import.types";
import type { Dose } from "../domain/plan-definition-source.types";
export function toPrismaJson(
  value: PlanDefinitionDocumentByKind[keyof PlanDefinitionDocumentByKind] | object,
): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
export function toCivilDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}
export function mapTrainingPlanVersion(
  source: PlanDefinitionSource<"training_plan">,
  batchId: string,
): Prisma.TrainingPlanVersionUncheckedCreateInput {
  const plan = source.document;
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
  source: PlanDefinitionSource<"nutrition_plan">,
  batchId: string,
): Prisma.NutritionPlanVersionUncheckedCreateInput {
  const plan = source.document;
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
export function toPrismaDoseJson(value: Dose): Prisma.InputJsonValue {
  return toPrismaJson(value);
}
