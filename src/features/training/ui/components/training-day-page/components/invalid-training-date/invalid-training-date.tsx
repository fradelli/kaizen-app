import { Button } from "@fradelli/ui/button";
import Link from "next/link";

import { TrainingDayFeedback } from "../training-day-feedback/training-day-feedback";
import { createTrainingDateHref } from "../training-date-navigation/training-date-navigation.utils";
import type { InvalidTrainingDateProps } from "./invalid-training-date.types";

export function InvalidTrainingDate({
  todayDate,
  reason,
  maximumFutureDate,
}: InvalidTrainingDateProps) {
  const isFutureDateOutOfRange = reason === "future_date_out_of_range";
  return (
    <TrainingDayFeedback
      variant={isFutureDateOutOfRange ? "warning" : "destructive"}
      title={isFutureDateOutOfRange ? "Programação ainda indisponível" : "Data inválida"}
      description={
        reason === "repeated_date"
          ? "Informe somente uma data na URL para abrir o treino do dia."
          : isFutureDateOutOfRange
            ? `Você pode consultar e preparar treinos somente até ${maximumFutureDate ?? "quatro dias à frente"}.`
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
