import type { CivilDate } from "./training-day.types";
import type {
  TrainingScheduleWeekday,
  TrainingWeeklySchedule,
  TrainingWeeklyScheduleEntry,
} from "./training-weekly-schedule.types";

const WEEKDAYS: readonly TrainingScheduleWeekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function scheduledEntriesForDate(
  schedule: TrainingWeeklySchedule,
  civilDate: CivilDate,
): readonly TrainingWeeklyScheduleEntry[] | null {
  const gameDay = schedule.weekend_game.enabled ? schedule.weekend_game.day : null;
  if (!gameDay) return null;
  const model =
    gameDay === "saturday" ? schedule.models.saturday_game : schedule.models.sunday_game;
  const weekday = WEEKDAYS[new Date(`${civilDate}T00:00:00.000Z`).getUTCDay()];
  return model
    .filter((entry) => entry.day === weekday)
    .map((entry) =>
      entry.session === "game" && entry.time === null
        ? { ...entry, time: schedule.weekend_game.start_time }
        : entry,
    );
}
