import type { TestDatabaseConfiguration } from "./test-database-configuration.types";

export function getTestDatabaseConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): TestDatabaseConfiguration {
  try {
    const runtimeUrl = environment.TEST_DATABASE_URL!;
    const directUrl = environment.TEST_DIRECT_URL!;
    const runtime = new URL(runtimeUrl);
    const direct = new URL(directUrl);
    for (const target of [runtime, direct])
      if (
        !["postgres:", "postgresql:"].includes(target.protocol) ||
        !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
        target.pathname !== "/kaizen_test"
      )
        throw new Error();
    if (runtime.host !== direct.host || runtime.pathname !== direct.pathname) throw new Error();
    return { runtimeUrl, directUrl };
  } catch {
    throw new Error(
      "TEST_DATABASE_URL e TEST_DIRECT_URL devem apontar ao mesmo PostgreSQL loopback descartável kaizen_test.",
    );
  }
}

export function assertDisposableTestSchema(schema: string): void {
  if (!/^kaizen_import_test_[0-9a-f]{32}$/.test(schema))
    throw new Error("Schema descartável de teste inválido.");
}
