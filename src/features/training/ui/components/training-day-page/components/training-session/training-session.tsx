import { Badge } from "@fradelli/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";

import { TrainingExercise } from "./components/training-exercise/training-exercise";
import {
  TRAINING_SESSION_ROLE_LABELS,
  TRAINING_SESSION_ROLE_VARIANTS,
} from "./training-session.constants";
import { trainingSessionStyles } from "./training-session.styles";
import type { TrainingSessionProps } from "./training-session.types";

export function TrainingSession({ session }: TrainingSessionProps) {
  const headingId = `${session.role}-${session.sessionId}-title`;

  return (
    <section aria-labelledby={headingId}>
      <Card>
        <CardHeader className={trainingSessionStyles.header}>
          <div className={trainingSessionStyles.heading}>
            <CardTitle>
              <h2 id={headingId}>{session.name}</h2>
            </CardTitle>
            <Badge variant={TRAINING_SESSION_ROLE_VARIANTS[session.role]}>
              {TRAINING_SESSION_ROLE_LABELS[session.role]}
            </Badge>
          </div>
          <div className={trainingSessionStyles.metadata}>
            <span>Duração-alvo: {session.targetDurationMinutes} min</span>
            {session.shortDurationMinutes === null ? null : (
              <span>Versão curta: {session.shortDurationMinutes} min</span>
            )}
            {session.intensity ? <span>Intensidade: {session.intensity}</span> : null}
          </div>
          {session.notes ? <CardDescription>{session.notes}</CardDescription> : null}
        </CardHeader>
        <CardContent className={trainingSessionStyles.content}>
          {session.exercises.map((exercise) => (
            <TrainingExercise key={exercise.prescriptionId} exercise={exercise} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
