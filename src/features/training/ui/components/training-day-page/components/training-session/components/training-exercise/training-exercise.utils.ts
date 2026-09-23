export function formatTrainingDisplayText(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/([\p{L}])-(?=\p{L})/gu, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}
