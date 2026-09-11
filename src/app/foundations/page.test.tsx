import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import FoundationsPage from "./page";

afterEach(cleanup);

describe("FoundationsPage", () => {
  it("expõe foundations e estados genéricos sem depender somente de cor", () => {
    render(<FoundationsPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Foundations" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nome de exemplo")).toHaveAccessibleDescription(
      "Exemplo neutro sem persistência.",
    );
    expect(screen.getByRole("button", { name: "Ação indisponível" })).toBeDisabled();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Amarelo")).toBeInTheDocument();
    expect(screen.getByText("Verde")).toBeInTheDocument();
  });

  it("abre o painel acessível pelo trigger publicado", () => {
    render(<FoundationsPage />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir painel" }));

    expect(screen.getByRole("dialog", { name: "Painel de exemplo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar painel" })).toBeInTheDocument();
  });
});
