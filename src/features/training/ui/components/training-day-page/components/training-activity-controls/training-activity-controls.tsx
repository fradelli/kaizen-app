"use client";

import { Button } from "@fradelli/ui/button";
import { Input } from "@fradelli/ui/input";
import { useEffect, useRef, useState } from "react";
import { isTrainingExecutionDateEditable } from "@/features/training/domain/training-edit-window";
import { hasUnfinishedTrainingExercises } from "./training-activity-controls.utils";

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
  const [confirming, setConfirming] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const confirmed = useRef(false);

  useEffect(() => {
    if (confirming && !dialog.current?.open) dialog.current?.showModal();
    if (!confirming && dialog.current?.open) dialog.current?.close();
  }, [confirming]);

  useEffect(() => {
    if (submission.state.status === "saved" && draft) onFinalized?.();
  }, [draft, onFinalized, submission.state.status]);

  if (!isTrainingExecutionDateEditable(civilDate)) return null;
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
      <form
        ref={form}
        action={submission.formAction}
        className={trainingActivityControlsStyles.grid}
        onSubmit={(event) => {
          if (!completed && !confirmed.current && hasUnfinishedTrainingExercises(activity, draft)) {
            event.preventDefault();
            setConfirming(true);
          }
          confirmed.current = false;
        }}
      >
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
      <dialog
        ref={dialog}
        className={trainingActivityControlsStyles.confirmation}
        aria-labelledby={`${activity.id}-completion-title`}
        aria-describedby={`${activity.id}-completion-message`}
        onClose={() => setConfirming(false)}
      >
        <div className="grid gap-4">
          <h2 id={`${activity.id}-completion-title`} className="text-lg font-semibold">
            Finalizar treino?
          </h2>
          <p id={`${activity.id}-completion-message`}>
            Há exercícios ou séries incompletos. Deseja voltar ou finalizar com os dados atuais?
          </p>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setConfirming(false)}>
              Voltar
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={submission.pending}
              onClick={() => {
                confirmed.current = true;
                setConfirming(false);
                form.current?.requestSubmit();
              }}
            >
              Finalizar
            </Button>
          </div>
        </div>
      </dialog>
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
