import { AssignedTrainingDay } from "../assigned-training-day/assigned-training-day";
import { RestTrainingDay } from "../rest-training-day/rest-training-day";
import { TrainingDayFeedback } from "../training-day-feedback/training-day-feedback";
import { UnassignedTrainingDay } from "../unassigned-training-day/unassigned-training-day";
import type { TrainingDayContentProps } from "./training-day-content.types";

export async function TrainingDayContent({ result }: TrainingDayContentProps) {
  const queryResult = await result;

  if (queryResult.status === "invalid_data") {
    return (
      <TrainingDayFeedback
        variant="destructive"
        title="Não foi possível resolver o treino"
        description={
          queryResult.reason === "reference_invalid"
            ? "Uma referência necessária do plano não foi encontrada. Nenhum dado parcial foi exibido."
            : "A definição ativa do treino está inconsistente. Nenhum dado parcial foi exibido."
        }
      />
    );
  }

  const { day } = queryResult;

  switch (day.state) {
    case "unavailable":
      return (
        <TrainingDayFeedback
          variant="warning"
          title="Plano de treino indisponível"
          description="O plano ativo não pôde ser carregado para esta data. Tente novamente mais tarde."
        />
      );
    case "unassigned":
      return <UnassignedTrainingDay day={day} />;
    case "rest":
      return <RestTrainingDay day={day} />;
    case "training":
    case "mobility":
      return <AssignedTrainingDay day={day} />;
  }
}
