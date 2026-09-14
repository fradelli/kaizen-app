import "server-only";
import { z } from "zod";
import { validateDocuments } from "../../../../scripts/validate-data.mjs";
import type { PlanDefinitionSnapshot } from "../domain/plan-definition-import.types";
import type { NutritionPlan } from "../domain/plan-definition-source.types";

const pointerSchema = z.object({
  schema_version: z.string().min(1),
  active_plan_id: z.string().min(1),
  active_plan_path: z.string().min(1),
});
export function assertSnapshotHasRequiredSources(snapshot: PlanDefinitionSnapshot): void {
  if (!/^[0-9a-f]{40}$/.test(snapshot.commit)) throw new Error();
  for (const kind of [
    "exercise_library",
    "execution_metadata",
    "training_pointer",
    "nutrition_pointer",
  ]) {
    if (snapshot.sources.filter((source) => source.kind === kind).length !== 1) throw new Error();
  }
}
export function assertDocumentsMatchSchemasAndReferences(snapshot: PlanDefinitionSnapshot): void {
  if (
    validateDocuments({
      documents: snapshot.documents,
      availablePaths: snapshot.availablePaths,
      stopOnSchemaError: true,
    }).length
  )
    throw new Error();
}
export function assertActivePointersSelectMatchingPlans(snapshot: PlanDefinitionSnapshot): void {
  for (const domain of ["training", "nutrition"]) {
    const path = domain === "training" ? "data/active.json" : "data/nutrition/active.json";
    const pointer = pointerSchema.parse(snapshot.documents.get(path));
    const source = snapshot.sources.find(
      (source) => source.path === pointer.active_plan_path && source.kind === `${domain}_plan`,
    );
    if (!source || source.document.plan_id !== pointer.active_plan_id) throw new Error();
  }
}
export function assertSourcesHaveValidProvenance(snapshot: PlanDefinitionSnapshot): void {
  for (const source of snapshot.sources) {
    if (
      !/^[0-9a-f]{64}$/.test(source.sha256) ||
      typeof source.schemaVersion !== "string" ||
      !source.schemaVersion
    )
      throw new Error();
  }
}
export function assertMealOptionReferencesAreAcyclic(snapshot: PlanDefinitionSnapshot): void {
  for (const source of snapshot.sources) {
    if (source.kind !== "nutrition_plan") continue;
    const plan = source.document as unknown as NutritionPlan;
    const references = new Map<string, string | undefined>(
      plan.meals.flatMap((meal) =>
        meal.options.map((option) => [`${meal.id}.${option.id}`, option.reference_option] as const),
      ),
    );
    for (const key of references.keys()) {
      const visited = new Set<string>();
      let current: string | undefined = key;
      while (current) {
        if (visited.has(current) || !references.has(current)) throw new Error();
        visited.add(current);
        current = references.get(current);
      }
    }
  }
}
