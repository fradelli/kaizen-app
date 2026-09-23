export type TrainingScheduleWeekday =
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type TrainingWeeklySchedule = Readonly<{
  weekend_game: Readonly<{
    enabled: boolean;
    day: "saturday" | "sunday" | null;
    start_time: string | null;
  }>;
  models: Readonly<{
    saturday_game: readonly TrainingWeeklyScheduleEntry[];
    sunday_game: readonly TrainingWeeklyScheduleEntry[];
  }>;
}>;

export type TrainingWeeklyScheduleEntry = Readonly<{
  day: TrainingScheduleWeekday;
  time: string | null;
  session: string;
}>;
