import type { PersistedImportBatch, IntegrityIssue } from "./persisted-data-integrity.types";

export function equalJsonValues(left: unknown, right: unknown): boolean {
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
  const leftRecord = left as Readonly<Record<string, unknown>>;
  const rightRecord = right as Readonly<Record<string, unknown>>;
  const keys = Object.keys(leftRecord);
  return (
    keys.length === Object.keys(rightRecord).length &&
    keys.every(
      (key) =>
        Object.hasOwn(rightRecord, key) && equalJsonValues(leftRecord[key], rightRecord[key]),
    )
  );
}

export function compareDefinitionFields(
  actual: object | undefined,
  expected: Readonly<Record<string, unknown>>,
  sourcePath: string,
  entity: IntegrityIssue["entity"],
  issues: IntegrityIssue[],
): void {
  if (!actual) {
    issues.push({ code: "MISSING_DEFINITION", sourcePath, entity, field: "identity" });
    return;
  }
  const actualFields = actual as Readonly<Record<string, unknown>>;
  for (const [field, value] of Object.entries(expected))
    if (!Object.hasOwn(actualFields, field) || !equalJsonValues(actualFields[field], value))
      issues.push({ code: "FIELD_MISMATCH", sourcePath, entity, field });
}

export function compareDefinitionCount(
  actual: number,
  expected: number,
  sourcePath: string,
  entity: IntegrityIssue["entity"],
  issues: IntegrityIssue[],
): void {
  if (actual !== expected)
    issues.push({ code: "COUNT_MISMATCH", sourcePath, entity, field: "count" });
}

export function findSourceBatch(
  batches: readonly PersistedImportBatch[],
  path: string,
  sha256: string,
): PersistedImportBatch | undefined {
  return batches.find((batch) => batch.sourcePath === path && batch.sourceSha256 === sha256);
}

export function civilDateTimestamp(date: string): string {
  return `${date}T00:00:00.000Z`;
}
