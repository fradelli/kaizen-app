"use client";

import { Button } from "@fradelli/ui/button";
import { useEffect, useRef, useState } from "react";

import { useTrainingActionFeedback } from "@/features/training/ui/hooks/use-training-action-feedback";
import { trainingActivityDraftKey } from "@/features/training/ui/hooks/use-training-activity-draft/use-training-activity-draft.utils";
import { TrainingActionFeedback } from "../training-action-feedback/training-action-feedback";
import { trainingActivityDeleteFormStyles } from "./training-activity-delete-form.styles";
import type { TrainingActivityDeleteFormProps } from "./training-activity-delete-form.types";

export function TrainingActivityDeleteForm({
  civilDate,
  activity,
  action,
  compact = false,
  startedLocally = false,
  onDeleted,
}: TrainingActivityDeleteFormProps) {
  const [confirming, setConfirming] = useState(false);
  const [foundLocalDraft, setFoundLocalDraft] = useState(false);
  const confirmationDialog = useRef<HTMLDialogElement>(null);
  const submission = useTrainingActionFeedback(action);

  useEffect(() => {
    const dialog = confirmationDialog.current;
    if (!dialog) return;

    if (confirming && !dialog.open) dialog.showModal();
    if (!confirming && dialog.open) dialog.close();
  }, [confirming]);

  useEffect(() => {
    if (submission.state.status === "saved") {
      try {
        window.localStorage.removeItem(trainingActivityDraftKey(civilDate, activity.id));
      } catch {
        // A deleted activity is no longer shown even if browser storage is unavailable.
      }
      onDeleted?.();
    }
  }, [activity.id, civilDate, onDeleted, submission.state.status]);

  if (activity.status === "completed") return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={compact ? "icon" : "sm"}
        aria-label="Excluir atividade"
        onClick={() => {
          try {
            setFoundLocalDraft(
              Boolean(
                window.localStorage.getItem(trainingActivityDraftKey(civilDate, activity.id)),
              ),
            );
          } catch {
            setFoundLocalDraft(false);
          }
          setConfirming(true);
        }}
      >
        {compact ? "🗑" : "Excluir"}
      </Button>
      <dialog
        ref={confirmationDialog}
        aria-labelledby={`delete-activity-title-${activity.id}`}
        aria-describedby={`delete-activity-description-${activity.id}`}
        className={trainingActivityDeleteFormStyles.confirmation}
        onClose={() => setConfirming(false)}
      >
        <div className={trainingActivityDeleteFormStyles.header}>
          <h2
            id={`delete-activity-title-${activity.id}`}
            className={trainingActivityDeleteFormStyles.title}
          >
            Excluir atividade?
          </h2>
        </div>
        <form action={submission.formAction} className={trainingActivityDeleteFormStyles.form}>
          <input type="hidden" name="civilDate" value={civilDate} />
          <input type="hidden" name="activityId" value={activity.id} />
          <input type="hidden" name="expectedRevision" value={activity.revision} />
          <p
            id={`delete-activity-description-${activity.id}`}
            className={trainingActivityDeleteFormStyles.message}
            role="alert"
          >
            {activity.status === "scheduled" && !startedLocally && !foundLocalDraft
              ? "Ela será removida da agenda deste dia."
              : "A atividade já começou. Excluí-la descarta o rascunho e a remove da agenda."}
          </p>
          <div className={trainingActivityDeleteFormStyles.actions}>
            <Button type="button" size="sm" onClick={() => setConfirming(false)}>
              Manter atividade
            </Button>
            <Button type="submit" variant="outline" size="sm" disabled={submission.pending}>
              Excluir atividade
            </Button>
          </div>
          <TrainingActionFeedback state={submission.state} pending={submission.pending} />
        </form>
      </dialog>
    </>
  );
}
