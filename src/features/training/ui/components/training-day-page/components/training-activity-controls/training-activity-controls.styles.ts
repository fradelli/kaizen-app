export const trainingActivityControlsStyles = {
  root: "grid gap-3",
  actions: "flex flex-wrap items-center gap-2",
  completion: "grid gap-3 rounded-lg border border-border bg-background p-4",
  grid: "grid gap-3 sm:grid-cols-2",
  field: "grid min-w-0 gap-1.5",
  label: "text-sm font-medium text-foreground",
  control:
    "min-h-10 w-full min-w-0 appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm",
  comment: "sm:col-span-2",
} as const;
