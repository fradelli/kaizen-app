import { describe, expect, it, vi } from "vitest";
import {
  addTrainingActivity,
  controlTrainingActivity,
  deleteTrainingActivity,
  saveTrainingActivityExercise,
  updateTrainingActivity,
} from "./mutate-training-day";
import type { TrainingMutationRepository } from "./training-repository";

function dependencies() {
  const repository: TrainingMutationRepository = {
    addTrainingActivity: vi.fn(),
    controlTrainingActivity: vi.fn(),
    deleteTrainingActivity: vi.fn(),
    saveTrainingActivityExercise: vi.fn(),
    updateTrainingActivity: vi.fn(),
  };
  return {
    repository,
    resolveWorkspace: () => ({ workspaceId: "fixed" }),
    now: () => new Date("2026-09-26T15:00:00Z"),
  };
}
describe("training mutation date boundary", () => {
  it.each(["2026-09-24", "2026-09-27"])(
    "rejects every mutation on locked date %s before accessing the repository",
    async (civilDate) => {
      const d = dependencies();
      const expected = { status: "invalid", field: "civilDate" };
      await expect(
        addTrainingActivity(d, { civilDate } as Parameters<typeof addTrainingActivity>[1]),
      ).resolves.toMatchObject(expected);
      await expect(
        updateTrainingActivity(d, { civilDate } as Parameters<typeof updateTrainingActivity>[1]),
      ).resolves.toMatchObject(expected);
      await expect(
        deleteTrainingActivity(d, { civilDate } as Parameters<typeof deleteTrainingActivity>[1]),
      ).resolves.toMatchObject(expected);
      await expect(
        controlTrainingActivity(d, { civilDate } as Parameters<typeof controlTrainingActivity>[1]),
      ).resolves.toMatchObject(expected);
      await expect(
        saveTrainingActivityExercise(d, { civilDate } as Parameters<
          typeof saveTrainingActivityExercise
        >[1]),
      ).resolves.toMatchObject(expected);
      for (const method of Object.values(d.repository)) expect(method).not.toHaveBeenCalled();
    },
  );
});
