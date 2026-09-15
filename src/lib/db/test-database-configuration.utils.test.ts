import { describe, expect, it } from "vitest";
import {
  assertDisposableTestSchema,
  getTestDatabaseConfiguration,
} from "./test-database-configuration.utils";
const connection = "postgres://test:synthetic@127.0.0.1:5434/kaizen_test";
describe("proteção compartilhada do banco descartável", () => {
  it("aceita portas alternativas e IPv6 loopback", () => {
    for (const url of [
      connection,
      "postgresql://test:synthetic@[::1]:5433/kaizen_test",
      "postgres://localhost/kaizen_test",
    ])
      expect(
        getTestDatabaseConfiguration({ TEST_DATABASE_URL: url, TEST_DIRECT_URL: url }),
      ).toEqual({ runtimeUrl: url, directUrl: url });
  });
  it.each([
    undefined,
    "invalid",
    "https://localhost/kaizen_test",
    "postgres://remote.example/kaizen_test",
    "postgres://localhost/kaizen_local",
    "postgres://localhost/kaizen_test_extra",
  ])("rejeita destino inválido sem revelar URL: %s", (url) => {
    expect(() =>
      getTestDatabaseConfiguration({ TEST_DATABASE_URL: url, TEST_DIRECT_URL: url }),
    ).toThrow("mesmo PostgreSQL loopback descartável");
  });
  it("não aceita runtime e direct diferentes nem fallback local", () => {
    expect(() =>
      getTestDatabaseConfiguration({
        TEST_DATABASE_URL: connection,
        TEST_DIRECT_URL: connection.replace("5434", "5433"),
      }),
    ).toThrow();
    expect(() =>
      getTestDatabaseConfiguration({ DATABASE_URL: connection, DIRECT_URL: connection }),
    ).toThrow();
  });
  it("limita schemas a nomes gerados pelas fixtures", () => {
    expect(() => assertDisposableTestSchema(`kaizen_import_test_${"a".repeat(32)}`)).not.toThrow();
    for (const schema of [
      "public",
      "kaizen_test",
      "kaizen_import_test_abc",
      'kaizen_import_test_";DROP SCHEMA public',
    ])
      expect(() => assertDisposableTestSchema(schema)).toThrow();
  });
});
