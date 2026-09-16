import { describe, expect, it } from "vitest";
import {
  parseCivilDate,
  parseDirectionValues,
  parseNormalizedTrainingDose,
  readStringArrayProperty,
} from "./training-day.rules";

describe("training day rules", () => {
  it("accepts an existing ISO civil date", () => {
    expect(parseCivilDate("2026-09-15")).toBe("2026-09-15");
  });

  it.each(["15/09/2026", "2026-02-29", "2026-13-01"])("rejects invalid civil date %s", (value) => {
    expect(() => parseCivilDate(value)).toThrowError(
      expect.objectContaining({ code: "TRAINING_CIVIL_DATE_INVALID" }),
    );
  });

  it("maps the persisted normalized dose without inferring values", () => {
    expect(
      parseNormalizedTrainingDose({
        source_text: "4-6",
        minimum: 4,
        maximum: 6,
        unit: "repetitions",
        scope: "total",
        qualifier: null,
      }),
    ).toEqual({
      sourceText: "4-6",
      minimum: 4,
      maximum: 6,
      unit: "repetitions",
      scope: "total",
      qualifier: null,
    });
  });

  it("rejects malformed definition fields", () => {
    expect(() => readStringArrayProperty({ how_to: ["ok", 1] }, "how_to")).toThrowError(
      expect.objectContaining({ code: "TRAINING_DEFINITION_INVALID" }),
    );
    expect(() => parseDirectionValues({ front: "3" })).toThrowError(
      expect.objectContaining({ code: "TRAINING_DEFINITION_INVALID" }),
    );
  });
});
