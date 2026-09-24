"use client";

import { Alert, AlertDescription, AlertTitle } from "@fradelli/ui/alert";
import { Button } from "@fradelli/ui/button";

import { trainingDayUnexpectedErrorStyles } from "./training-day-unexpected-error.styles";
import type { TrainingDayUnexpectedErrorProps } from "./training-day-unexpected-error.types";

export function TrainingDayUnexpectedError({ reset }: TrainingDayUnexpectedErrorProps) {
  return (
    <section
      className={trainingDayUnexpectedErrorStyles.root}
      aria-labelledby="training-unexpected-error-title"
    >
      <Alert variant="destructive">
        <AlertTitle
          id="training-unexpected-error-title"
          className={trainingDayUnexpectedErrorStyles.title}
        >
          Não foi possível carregar o treino
        </AlertTitle>
        <AlertDescription>
          <p>Ocorreu uma falha inesperada. A data selecionada foi preservada.</p>
          <div className={trainingDayUnexpectedErrorStyles.action}>
            <Button type="button" onClick={reset}>
              Tentar novamente
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </section>
  );
}
