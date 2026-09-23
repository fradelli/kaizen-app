import { describe, expect, it } from "vitest";

import type { CivilDate } from "./training-day.types";
import { scheduledEntriesForDate } from "./training-weekly-schedule";
import type { TrainingWeeklySchedule } from "./training-weekly-schedule.types";

const schedule: TrainingWeeklySchedule = {
  weekend_game: { enabled: true, day: "saturday", start_time: null },
  models: {
    saturday_game: [
      { day: "monday", time: "09:00", session: "lower_a" },
      { day: "saturday", time: null, session: "game" },
    ],
    sunday_game: [{ day: "sunday", time: null, session: "game" }],
  },
};

describe("scheduledEntriesForDate", () => {
  it("uses the Saturday model without materializing other weekdays", () => {
    expect(scheduledEntriesForDate(schedule, "2026-09-21" as CivilDate)).toEqual([
      { day: "monday", time: "09:00", session: "lower_a" },
    ]);
    expect(scheduledEntriesForDate(schedule, "2026-09-26" as CivilDate)).toEqual([
      { day: "saturday", time: null, session: "game" },
    ]);
  });

  it("does not invent a model when the game day is undefined", () => {
    expect(
      scheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: true, day: null, start_time: null } },
        "2026-09-21" as CivilDate,
      ),
    ).toBeNull();
  });

  it("uses the separately defined game start time when available", () => {
    expect(
      scheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: true, day: "saturday", start_time: "18:00" } },
        "2026-09-26" as CivilDate,
      ),
    ).toEqual([{ day: "saturday", time: "18:00", session: "game" }]);
  });

  it("selects the Sunday model when the game moves", () => {
    expect(
      scheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: true, day: "sunday", start_time: null } },
        "2026-09-27" as CivilDate,
      ),
    ).toEqual([{ day: "sunday", time: null, session: "game" }]);
  });

  it("does not schedule an unconfirmed game", () => {
    expect(
      scheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: false, day: "saturday", start_time: null } },
        "2026-09-26" as CivilDate,
      ),
    ).toBeNull();
  });

  it("keeps an explicit game time in the selected model", () => {
    expect(
      scheduledEntriesForDate(
        {
          ...schedule,
          weekend_game: { enabled: true, day: "saturday", start_time: "18:00" },
          models: {
            ...schedule.models,
            saturday_game: [{ day: "saturday", time: "17:00", session: "game" }],
          },
        },
        "2026-09-26" as CivilDate,
      ),
    ).toEqual([{ day: "saturday", time: "17:00", session: "game" }]);
  });
});
