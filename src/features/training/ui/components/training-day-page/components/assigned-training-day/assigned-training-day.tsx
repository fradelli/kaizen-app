import { Badge } from "@fradelli/ui/badge";

import { TrainingExecutionSummary } from "../training-execution-summary/training-execution-summary";
import { TrainingSession } from "../training-session/training-session";
import { assignedTrainingDayStyles } from "./assigned-training-day.styles";
import type { AssignedTrainingDayProps } from "./assigned-training-day.types";

export function AssignedTrainingDay({ day }: AssignedTrainingDayProps) {
  return (
    <div className={assignedTrainingDayStyles.root}>
      <div className={assignedTrainingDayStyles.plan} aria-label="Versão do plano">
        <Badge variant={day.state === "mobility" ? "secondary" : "default"}>
          {day.state === "mobility" ? "Mobilidade" : "Treino"}
        </Badge>
        <Badge variant="outline">
          Plano {day.planId} · versão {day.planVersion}
        </Badge>
      </div>
      <TrainingExecutionSummary execution={day.execution} />
      {day.state === "training" ? (
        <>
          {day.preparation ? <TrainingSession session={day.preparation} /> : null}
          <TrainingSession session={day.main} />
        </>
      ) : (
        <TrainingSession session={day.mobility} />
      )}
    </div>
  );
}
