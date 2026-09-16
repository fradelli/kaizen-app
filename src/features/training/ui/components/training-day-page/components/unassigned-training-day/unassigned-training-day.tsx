import { Badge } from "@fradelli/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";

import { unassignedTrainingDayStyles } from "./unassigned-training-day.styles";
import type { UnassignedTrainingDayProps } from "./unassigned-training-day.types";

export function UnassignedTrainingDay({ day }: UnassignedTrainingDayProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="warning">Dia não atribuído</Badge>
        <CardTitle>
          <h2>Nenhum treino foi definido para esta data</h2>
        </CardTitle>
        <CardDescription>
          Nenhuma agenda privada foi inferida. As opções do plano ativo estão disponíveis abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className={unassignedTrainingDayStyles.content}>
        <div>
          <Badge variant="outline">
            Plano {day.availablePlan.planId} · versão {day.availablePlan.version}
          </Badge>
        </div>
        <ul className={unassignedTrainingDayStyles.sessions} aria-label="Sessões disponíveis">
          {day.availablePlan.sessions.map((session) => (
            <li key={session.sessionId} className={unassignedTrainingDayStyles.session}>
              <div className={unassignedTrainingDayStyles.sessionHeading}>
                <span className={unassignedTrainingDayStyles.sessionName}>{session.name}</span>
                <Badge variant="secondary">{session.targetDurationMinutes} min</Badge>
              </div>
              <p className={unassignedTrainingDayStyles.metadata}>
                {session.exercises.length} exercício{session.exercises.length === 1 ? "" : "s"}
              </p>
            </li>
          ))}
          <li className={unassignedTrainingDayStyles.session}>
            <div className={unassignedTrainingDayStyles.sessionHeading}>
              <span className={unassignedTrainingDayStyles.sessionName}>Descanso</span>
              <Badge variant="secondary">Sem exercícios</Badge>
            </div>
            <p className={unassignedTrainingDayStyles.metadata}>
              Registra explicitamente que o dia foi reservado para descanso.
            </p>
          </li>
        </ul>
        <p className={unassignedTrainingDayStyles.note}>
          A definição do dia será habilitada junto dos registros de execução.
        </p>
      </CardContent>
    </Card>
  );
}
