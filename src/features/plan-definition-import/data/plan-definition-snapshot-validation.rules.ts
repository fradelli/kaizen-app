import "server-only";
import { z } from "zod";
import { validateDocuments } from "../../../../scripts/validate-data.mjs";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionSource,
} from "../domain/plan-definition-import.types";
import { findPlanDefinitionSourceByPath } from "../domain/plan-definition-source.utils";

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
    "training_schedule",
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
    const source =
      domain === "training"
        ? findPlanDefinitionSourceByPath(
            snapshot.sources,
            "training_plan",
            pointer.active_plan_path,
          )
        : findPlanDefinitionSourceByPath(
            snapshot.sources,
            "nutrition_plan",
            pointer.active_plan_path,
          );
    if (!source || source.document.plan_id !== pointer.active_plan_id) throw new Error();
  }
}
export function assertWeeklyScheduleReferencesImportedSessions(
  snapshot: PlanDefinitionSnapshot,
): void {
  const schedule = snapshot.sources.find((source) => source.kind === "training_schedule");
  if (!schedule || schedule.kind !== "training_schedule") throw new Error();
  const pointer = snapshot.sources.find((source) => source.kind === "training_pointer");
  if (!pointer || pointer.kind !== "training_pointer") throw new Error();
  const plan = snapshot.sources.find(
    (source) =>
      source.kind === "training_plan" && source.path === pointer.document.active_plan_path,
  );
  if (!plan || plan.kind !== "training_plan") throw new Error();
  const genericEntries = new Set([
    "footvolley",
    "footvolley_only",
    "game",
    "rest",
    "rest_or_light_mobility",
  ]);
  for (const model of Object.values(schedule.document.models)) {
    for (const entry of model) {
      if (
        !genericEntries.has(entry.session) &&
        !Object.hasOwn(plan.document.sessions, entry.session)
      )
        throw new Error();
    }
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
  const nutritionSources = snapshot.sources.filter(
    (source): source is PlanDefinitionSource<"nutrition_plan"> => source.kind === "nutrition_plan",
  );
  for (const source of nutritionSources) {
    const plan = source.document;
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
