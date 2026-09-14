import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const databaseGlobal = globalThis as typeof globalThis & {
  kaizenPrisma?: { $disconnect(): Promise<void> };
};

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("APP_ENV", "local");
  vi.stubEnv("DATABASE_URL", "postgres://localhost/kaizen_local");
});

afterEach(async () => {
  await databaseGlobal.kaizenPrisma?.$disconnect();
  delete databaseGlobal.kaizenPrisma;
  vi.unstubAllEnvs();
});

describe("getDatabaseClient", () => {
  it("reutiliza Client por processo sem abrir conexão ao importar", async () => {
    const { getDatabaseClient } = await import("./client");
    const client = getDatabaseClient();
    expect(getDatabaseClient()).toBe(client);
    vi.resetModules();
    expect((await import("./client")).getDatabaseClient()).toBe(client);
  });

  it("mantém singleton de módulo em produção", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { getDatabaseClient } = await import("./client");
    const client = getDatabaseClient();
    expect(getDatabaseClient()).toBe(client);
    expect(databaseGlobal.kaizenPrisma).toBeUndefined();
    await client.$disconnect();
  });

  it("valida configuração apenas quando o Client é solicitado", async () => {
    vi.stubEnv("DATABASE_URL", undefined);
    const { getDatabaseClient } = await import("./client");
    expect(getDatabaseClient).toThrow("DATABASE_URL");
  });
});
