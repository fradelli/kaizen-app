import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("identifica a fundação do Kaizen", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Kaizen" })).toBeInTheDocument();
    expect(screen.getByText(/dieta e treino/i)).toBeInTheDocument();
  });
});
