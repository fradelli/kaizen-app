import { cleanup, render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppShell } from "./app-shell";
import { isAppShellNavigationItemActive } from "./app-shell.utils";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(usePathname).mockReturnValue("/dieta");
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AppShell", () => {
  it("organiza landmarks, salto de conteúdo e navegação primária", () => {
    render(
      <AppShell>
        <h1>Dieta</h1>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    const navigation = screen.getByRole("navigation", { name: "Navegação principal" });
    const links = within(navigation).getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(within(navigation).getByRole("link", { name: "Dieta" })).toHaveAttribute(
      "href",
      "/dieta",
    );
    expect(within(navigation).getByRole("link", { name: "Treino" })).toHaveAttribute(
      "href",
      "/treino",
    );
    expect(screen.getByRole("link", { name: "Pular para o conteúdo" })).toHaveAttribute(
      "href",
      "#conteudo-principal",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "conteudo-principal");
    expect(screen.getByRole("heading", { level: 1, name: "Dieta" })).toBeInTheDocument();
  });

  it("marca a área atual inclusive em uma subrota", () => {
    vi.mocked(usePathname).mockReturnValue("/treino/sessao");

    render(<AppShell>Conteúdo</AppShell>);

    expect(screen.getByRole("link", { name: "Treino" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dieta" })).not.toHaveAttribute("aria-current");
  });
});

describe("isAppShellNavigationItemActive", () => {
  it("aceita a rota exata e suas subrotas", () => {
    expect(isAppShellNavigationItemActive("/dieta", "/dieta")).toBe(true);
    expect(isAppShellNavigationItemActive("/dieta/refeicoes", "/dieta")).toBe(true);
  });

  it("não confunde rotas apenas com prefixo semelhante", () => {
    expect(isAppShellNavigationItemActive("/dietas", "/dieta")).toBe(false);
    expect(isAppShellNavigationItemActive("/treino", "/dieta")).toBe(false);
  });
});
