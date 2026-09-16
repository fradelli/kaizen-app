export type TrainingProjectionErrorCode =
  "TRAINING_CIVIL_DATE_INVALID" | "TRAINING_DEFINITION_INVALID" | "TRAINING_REFERENCE_INVALID";

export class TrainingProjectionError extends Error {
  readonly code: TrainingProjectionErrorCode;

  constructor(code: TrainingProjectionErrorCode, message: string) {
    super(message);
    this.name = "TrainingProjectionError";
    this.code = code;
  }
}
