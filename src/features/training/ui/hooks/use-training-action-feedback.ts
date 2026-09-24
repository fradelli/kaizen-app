"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { TrainingActionState, TrainingFormAction } from "../training-action.types";

const initialState: TrainingActionState = { status: "idle" };

export function useTrainingActionFeedback(action: TrainingFormAction) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "saved") router.refresh();
  }, [router, state]);

  return { state, formAction, pending };
}
