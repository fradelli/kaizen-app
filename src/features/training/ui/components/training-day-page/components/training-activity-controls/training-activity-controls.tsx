"use client";

import { Button } from "@fradelli/ui/button";
import { Input } from "@fradelli/ui/input";
import { useEffect } from "react";

import { useTrainingActionFeedback } from "@/features/training/ui/hooks/use-training-action-feedback";
import { TrainingActionFeedback } from "../training-action-feedback/training-action-feedback";
import { trainingActivityControlsStyles } from "./training-activity-controls.styles";
import type { TrainingActivityControlsProps } from "./training-activity-controls.types";

export function TrainingActivityControls({
  civilDate,
  activity,
  action,
  draft,
  onStart,
  onFinalized,
  ready = true,
}: TrainingActivityControlsProps) {
  const submission = useTrainingActionFeedback(action);

  useEffect(() => {
    if (submission.state.status === "saved" && draft) onFinalized?.();
  }, [draft, onFinalized, submission.state.status]);

  if (activity.status === "scheduled" && !draft) {
    return (
      <div className={trainingActivityControlsStyles.root}>
        <Button type="button" onClick={onStart} disabled={!ready}>
          {activity.type === "structured_training" ? "Iniciar treino" : "Iniciar atividade"}
        </Button>
      </div>
    );
  }

  if (activity.status === "skipped") return null;

  const completed = activity.status === "completed";
  return (
    <details className={trainingActivityControlsStyles.completion}>
      <summary>{completed ? "Corrigir avaliação" : "Finalizar atividade"}</summary>
      <form action={submission.formAction} className={trainingActivityControlsStyles.grid}>
        <input type="hidden" name="civilDate" value={civilDate} />
        <input type="hidden" name="activityId" value={activity.id} />
        <input
          type="hidden"
          name="expectedRevision"
          value={draft?.expectedRevision ?? activity.revision}
        />
        <input type="hidden" name="action" value={completed ? "update_feedback" : "complete"} />
        {draft ? <input type="hidden" name="executionDraft" value={JSON.stringify(draft)} /> : null}
        {activity.type !== "mobility" ? (
          <>
            <Field label="Intensidade" id={`${activity.id}-intensity`}>
              <select
                id={`${activity.id}-intensity`}
                name="intensity"
                defaultValue={activity.intensity ?? "moderate"}
                className={trainingActivityControlsStyles.control}
              >
                <option value="low">Leve</option>
                <option value="moderate">Moderada</option>
                <option value="high">Alta</option>
              </select>
            </Field>
            <Field label="Disposição durante a atividade" id={`${activity.id}-energy`}>
              <select
                id={`${activity.id}-energy`}
                name="energy"
                defaultValue={activity.energy ?? "normal"}
                className={trainingActivityControlsStyles.control}
              >
                <option value="tired">Cansado</option>
                <option value="normal">Normal</option>
                <option value="energized">Disposto</option>
              </select>
            </Field>
          </>
        ) : (
          <>
            <input type="hidden" name="intensity" value="" />
            <input type="hidden" name="energy" value="" />
          </>
        )}
        <div className={trainingActivityControlsStyles.comment}>
          <Field label="Comentário" id={`${activity.id}-activity-comment`}>
            <Input
              id={`${activity.id}-activity-comment`}
              name="comment"
              defaultValue={activity.comment ?? ""}
              maxLength={1000}
            />
          </Field>
        </div>
        <Button type="submit" disabled={submission.pending}>
          {completed ? "Salvar avaliação" : "Finalizar atividade"}
        </Button>
        {submission.state.status !== "saved" && !submission.pending ? (
          <TrainingActionFeedback state={submission.state} pending={false} />
        ) : null}
      </form>
    </details>
  );
}

function Field({
  label,
  id,
  children,
}: Readonly<{ label: string; id: string; children: React.ReactNode }>) {
  return (
    <div className={trainingActivityControlsStyles.field}>
      <label htmlFor={id} className={trainingActivityControlsStyles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}
