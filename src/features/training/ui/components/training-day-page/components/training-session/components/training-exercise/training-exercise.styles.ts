export const trainingExerciseStyles = {
  root: "flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4",
  header: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
  title: "text-lg font-semibold text-foreground",
  prescription: "text-sm font-medium text-foreground",
  metadata: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground",
  screenReaderOnly: "sr-only",
  details: "grid gap-4 sm:grid-cols-2",
  detailTitle: "mb-1 text-sm font-semibold text-foreground",
  list: "list-disc space-y-1 pl-5 text-sm text-muted-foreground",
  notes: "whitespace-pre-wrap text-sm text-muted-foreground",
  sets: "flex flex-col gap-2",
  setsTitle: "text-sm font-semibold text-foreground",
} as const;
