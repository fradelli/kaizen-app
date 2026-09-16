import type { ReactNode } from "react";

import type { TrainingDayDateResolution } from "../../../application/resolve-training-day-date.types";

export type TrainingDayPageProps = Readonly<{
  dateResolution: TrainingDayDateResolution;
  children: ReactNode;
}>;
