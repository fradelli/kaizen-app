"use client";

import { Button } from "@fradelli/ui/button";
import { Input } from "@fradelli/ui/input";
import { useState } from "react";

import { useTrainingActionFeedback } from "@/features/training/ui/hooks/use-training-action-feedback";
import { TrainingActionFeedback } from "../training-action-feedback/training-action-feedback";
import { trainingActivityFormStyles } from "./training-activity-form.styles";
import type { TrainingActivityFormProps } from "./training-activity-form.types";

export function TrainingActivityForm({
  civilDate,
  action,
  activity,
  availablePlan,
}: TrainingActivityFormProps) {
  const submission = useTrainingActionFeedback(action);
  const [type, setType] = useState(activity?.type ?? "sport_practice");
  const needsSport = type === "sport_practice" || type === "specific_training";
  const structuredSessions =
    availablePlan?.sessions.filter((session) => session.assignmentRole === "main") ?? [];
  const currentSessionId = activity?.structured?.main.sessionId ?? structuredSessions[0]?.sessionId;

  return (
    <form action={submission.formAction} className={trainingActivityFormStyles.root}>
      <input type="hidden" name="civilDate" value={civilDate} />
      {activity ? (
        <>
          <input type="hidden" name="activityId" value={activity.id} />
          <input type="hidden" name="expectedRevision" value={activity.revision} />
        </>
      ) : null}
      <div className={trainingActivityFormStyles.grid}>
        <div className={trainingActivityFormStyles.field}>
          <label
            className={trainingActivityFormStyles.label}
            htmlFor={`activity-type-${activity?.id ?? "new"}`}
          >
            Tipo de atividade
          </label>
          <select
            id={`activity-type-${activity?.id ?? "new"}`}
            name="type"
            className={trainingActivityFormStyles.control}
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
          >
            <option value="structured_training">Treino do plano</option>
            <option value="sport_practice">Prática esportiva</option>
            <option value="specific_training">Treino específico</option>
            <option value="mobility">Mobilidade</option>
          </select>
        </div>
        {type === "structured_training" ? (
          <div className={trainingActivityFormStyles.field}>
            <label
              className={trainingActivityFormStyles.label}
              htmlFor={`activity-session-${activity?.id ?? "new"}`}
            >
              Treino
            </label>
            <select
              id={`activity-session-${activity?.id ?? "new"}`}
              name="sessionId"
              defaultValue={currentSessionId}
              className={trainingActivityFormStyles.control}
              required
            >
              {structuredSessions.map((session) => (
                <option key={session.sessionId} value={session.sessionId}>
                  {session.name}
                </option>
              ))}
            </select>
            <input type="hidden" name="name" value="Treino do plano" />
          </div>
        ) : (
          <input type="hidden" name="sessionId" value="" />
        )}
        {type !== "structured_training" ? (
          <div className={trainingActivityFormStyles.field}>
            <label
              className={trainingActivityFormStyles.label}
              htmlFor={`activity-name-${activity?.id ?? "new"}`}
            >
              Nome
            </label>
            <Input
              id={`activity-name-${activity?.id ?? "new"}`}
              name="name"
              defaultValue={activity?.name ?? ""}
              maxLength={120}
              placeholder="Ex.: Jogo de sábado"
              required
            />
          </div>
        ) : null}
        {needsSport ? (
          <div className={trainingActivityFormStyles.field}>
            <label
              className={trainingActivityFormStyles.label}
              htmlFor={`activity-sport-${activity?.id ?? "new"}`}
            >
              Esporte
            </label>
            <Input
              id={`activity-sport-${activity?.id ?? "new"}`}
              name="sport"
              defaultValue={activity?.sport ?? ""}
              maxLength={80}
              placeholder="Ex.: Futevôlei"
              required
            />
          </div>
        ) : (
          <input type="hidden" name="sport" value="" />
        )}
        <div className={trainingActivityFormStyles.field}>
          <label
            className={trainingActivityFormStyles.label}
            htmlFor={`activity-start-time-${activity?.id ?? "new"}`}
          >
            Início planejado
          </label>
          <Input
            id={`activity-start-time-${activity?.id ?? "new"}`}
            name="plannedStartTime"
            type="time"
            defaultValue={activity?.plannedStartTime ?? ""}
            required
          />
        </div>
        <div className={trainingActivityFormStyles.field}>
          <label
            className={trainingActivityFormStyles.label}
            htmlFor={`activity-end-time-${activity?.id ?? "new"}`}
          >
            Fim planejado
          </label>
          <Input
            id={`activity-end-time-${activity?.id ?? "new"}`}
            name="plannedEndTime"
            type="time"
            defaultValue={activity?.plannedEndTime ?? ""}
            required
          />
        </div>
      </div>
      <div className={trainingActivityFormStyles.actions}>
        <Button type="submit" disabled={submission.pending}>
          {activity ? "Salvar alterações" : "Adicionar atividade"}
        </Button>
        <TrainingActionFeedback state={submission.state} pending={submission.pending} />
      </div>
    </form>
  );
}
