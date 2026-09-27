import { describe, expect, it } from "vitest";
import { parseTrainingExerciseBlock } from "./parse-training-exercise-block";

describe("parseTrainingExerciseBlock", () => {
  const empty = { blockId: null, blockMode: null, blockOrdinal: null, blockPosition: null };
  it("preserves legacy prescriptions without a block", () => {
    expect(parseTrainingExerciseBlock(empty)).toBeNull();
  });
  it("preserves the identity and member order of an alternating block", () => {
    expect(
      parseTrainingExerciseBlock({
        blockId: "t1_b3",
        blockMode: "alternating",
        blockOrdinal: 3,
        blockPosition: 2,
      }),
    ).toEqual({ id: "t1_b3", mode: "alternating", ordinal: 3, position: 2 });
  });
  it.each([
    { ...empty, blockId: "partial" },
    { blockId: "b1", blockMode: "unknown", blockOrdinal: 1, blockPosition: 1 },
    { blockId: "b1", blockMode: "single", blockOrdinal: 1, blockPosition: 2 },
  ])("rejects inconsistent imported blocks", (row) => {
    expect(() => parseTrainingExerciseBlock(row)).toThrow();
  });
});
