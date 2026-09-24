import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TrainingDayUnexpectedError } from "./training-day-unexpected-error";

describe("TrainingDayUnexpectedError", () => {
  it("keeps the title and description aligned without an icon", () => {
    const { container } = render(
      <TrainingDayUnexpectedError error={new Error("Falha sintética")} reset={vi.fn()} />,
    );

    const title = screen.getByText("Não foi possível carregar o treino");
    const description = container.querySelector('[data-slot="alert-description"]');

    expect(title).toHaveClass("col-start-2");
    expect(description).toHaveClass("col-start-2");
  });
});
