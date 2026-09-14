import { describe, expect, it } from "vitest";
import { getPrismaDatasourceUrl } from "./prisma-environment";

describe("configuração da CLI Prisma", () => {
  it("permite geração sem banco e não usa DATABASE_URL como fallback", () => {
    expect(
      getPrismaDatasourceUrl({ DATABASE_URL: "postgres://localhost/kaizen_local" }, ["generate"]),
    ).toBeUndefined();
    expect(getPrismaDatasourceUrl({ DIRECT_URL: "" }, ["generate"])).toBeUndefined();
  });
  it.each(["reset", "push"])("bloqueia comando destrutivo %s mesmo sem URL", (command) => {
    expect(() => getPrismaDatasourceUrl({}, [command])).toThrow("fluxo versionado");
  });
  it.each(["private-invalid-value", "https://example.test/db", "postgres://localhost/"])(
    "rejeita URL inválida sem expor valor: %s",
    (value) => {
      expect(() => getPrismaDatasourceUrl({ DIRECT_URL: value }, ["deploy"])).toThrow(
        "Configuração DIRECT_URL inválida",
      );
    },
  );
  it.each([
    { APP_ENV: "production", DIRECT_URL: "postgres://localhost/kaizen_local" },
    { APP_ENV: "local", DIRECT_URL: "postgres://example.test/kaizen_local" },
    { APP_ENV: "local", DIRECT_URL: "postgres://localhost/kaizen_test" },
  ])("isola migrate dev no banco local: %o", (environment) => {
    expect(() => getPrismaDatasourceUrl(environment, ["migrate", "dev"])).toThrow(
      "destino não permitido",
    );
  });
  it("aceita migrate dev local e deploy direto", () => {
    const local = "postgresql://[::1]/kaizen_local";
    expect(
      getPrismaDatasourceUrl({ APP_ENV: "local", DIRECT_URL: local }, ["migrate", "dev"]),
    ).toBe(local);
    const direct = "postgres://example.test/db?sslmode=verify-full";
    expect(getPrismaDatasourceUrl({ DIRECT_URL: direct }, ["migrate", "deploy"])).toBe(direct);
  });
});
