export const trainingExerciseStyles = {
  root: "flex flex-col gap-3 rounded-xl border border-border border-l-4 bg-background p-3 sm:p-4",
  status: {
    pending: "border-l-category-yellow-border",
    completed: "border-l-status-info-border",
  },
  header: "flex items-start justify-between gap-2",
  heading: "min-w-0",
  title: "text-lg font-semibold text-foreground",
  prescription: "text-sm font-medium text-foreground",
  metadata: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground",
  screenReaderOnly: "sr-only",
  disclosure: "rounded-lg border border-foreground/10 bg-background/60 px-3",
  disclosureSummary:
    "cursor-pointer py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
  details: "grid gap-3 border-t border-foreground/10 py-3 sm:grid-cols-2",
  detailTitle: "mb-1 text-sm font-semibold text-foreground",
  list: "list-disc space-y-1 pl-5 text-sm text-muted-foreground",
  notes: "whitespace-pre-wrap text-sm text-muted-foreground",
  alert: "grid-cols-1 gap-y-1 sm:col-span-2",
  alertTitle: "col-start-1",
  alertDescription: "col-start-1",
} as const;
