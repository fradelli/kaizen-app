export type TrainingScheduleWeekday =
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type LegacyTrainingWeeklySchedule = Readonly<{
  weekend_game: Readonly<{
    enabled: boolean;
    day: "saturday" | "sunday" | null;
    start_time: string | null;
  }>;
  models: Readonly<{
    saturday_game: readonly LegacyTrainingWeeklyScheduleEntry[];
    sunday_game: readonly LegacyTrainingWeeklyScheduleEntry[];
  }>;
}>;

export type LegacyTrainingWeeklyScheduleEntry = Readonly<{
  day: TrainingScheduleWeekday;
  time: string | null;
  session: string;
}>;

export type TrainingWeeklyScheduleEntry = Readonly<{
  day: TrainingScheduleWeekday;
  type: "structured_training" | "specific_training" | "sport_practice" | "mobility" | "rest";
  start_time: string | null;
  end_time: string | null;
  session_id?: string;
  preparation_session_id?: string;
  name?: string;
  sport?: string;
}>;

export type TrainingWeeklySchedule = Readonly<{
  schema_version: "2.0.0";
  entries: readonly TrainingWeeklyScheduleEntry[];
}>;
