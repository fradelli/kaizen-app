import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TrainingDayFeedback } from "./training-day-feedback";

describe("TrainingDayFeedback", () => {
  it("places the title and description in the same content column without an icon", () => {
    const { container } = render(
      <TrainingDayFeedback
        title="Nenhuma atividade programada"
        description="Use o botão + para adicionar um treino ou outra atividade."
      />,
    );

    const title = screen.getByText("Nenhuma atividade programada");
    const description = container.querySelector('[data-slot="alert-description"]');

    expect(title).toHaveClass("col-start-2");
    expect(description).toHaveClass("col-start-2");
  });
});
