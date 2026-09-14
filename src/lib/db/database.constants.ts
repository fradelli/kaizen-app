import type { DatabaseConfiguration } from "./database.types";

export const databasePoolDefaults = Object.freeze({
  max: 5,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
}) satisfies Omit<DatabaseConfiguration, "connectionString">;
