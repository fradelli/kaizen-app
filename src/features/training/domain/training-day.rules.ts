import type { CivilDate, NormalizedTrainingDose } from "./training-day.types";
import { TrainingProjectionError } from "./training-projection.error";

const civilDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCivilDate(value: string): CivilDate {
  const match = civilDatePattern.exec(value);

  if (!match) {
    throw new TrainingProjectionError(
      "TRAINING_CIVIL_DATE_INVALID",
      "A data civil deve usar o formato YYYY-MM-DD.",
    );
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new TrainingProjectionError(
      "TRAINING_CIVIL_DATE_INVALID",
      "A data civil informada não existe.",
    );
  }

  return value as CivilDate;
}

export function toCivilDateDatabaseValue(value: CivilDate): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function toCivilDateString(value: Date): CivilDate {
  return value.toISOString().slice(0, 10) as CivilDate;
}

export function parseNormalizedTrainingDose(value: unknown): NormalizedTrainingDose {
  if (!isRecord(value)) {
    return invalidTrainingDefinition("Dose normalizada ausente.");
  }

  const sourceText = value.source_text;
  const minimum = value.minimum;
  const maximum = value.maximum;
  const unit = value.unit;
  const scope = value.scope;
  const qualifier = value.qualifier;

  if (
    typeof sourceText !== "string" ||
    typeof minimum !== "number" ||
    !Number.isFinite(minimum) ||
    typeof maximum !== "number" ||
    !Number.isFinite(maximum) ||
    minimum > maximum ||
    typeof unit !== "string" ||
    typeof scope !== "string" ||
    (qualifier !== null && typeof qualifier !== "string")
  ) {
    return invalidTrainingDefinition("Dose normalizada inválida.");
  }

  return Object.freeze({ sourceText, minimum, maximum, unit, scope, qualifier });
}

export function readStringArrayProperty(value: unknown, property: string): readonly string[] {
  if (!isRecord(value)) {
    return invalidTrainingDefinition("Definição de exercício inválida.");
  }

  const propertyValue = value[property];

  if (!Array.isArray(propertyValue) || propertyValue.some((item) => typeof item !== "string")) {
    return invalidTrainingDefinition(`Campo ${property} inválido na definição do exercício.`);
  }

  return Object.freeze([...propertyValue]);
}

export function readNullableStringProperty(value: unknown, property: string): string | null {
  if (!isRecord(value)) {
    return invalidTrainingDefinition("Definição de exercício inválida.");
  }

  const propertyValue = value[property];

  if (propertyValue === undefined || propertyValue === null) {
    return null;
  }

  if (typeof propertyValue !== "string") {
    return invalidTrainingDefinition(`Campo ${property} inválido na definição do exercício.`);
  }

  return propertyValue;
}

export function parseDirectionValues(value: unknown): Readonly<Record<string, number>> | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    return invalidTrainingDefinition("Valores direcionais inválidos.");
  }

  const entries = Object.entries(value);

  if (entries.some(([, item]) => typeof item !== "number" || !Number.isFinite(item))) {
    return invalidTrainingDefinition("Valores direcionais inválidos.");
  }

  return Object.freeze(Object.fromEntries(entries) as Record<string, number>);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidTrainingDefinition(message: string): never {
  throw new TrainingProjectionError("TRAINING_DEFINITION_INVALID", message);
}
