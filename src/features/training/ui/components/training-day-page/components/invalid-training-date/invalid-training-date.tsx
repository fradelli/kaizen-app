import { Button } from "@fradelli/ui/button";
import Link from "next/link";

import { TrainingDayFeedback } from "../training-day-feedback/training-day-feedback";
import { createTrainingDateHref } from "../training-date-navigation/training-date-navigation.utils";
import type { InvalidTrainingDateProps } from "./invalid-training-date.types";

export function InvalidTrainingDate({ todayDate, repeated }: InvalidTrainingDateProps) {
  return (
    <TrainingDayFeedback
      variant="destructive"
      title="Data inválida"
      description={
        repeated
          ? "Informe somente uma data na URL para abrir o treino do dia."
          : "Use uma data existente no formato ano-mês-dia, por exemplo 2026-09-16."
      }
      action={
        <Button asChild>
          <Link href={createTrainingDateHref(todayDate)}>Voltar para hoje</Link>
        </Button>
      }
    />
  );
}
