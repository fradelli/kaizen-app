import type { CivilDate } from "@/features/training/domain/training-day.types";

export type InvalidTrainingDateProps = Readonly<{
  todayDate: CivilDate;
  reason: "invalid_date" | "repeated_date" | "future_date_out_of_range";
  maximumFutureDate?: CivilDate;
}>;
