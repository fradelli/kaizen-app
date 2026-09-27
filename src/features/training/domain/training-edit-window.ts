export function isTrainingDateEditable(civilDate: string, now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const today = `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return civilDate === today || civilDate === yesterday.toISOString().slice(0, 10);
}
