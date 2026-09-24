"use client";

import { Button } from "@fradelli/ui/button";
import { Input } from "@fradelli/ui/input";

import { TrainingActionFeedback } from "../../../../../training-action-feedback/training-action-feedback";
import { useTrainingActionFeedback } from "@/features/training/ui/hooks/use-training-action-feedback";
import { trainingExerciseFormStyles } from "./training-exercise-form.styles";
import type { TrainingExerciseFormProps } from "./training-exercise-form.types";
import {
  createTrainingSetDrafts,
  serializeTrainingSetDrafts,
} from "@/features/training/ui/hooks/use-training-exercise-draft/use-training-exercise-draft.utils";

export function TrainingExerciseForm({
  civilDate,
  activityId,
  sessionId,
  role,
  exercise,
  action,
}: TrainingExerciseFormProps) {
  const { state, formAction, pending } = useTrainingActionFeedback(action);
  return (
    <form action={formAction} className={trainingExerciseFormStyles.root}>
      <input type="hidden" name="civilDate" value={civilDate} />
      <input type="hidden" name="activityId" value={activityId} />
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="exerciseId" value={exercise.exerciseId} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="expectedRevision" value={exercise.revision ?? ""} />
      <input
        type="hidden"
        name="sets"
        value={serializeTrainingSetDrafts(createTrainingSetDrafts(exercise))}
      />
      <div className={trainingExerciseFormStyles.controls}>
        <input
          type="hidden"
          name="completed"
          value={exercise.status === "completed" ? "true" : "false"}
        />
        <div className={trainingExerciseFormStyles.field}>
          <label
            className={trainingExerciseFormStyles.label}
            htmlFor={`${exercise.prescriptionId}-comment`}
          >
            Comentário
          </label>
          <Input
            id={`${exercise.prescriptionId}-comment`}
            name="comment"
            defaultValue={exercise.comment ?? ""}
            maxLength={1000}
          />
        </div>
        <Button type="submit" variant="outline" disabled={pending}>
          Salvar
        </Button>
      </div>
      <TrainingActionFeedback state={state} pending={pending} />
    </form>
  );
}
