import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppShell } from "./app-shell";

vi.mock("./components/app-shell-navigation/app-shell-navigation", () => ({
  AppShellNavigation: () => <nav aria-label="Navegação principal" />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AppShell", () => {
  it("organiza landmarks e salto de conteúdo em torno da composição recebida", () => {
    render(
      <AppShell>
        <h1>Dieta</h1>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pular para o conteúdo" })).toHaveAttribute(
      "href",
      "#conteudo-principal",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "conteudo-principal");
    expect(screen.getByRole("heading", { level: 1, name: "Dieta" })).toBeInTheDocument();
  });
});
