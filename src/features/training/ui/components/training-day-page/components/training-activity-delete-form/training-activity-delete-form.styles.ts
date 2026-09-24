export const trainingActivityDeleteFormStyles = {
  root: "flex flex-wrap items-center gap-2",
  confirmation:
    "fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/70",
  header: "grid gap-2",
  title: "text-lg font-semibold",
  form: "grid gap-4",
  message: "text-sm text-foreground",
  actions: "flex flex-wrap gap-2",
} as const;
