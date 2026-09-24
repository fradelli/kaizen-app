export const trainingActivityFormStyles = {
  root: "grid min-w-0 gap-4 py-4",
  grid: "grid min-w-0 grid-cols-1 gap-3",
  field: "grid min-w-0 gap-1.5",
  wideField: "grid min-w-0 gap-1.5",
  label: "text-sm font-medium text-foreground",
  control: "min-h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm",
  hint: "text-xs text-muted-foreground",
  actions: "flex flex-wrap items-center gap-3",
} as const;
