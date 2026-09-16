import type { TrainingSetDto } from "@/features/training/application/training-dto";
import type { TrainingMeasurementType } from "@/features/training/domain/training-day.types";

export type TrainingSetRowProps = Readonly<{
  set: TrainingSetDto;
  measurementType: TrainingMeasurementType;
  loadApplicable: boolean;
  loadUnit: string | null;
}>;
