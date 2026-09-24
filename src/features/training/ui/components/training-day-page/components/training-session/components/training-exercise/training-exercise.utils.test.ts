import { describe, expect, it } from "vitest";

import { formatTrainingDisplayText } from "./training-exercise.utils";

describe("training exercise presentation", () => {
  it("turns technical separators into readable words", () => {
    expect(formatTrainingDisplayText("Knee-to-wall")).toBe("Knee to wall");
    expect(formatTrainingDisplayText("8_each_side")).toBe("8 each side");
  });

  it("preserves numeric ranges", () => {
    expect(formatTrainingDisplayText("8-10_repetitions")).toBe("8-10 repetitions");
  });
});
