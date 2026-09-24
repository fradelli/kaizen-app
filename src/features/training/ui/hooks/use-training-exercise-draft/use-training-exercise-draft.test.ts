import { describe, expect, it } from "vitest";

import type { NormalizedTrainingDose } from "@/features/training/domain/training-day.types";
import {
  isTrainingSetPerformed,
  serializeTrainingSetDrafts,
} from "./use-training-exercise-draft.utils";

const repetitionsDose: NormalizedTrainingDose = {
  sourceText: "8",
  minimum: 8,
  maximum: 8,
  unit: "repetitions",
  scope: "total",
  qualifier: null,
};

const draft = {
  setNumber: 1,
  value: "",
  leftValue: "",
  rightValue: "",
  directionValues: {},
  loadKg: "",
} as const;

describe("training exercise draft", () => {
  it("treats empty and explicit zero as not performed", () => {
    expect(isTrainingSetPerformed(draft, repetitionsDose)).toBe(false);
    expect(isTrainingSetPerformed({ ...draft, value: "0" }, repetitionsDose)).toBe(false);
    expect(isTrainingSetPerformed({ ...draft, value: "8" }, repetitionsDose)).toBe(true);
  });

  it("normalizes empty and explicit zero values when saving the whole exercise", () => {
    expect(
      JSON.parse(serializeTrainingSetDrafts([draft, { ...draft, setNumber: 2, value: "0" }])),
    ).toEqual([
      expect.objectContaining({ setNumber: 1, value: 0 }),
      expect.objectContaining({ setNumber: 2, value: 0 }),
    ]);
  });
});
