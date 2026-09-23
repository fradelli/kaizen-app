"use client";

import { useEffect, useState } from "react";

import type { UseTrainingActivityTimerInput } from "./use-training-activity-timer.types";

export function useTrainingActivityTimer({
  accumulatedActiveSeconds,
  currentIntervalStartedAt,
}: UseTrainingActivityTimerInput): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!currentIntervalStartedAt) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [currentIntervalStartedAt]);

  const currentSeconds = currentIntervalStartedAt
    ? Math.max(0, Math.floor((now - Date.parse(currentIntervalStartedAt)) / 1000))
    : 0;
  return accumulatedActiveSeconds + currentSeconds;
}
