import { cleanup, render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppShellNavigation } from "./app-shell-navigation";
import { isAppShellNavigationItemActive } from "./app-shell-navigation.utils";

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

describe("AppShellNavigation", () => {
  it("renderiza somente os destinos primários e marca a rota atual", () => {
    render(<AppShellNavigation />);

    const navigation = screen.getByRole("navigation", { name: "Navegação principal" });
    const links = within(navigation).getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(within(navigation).getByRole("link", { name: "Dieta" })).toHaveAttribute(
      "href",
      "/dieta",
    );
    expect(within(navigation).getByRole("link", { name: "Dieta" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(navigation).getByRole("link", { name: "Treino" })).toHaveAttribute(
      "href",
      "/treino",
    );
  });

  it("marca a área atual inclusive em uma subrota", () => {
    vi.mocked(usePathname).mockReturnValue("/treino/sessao");

    render(<AppShellNavigation />);

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
