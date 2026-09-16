export const unassignedTrainingDayStyles = {
  content: "flex flex-col gap-5",
  sessions: "grid gap-3 sm:grid-cols-2",
  session: "rounded-lg border border-border bg-muted/30 p-4",
  sessionHeading: "flex flex-wrap items-start justify-between gap-2",
  sessionName: "font-semibold text-foreground",
  metadata: "mt-2 text-sm text-muted-foreground",
  note: "text-sm text-muted-foreground",
} as const;
