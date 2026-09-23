import "server-only";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type { PlanDefinitionSnapshot } from "../domain/plan-definition-import.types";
import {
  assertSnapshotHasRequiredSources,
  assertDocumentsMatchSchemasAndReferences,
  assertActivePointersSelectMatchingPlans,
  assertSourcesHaveValidProvenance,
  assertMealOptionReferencesAreAcyclic,
  assertWeeklyScheduleReferencesImportedSessions,
} from "./plan-definition-snapshot-validation.rules";

export function validatePlanDefinitionSnapshot(snapshot: PlanDefinitionSnapshot): void {
  try {
    assertSnapshotHasRequiredSources(snapshot);
    assertDocumentsMatchSchemasAndReferences(snapshot);
    assertActivePointersSelectMatchingPlans(snapshot);
    assertWeeklyScheduleReferencesImportedSessions(snapshot);
    assertSourcesHaveValidProvenance(snapshot);
    assertMealOptionReferencesAreAcyclic(snapshot);
  } catch {
    throw new PlanDefinitionImportError("SOURCE_INVALID");
  }
}
