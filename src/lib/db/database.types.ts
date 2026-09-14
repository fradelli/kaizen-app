export type DatabaseConfiguration = Readonly<{
  connectionString: string;
  max: number;
  connectionTimeoutMillis: number;
  idleTimeoutMillis: number;
}>;
