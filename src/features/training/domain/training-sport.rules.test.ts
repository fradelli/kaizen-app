import { describe, expect, it } from "vitest";
import { isSameTrainingSport } from "./training-sport.rules";

describe("isSameTrainingSport", () => {
  it("matches the Portuguese sport name with its English plan label", () => {
    expect(isSameTrainingSport(" Futevôlei ", "Footvolley")).toBe(true);
    expect(isSameTrainingSport("FOOTVOLLEY", "futevolei")).toBe(true);
  });

  it("normalizes names without treating different sports as equivalent", () => {
    expect(isSameTrainingSport(" Corrida ", "corrida")).toBe(true);
    expect(isSameTrainingSport("Futebol", "Footvolley")).toBe(false);
  });
});
