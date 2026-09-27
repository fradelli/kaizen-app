import { describe, expect, it } from "vitest";

import type { CivilDate } from "./training-day.types";
import { legacyScheduledEntriesForDate, scheduledEntriesForDate } from "./training-weekly-schedule";
import type { LegacyTrainingWeeklySchedule } from "./training-weekly-schedule.types";

const schedule: LegacyTrainingWeeklySchedule = {
  weekend_game: { enabled: true, day: "saturday", start_time: null },
  models: {
    saturday_game: [
      { day: "monday", time: "09:00", session: "lower_a" },
      { day: "saturday", time: null, session: "game" },
    ],
    sunday_game: [{ day: "sunday", time: null, session: "game" }],
  },
};

describe("legacyScheduledEntriesForDate", () => {
  it("uses the Saturday model without materializing other weekdays", () => {
    expect(legacyScheduledEntriesForDate(schedule, "2026-09-21" as CivilDate)).toEqual([
      { day: "monday", time: "09:00", session: "lower_a" },
    ]);
    expect(legacyScheduledEntriesForDate(schedule, "2026-09-26" as CivilDate)).toEqual([
      { day: "saturday", time: null, session: "game" },
    ]);
  });

  it("does not invent a model when the game day is undefined", () => {
    expect(
      legacyScheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: true, day: null, start_time: null } },
        "2026-09-21" as CivilDate,
      ),
    ).toBeNull();
  });

  it("uses the separately defined game start time when available", () => {
    expect(
      legacyScheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: true, day: "saturday", start_time: "18:00" } },
        "2026-09-26" as CivilDate,
      ),
    ).toEqual([{ day: "saturday", time: "18:00", session: "game" }]);
  });

  it("selects the Sunday model when the game moves", () => {
    expect(
      legacyScheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: true, day: "sunday", start_time: null } },
        "2026-09-27" as CivilDate,
      ),
    ).toEqual([{ day: "sunday", time: null, session: "game" }]);
  });

  it("does not schedule an unconfirmed game", () => {
    expect(
      legacyScheduledEntriesForDate(
        { ...schedule, weekend_game: { enabled: false, day: "saturday", start_time: null } },
        "2026-09-26" as CivilDate,
      ),
    ).toBeNull();
  });

  it("keeps an explicit game time in the selected model", () => {
    expect(
      legacyScheduledEntriesForDate(
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

describe("scheduledEntriesForDate", () => {
  const weekly = {
    schema_version: "2.0.0" as const,
    entries: [
      {
        day: "tuesday" as const,
        type: "structured_training" as const,
        start_time: "17:00",
        end_time: "17:40",
        session_id: "t1",
      },
      {
        day: "tuesday" as const,
        type: "specific_training" as const,
        start_time: "12:00",
        end_time: "13:30",
        name: "Treino esportivo",
      },
    ],
  };
  it("returns every activity on the consulted day without requiring a game", () => {
    expect(scheduledEntriesForDate(weekly, "2026-09-22" as CivilDate)).toHaveLength(2);
    expect(scheduledEntriesForDate(weekly, "2026-09-26" as CivilDate)).toEqual([]);
  });
});
