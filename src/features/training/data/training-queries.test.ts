import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db/client", () => ({ getDatabaseClient: vi.fn(() => ({})) }));
vi.mock("@/lib/env/server", () => ({
  getServerEnvironment: vi.fn(() => ({ APP_ENV: "local" })),
}));
vi.mock("@/lib/security/workspace", () => ({
  resolveFixedWorkspace: vi.fn(() => ({ workspaceId: "workspace-fixed" })),
}));
vi.mock("../application/get-public-training-plan", () => ({ getPublicTrainingPlan: vi.fn() }));
vi.mock("../application/get-training-day", () => ({ getTrainingDay: vi.fn() }));
vi.mock("./prisma-training-repository", () => ({
  PrismaTrainingRepository: class PrismaTrainingRepository {},
}));

import { getTrainingDay } from "../application/get-training-day";
import type { CivilDate } from "../domain/training-day.types";
import { TrainingProjectionError } from "../domain/training-projection.error";
import { queryFixedWorkspaceTrainingDayPage } from "./training-queries";

const getTrainingDayMock = vi.mocked(getTrainingDay);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queryFixedWorkspaceTrainingDayPage", () => {
  it("returns a serializable ready result", async () => {
    getTrainingDayMock.mockResolvedValue({
      state: "unavailable",
      civilDate: "2026-09-16" as CivilDate,
      reason: "active_plan_not_found",
      activities: [],
    });

    await expect(queryFixedWorkspaceTrainingDayPage("2026-09-16")).resolves.toEqual({
      status: "ready",
      day: {
        state: "unavailable",
        civilDate: "2026-09-16",
        reason: "active_plan_not_found",
        activities: [],
      },
    });
  });

  it.each([
    ["TRAINING_DEFINITION_INVALID", "definition_invalid"],
    ["TRAINING_REFERENCE_INVALID", "reference_invalid"],
  ] as const)("maps %s to a safe page result", async (code, reason) => {
    getTrainingDayMock.mockRejectedValue(new TrainingProjectionError(code, "private detail"));

    await expect(queryFixedWorkspaceTrainingDayPage("2026-09-16")).resolves.toEqual({
      status: "invalid_data",
      reason,
    });
  });

  it("preserves unexpected and invalid-date failures", async () => {
    const unexpectedError = new Error("unexpected");
    getTrainingDayMock.mockRejectedValueOnce(unexpectedError);

    await expect(queryFixedWorkspaceTrainingDayPage("2026-09-16")).rejects.toBe(unexpectedError);

    const invalidDateError = new TrainingProjectionError(
      "TRAINING_CIVIL_DATE_INVALID",
      "invalid date",
    );
    getTrainingDayMock.mockRejectedValueOnce(invalidDateError);

    await expect(queryFixedWorkspaceTrainingDayPage("2026-02-29")).rejects.toBe(invalidDateError);
  });
});
