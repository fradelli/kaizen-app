import { describe, expect, it } from "vitest";

import type { TrainingSetDto } from "@/features/training/application/training-dto";

import { formatTrainingSetLoad, formatTrainingSetResult } from "./training-set-row.utils";

const baseSet: TrainingSetDto = {
  setNumber: 1,
  status: "completed",
  value: null,
  leftValue: null,
  rightValue: null,
  directionValues: null,
  loadKg: null,
  revision: 1,
};

describe("training set presentation", () => {
  it("formats scalar and per-side measurements without inventing missing values", () => {
    expect(formatTrainingSetResult({ ...baseSet, value: 8 }, "repetitions")).toBe("8 repetições");
    expect(
      formatTrainingSetResult(
        {
          ...baseSet,
          leftValue: 6,
          rightValue: 7,
          directionValues: { frontal: 4 },
        },
        "per_side",
      ),
    ).toBe("Esquerdo: 6 · Direito: 7 · frontal: 4");
    expect(formatTrainingSetResult(baseSet, "seconds")).toBe("Resultado ainda não registrado");
  });

  it("keeps missing load absent instead of converting it to zero", () => {
    expect(formatTrainingSetLoad(baseSet, "kg")).toBe("Carga não registrada");
    expect(formatTrainingSetLoad({ ...baseSet, loadKg: "20.500" }, "kg")).toBe("20.500 kg");
  });
});
