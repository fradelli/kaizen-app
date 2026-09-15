import { describe, expect, it } from "vitest";
import { equalJsonValues, compareDefinitionFields } from "./definition-parity.utils";
import type { IntegrityIssue } from "./persisted-data-integrity.types";
import type { JsonValue } from "../../plan-definition-import/domain/plan-definition-import.types";
describe("comparação semântica de JSONB", () => {
  it("ignora ordem de chaves e preserva ordem, tipo e presença dos valores", () => {
    expect(equalJsonValues({ b: [1, null], a: true }, { a: true, b: [1, null] })).toBe(true);
    for (const [left, right] of [
      [null, {}],
      [1, "1"],
      [{ a: 1 }, { b: 1 }],
      [
        [1, 2],
        [2, 1],
      ],
      [[1], [1, 2]],
      [{}, []],
      [[], {}],
      [{ a: 1 }, {}],
    ] as const)
      expect(equalJsonValues(left as JsonValue, right as JsonValue)).toBe(false);
  });
  it("campo ausente não é null", () => {
    const issues: IntegrityIssue[] = [];
    compareDefinitionFields({}, { notes: null }, "data/plans/test.json", "sessions", issues);
    expect(issues).toEqual([
      {
        code: "FIELD_MISMATCH",
        sourcePath: "data/plans/test.json",
        entity: "sessions",
        field: "notes",
      },
    ]);
  });
});
