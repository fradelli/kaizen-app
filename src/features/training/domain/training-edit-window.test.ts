import { describe, expect, it } from "vitest";
import { isTrainingDateEditable } from "./training-edit-window";

describe("training edit window", () => {
  it("allows today and yesterday, rejecting future and older dates", () => {
    const now = new Date("2026-09-26T15:00:00Z");
    expect(isTrainingDateEditable("2026-09-26", now)).toBe(true);
    expect(isTrainingDateEditable("2026-09-25", now)).toBe(true);
    expect(isTrainingDateEditable("2026-09-24", now)).toBe(false);
    expect(isTrainingDateEditable("2026-09-27", now)).toBe(false);
  });
  it("uses São Paulo dates at the UTC midnight boundary", () => {
    const now = new Date("2026-10-01T01:00:00Z");
    expect(isTrainingDateEditable("2026-09-30", now)).toBe(true);
    expect(isTrainingDateEditable("2026-09-29", now)).toBe(true);
    expect(isTrainingDateEditable("2026-10-01", now)).toBe(false);
  });
});
