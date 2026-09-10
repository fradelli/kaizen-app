import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const validWorkspaceId = "00000000-0000-4000-8000-000000000001";

describe("resolveFixedWorkspace", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("APP_ENV", "local");
    vi.stubEnv("PERSONAL_WORKSPACE_ID", validWorkspaceId);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolve um contexto mínimo somente com o workspace do servidor", async () => {
    const { resolveFixedWorkspace } = await import("./workspace");

    const context = resolveFixedWorkspace();

    expect(resolveFixedWorkspace).toHaveLength(0);
    expect(context).toEqual({
      workspaceId: validWorkspaceId,
      mode: "fixed-owner",
    });
    expect(Object.isFrozen(context)).toBe(true);
  });

  it("propaga erro sanitizado quando o workspace é inválido", async () => {
    const privateValue = "workspace-private-value";
    vi.stubEnv("PERSONAL_WORKSPACE_ID", privateValue);
    const { resolveFixedWorkspace } = await import("./workspace");

    expect(resolveFixedWorkspace).toThrowError(
      "Configuração de servidor inválida: PERSONAL_WORKSPACE_ID.",
    );

    try {
      resolveFixedWorkspace();
    } catch (error) {
      expect(String(error)).not.toContain(privateValue);
    }
  });
});
