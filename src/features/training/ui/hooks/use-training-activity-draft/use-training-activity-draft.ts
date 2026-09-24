"use client";

import { useEffect, useState } from "react";

import type {
  TrainingActivityExecutionDraft,
  TrainingExerciseExecutionDraft,
  UseTrainingActivityDraftInput,
} from "./use-training-activity-draft.types";
import {
  isTrainingActivityDraft,
  resumePersistedTrainingActivityDraft,
  startTrainingActivityDraft,
  trainingActivityDraftKey,
} from "./use-training-activity-draft.utils";

const DRAFT_EVENT = "kaizen:training-draft-change";

export function useTrainingActivityDraft({ activity, civilDate }: UseTrainingActivityDraftInput) {
  const key = trainingActivityDraftKey(civilDate, activity.id);
  const [draft, setDraft] = useState<TrainingActivityExecutionDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored && activity.status !== "completed" && activity.status !== "skipped") {
          const parsed: unknown = JSON.parse(stored);
          if (
            isTrainingActivityDraft(parsed, activity.id, civilDate) &&
            parsed.expectedRevision === activity.revision
          )
            setDraft(parsed);
          else setDraft(resumePersistedTrainingActivityDraft(activity, civilDate));
        } else if (activity.status !== "completed" && activity.status !== "skipped") {
          setDraft(resumePersistedTrainingActivityDraft(activity, civilDate));
        }
      } catch {
        setDraft(resumePersistedTrainingActivityDraft(activity, civilDate));
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [activity, civilDate, key]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (draft) window.localStorage.setItem(key, JSON.stringify(draft));
      queueMicrotask(() => setStorageError(false));
    } catch {
      queueMicrotask(() => setStorageError(true));
    }
  }, [draft, key, ready]);

  useEffect(() => {
    function updateFromAnotherCard(event: Event) {
      const detail = (event as CustomEvent<{ key: string; draft: TrainingActivityExecutionDraft }>)
        .detail;
      if (detail?.key === key) setDraft(detail.draft);
    }
    window.addEventListener(DRAFT_EVENT, updateFromAnotherCard);
    return () => window.removeEventListener(DRAFT_EVENT, updateFromAnotherCard);
  }, [key]);

  function pauseOtherActivity(): boolean {
    try {
      for (let index = 0; index < window.localStorage.length; index++) {
        const otherKey = window.localStorage.key(index);
        if (!otherKey?.startsWith("kaizen:training-draft:v1:") || otherKey === key) continue;
        const raw = window.localStorage.getItem(otherKey);
        if (!raw) continue;
        const other: unknown = JSON.parse(raw);
        if (
          !other ||
          typeof other !== "object" ||
          (other as TrainingActivityExecutionDraft).status !== "in_progress"
        )
          continue;
        const running = other as TrainingActivityExecutionDraft;
        if (!window.confirm("Há outra atividade em andamento. Pausá-la e iniciar esta?"))
          return false;
        const now = new Date().toISOString();
        const paused: TrainingActivityExecutionDraft = {
          ...running,
          status: "paused",
          intervals: running.intervals.map((interval, intervalIndex) =>
            intervalIndex === running.intervals.length - 1 && interval.endedAt === null
              ? { ...interval, endedAt: now }
              : interval,
          ),
        };
        window.localStorage.setItem(otherKey, JSON.stringify(paused));
        window.dispatchEvent(
          new CustomEvent(DRAFT_EVENT, { detail: { key: otherKey, draft: paused } }),
        );
      }
      return true;
    } catch {
      return false;
    }
  }

  return {
    draft,
    ready,
    storageError,
    start() {
      if (!ready) return false;
      if (!pauseOtherActivity()) return false;
      const next =
        draft ?? startTrainingActivityDraft(activity, civilDate, new Date().toISOString());
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        setStorageError(true);
        return false;
      }
      setDraft(next);
      return true;
    },
    pause() {
      setDraft((current) =>
        current && current.status === "in_progress"
          ? {
              ...current,
              status: "paused",
              intervals: current.intervals.map((interval, index) =>
                index === current.intervals.length - 1 && interval.endedAt === null
                  ? { ...interval, endedAt: new Date().toISOString() }
                  : interval,
              ),
            }
          : current,
      );
    },
    resume() {
      if (!pauseOtherActivity()) return;
      setDraft((current) =>
        current && current.status === "paused"
          ? {
              ...current,
              status: "in_progress",
              intervals: [
                ...current.intervals,
                { startedAt: new Date().toISOString(), endedAt: null },
              ],
            }
          : current,
      );
    },
    updateExercise(key: string, exercise: TrainingExerciseExecutionDraft) {
      setDraft((current) =>
        current
          ? {
              ...current,
              exercises: { ...current.exercises, [key]: exercise },
            }
          : current,
      );
    },
    clear() {
      setDraft(null);
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* Ignore unavailable storage. */
      }
    },
  };
}
