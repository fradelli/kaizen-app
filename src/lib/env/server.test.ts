import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const validWorkspaceId = "00000000-0000-4000-8000-000000000001";
const anotherWorkspaceId = "00000000-0000-4000-8000-000000000002";

function stubValidEnvironment(): void {
  vi.stubEnv("APP_ENV", "local");
  vi.stubEnv("PERSONAL_WORKSPACE_ID", validWorkspaceId);
}

describe("getServerEnvironment", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("valida e congela a configuração do servidor", async () => {
    stubValidEnvironment();
    const { getServerEnvironment } = await import("./server");

    const environment = getServerEnvironment();

    expect(environment).toEqual({
      APP_ENV: "local",
      PERSONAL_WORKSPACE_ID: validWorkspaceId,
    });
    expect(Object.isFrozen(environment)).toBe(true);
  });

  it("mantém a configuração validada em cache por módulo", async () => {
    stubValidEnvironment();
    const { getServerEnvironment } = await import("./server");
    const firstEnvironment = getServerEnvironment();

    vi.stubEnv("PERSONAL_WORKSPACE_ID", anotherWorkspaceId);

    expect(getServerEnvironment()).toBe(firstEnvironment);
    expect(getServerEnvironment().PERSONAL_WORKSPACE_ID).toBe(validWorkspaceId);
  });

  it.each([
    ["APP_ENV ausente", "APP_ENV", undefined],
    ["APP_ENV inválido", "APP_ENV", "development"],
    ["workspace ausente", "PERSONAL_WORKSPACE_ID", undefined],
    ["workspace inválido", "PERSONAL_WORKSPACE_ID", "workspace-private-value"],
  ])("rejeita %s sem expor o valor recebido", async (_scenario, variable, value) => {
    stubValidEnvironment();
    vi.stubEnv(variable, value);
    const { getServerEnvironment, ServerEnvironmentConfigurationError } = await import("./server");

    let error: unknown;

    try {
      getServerEnvironment();
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(ServerEnvironmentConfigurationError);

    if (!(error instanceof ServerEnvironmentConfigurationError)) {
      throw new Error("Era esperado um erro de configuração do servidor.");
    }

    expect(error.code).toBe("SERVER_ENVIRONMENT_INVALID");
    expect(error.invalidVariables).toEqual([variable]);
    expect(error.message).toContain(variable);

    if (value) {
      expect(error.message).not.toContain(value);
    }
  });
});
