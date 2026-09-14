import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getDatabaseConfiguration, getDatabaseUrl } from "./environment";

afterEach(() => vi.unstubAllEnvs());

describe("getDatabaseUrl", () => {
  it("retorna configuração tipada imutável com limites de pool", () => {
    vi.stubEnv("APP_ENV", "local");
    vi.stubEnv("DATABASE_URL", "postgres://localhost/kaizen_local");
    const configuration = getDatabaseConfiguration();
    expect(configuration).toEqual({
      connectionString: "postgres://localhost/kaizen_local",
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
    expect(Object.isFrozen(configuration)).toBe(true);
  });
  it.each([
    undefined,
    "",
    "private-invalid-value",
    "https://example.test/database",
    "postgres://localhost/",
  ])("rejeita URL inválida sem expor seu valor", (value) => {
    vi.stubEnv("DATABASE_URL", value);
    expect(getDatabaseUrl).toThrow("Configuração de servidor inválida: DATABASE_URL.");
  });

  it("aceita PostgreSQL local", () => {
    vi.stubEnv("APP_ENV", "local");
    vi.stubEnv("DATABASE_URL", "postgres://localhost/kaizen_local");
    expect(getDatabaseUrl()).toBe("postgres://localhost/kaizen_local");
  });

  it("impede conexão externa no ambiente local", () => {
    vi.stubEnv("APP_ENV", "local");
    vi.stubEnv("DATABASE_URL", "postgres://example.test/kaizen_local");
    expect(getDatabaseUrl).toThrow("PostgreSQL local do Kaizen");
  });

  it("isola o banco de teste do runtime de desenvolvimento", () => {
    vi.stubEnv("APP_ENV", "local");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DATABASE_URL", "postgres://localhost/kaizen_test");
    expect(getDatabaseUrl).toThrow("PostgreSQL local do Kaizen");
    vi.stubEnv("NODE_ENV", "test");
    expect(getDatabaseUrl()).toBe("postgres://localhost/kaizen_test");
  });

  it.each(["preview", "production", undefined])("exige TLS fora do local: %s", (environment) => {
    vi.stubEnv("APP_ENV", environment);
    vi.stubEnv("DATABASE_URL", "postgres://example.test/database");
    expect(getDatabaseUrl).toThrow("DATABASE_URL exige TLS com verificação completa");
  });

  it("aceita URL com TLS verificado", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("DATABASE_URL", "postgres://example.test/database?sslmode=verify-full");
    expect(getDatabaseUrl()).toContain("sslmode=verify-full");
  });
});
