import type {
  PlanDefinitionSource,
  PlanDefinitionSourceKind,
} from "./plan-definition-import.types";

export function findPlanDefinitionSource<Kind extends PlanDefinitionSourceKind>(
  sources: readonly PlanDefinitionSource[],
  kind: Kind,
): PlanDefinitionSource<Kind> | undefined {
  return sources.find((source) => source.kind === kind) as PlanDefinitionSource<Kind> | undefined;
}

export function findPlanDefinitionSourceByPath<Kind extends PlanDefinitionSourceKind>(
  sources: readonly PlanDefinitionSource[],
  kind: Kind,
  path: string,
): PlanDefinitionSource<Kind> | undefined {
  return sources.find((source) => source.kind === kind && source.path === path) as
    PlanDefinitionSource<Kind> | undefined;
}
