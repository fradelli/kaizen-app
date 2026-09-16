import { Alert, AlertDescription, AlertTitle } from "@fradelli/ui/alert";
import { Badge } from "@fradelli/ui/badge";

import { TrainingSetRow } from "./components/training-set-row/training-set-row";
import {
  TRAINING_EXERCISE_STATUS_LABELS,
  TRAINING_EXERCISE_STATUS_VARIANTS,
} from "./training-exercise.constants";
import { trainingExerciseStyles } from "./training-exercise.styles";
import type { TrainingExerciseProps } from "./training-exercise.types";

export function TrainingExercise({ exercise }: TrainingExerciseProps) {
  return (
    <article
      className={trainingExerciseStyles.root}
      aria-labelledby={`${exercise.prescriptionId}-title`}
    >
      <header className={trainingExerciseStyles.header}>
        <div>
          <h3 id={`${exercise.prescriptionId}-title`} className={trainingExerciseStyles.title}>
            {exercise.name}
          </h3>
          <p className={trainingExerciseStyles.prescription}>{exercise.prescribedText}</p>
        </div>
        <Badge variant={TRAINING_EXERCISE_STATUS_VARIANTS[exercise.status]}>
          {TRAINING_EXERCISE_STATUS_LABELS[exercise.status]}
        </Badge>
      </header>

      <dl className={trainingExerciseStyles.metadata}>
        <div>
          <dt className={trainingExerciseStyles.screenReaderOnly}>Séries prescritas</dt>
          <dd>{exercise.prescribedSets} séries</dd>
        </div>
        {exercise.restSeconds === null ? null : (
          <div>
            <dt className={trainingExerciseStyles.screenReaderOnly}>Descanso</dt>
            <dd>Descanso: {exercise.restSeconds}s</dd>
          </div>
        )}
        {exercise.priority ? (
          <div>
            <dt className={trainingExerciseStyles.screenReaderOnly}>Prioridade</dt>
            <dd>Prioridade: {exercise.priority}</dd>
          </div>
        ) : null}
      </dl>

      {exercise.instructions.length || exercise.cues.length ? (
        <div className={trainingExerciseStyles.details}>
          {exercise.instructions.length ? (
            <div>
              <h4 className={trainingExerciseStyles.detailTitle}>Execução</h4>
              <ul className={trainingExerciseStyles.list}>
                {exercise.instructions.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {exercise.cues.length ? (
            <div>
              <h4 className={trainingExerciseStyles.detailTitle}>Pontos de atenção</h4>
              <ul className={trainingExerciseStyles.list}>
                {exercise.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {exercise.notes ? <p className={trainingExerciseStyles.notes}>{exercise.notes}</p> : null}
      {exercise.comment ? (
        <p className={trainingExerciseStyles.notes}>Comentário: {exercise.comment}</p>
      ) : null}

      {exercise.risks ? (
        <Alert variant="warning">
          <AlertTitle>Alerta da definição</AlertTitle>
          <AlertDescription>{exercise.risks}</AlertDescription>
        </Alert>
      ) : null}

      {exercise.sets.length ? (
        <div>
          <h4 className={trainingExerciseStyles.setsTitle}>Séries</h4>
          <ol className={trainingExerciseStyles.sets}>
            {exercise.sets.map((set) => (
              <TrainingSetRow
                key={set.setNumber}
                set={set}
                measurementType={exercise.measurementType}
                loadApplicable={exercise.loadApplicable}
                loadUnit={exercise.loadUnit}
              />
            ))}
          </ol>
        </div>
      ) : null}
    </article>
  );
}
