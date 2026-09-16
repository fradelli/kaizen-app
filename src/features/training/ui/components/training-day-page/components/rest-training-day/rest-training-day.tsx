import { Badge } from "@fradelli/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";

import { TrainingExecutionSummary } from "../training-execution-summary/training-execution-summary";
import { restTrainingDayStyles } from "./rest-training-day.styles";
import type { RestTrainingDayProps } from "./rest-training-day.types";

export function RestTrainingDay({ day }: RestTrainingDayProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="info">Descanso</Badge>
        <CardTitle>
          <h2>Descanso hoje</h2>
        </CardTitle>
        <CardDescription>
          Este dia não possui exercícios prescritos nem campos de execução.
        </CardDescription>
      </CardHeader>
      <CardContent className={restTrainingDayStyles.content}>
        {day.reason ? <p className={restTrainingDayStyles.reason}>{day.reason}</p> : null}
        <TrainingExecutionSummary execution={day.execution} />
      </CardContent>
    </Card>
  );
}
