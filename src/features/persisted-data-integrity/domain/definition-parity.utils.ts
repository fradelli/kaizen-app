import type { JsonValue } from "../../plan-definition-import/domain/plan-definition-import.types";
import type { DefinitionRecord, IntegrityIssue } from "./persisted-data-integrity.types";

export function equalJsonValues(left: JsonValue, right: JsonValue): boolean {
  if (left === right) return true;
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object")
    return false;
  if (Array.isArray(left) || Array.isArray(right))
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => equalJsonValues(value, right[index]))
    );
  const keys = Object.keys(left);
  return (
    keys.length === Object.keys(right).length &&
    keys.every((key) => Object.hasOwn(right, key) && equalJsonValues(left[key], right[key]))
  );
}

export function compareDefinitionFields(
  actual: Readonly<Record<string, JsonValue>> | undefined,
  expected: Readonly<Record<string, JsonValue>>,
  sourcePath: string,
  entity: string,
  issues: IntegrityIssue[],
): void {
  if (!actual) {
    issues.push({ code: "MISSING_DEFINITION", sourcePath, entity, field: "identity" });
    return;
  }
  for (const [field, value] of Object.entries(expected))
    if (!Object.hasOwn(actual, field) || !equalJsonValues(actual[field], value))
      issues.push({ code: "FIELD_MISMATCH", sourcePath, entity, field });
}

export function compareDefinitionCount(
  actual: number,
  expected: number,
  sourcePath: string,
  entity: string,
  issues: IntegrityIssue[],
): void {
  if (actual !== expected)
    issues.push({ code: "COUNT_MISMATCH", sourcePath, entity, field: "count" });
}

export function findSourceBatch(
  batches: readonly DefinitionRecord[],
  path: string,
  sha256: string,
): DefinitionRecord | undefined {
  return batches.find((batch) => batch.sourcePath === path && batch.sourceSha256 === sha256);
}

export function civilDateTimestamp(date: string): string {
  return `${date}T00:00:00.000Z`;
}
