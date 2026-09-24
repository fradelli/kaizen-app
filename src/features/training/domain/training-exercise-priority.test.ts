import { describe, expect, it } from "vitest";

import { resolveTrainingExercisePriorityLevel } from "./training-exercise-priority";

describe("resolveTrainingExercisePriorityLevel", () => {
  it.each([
    ["complementary", 1],
    ["fundamental", 3],
    [null, null],
    ["unknown", null],
  ] as const)("maps %s to %s without inventing unsupported priorities", (priority, expected) => {
    expect(resolveTrainingExercisePriorityLevel(priority)).toBe(expected);
  });
});
