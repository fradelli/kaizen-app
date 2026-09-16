import { Badge } from "@fradelli/ui/badge";

import {
  TRAINING_EXECUTION_STATUS_LABELS,
  TRAINING_EXECUTION_STATUS_VARIANTS,
} from "./training-execution-summary.constants";
import { trainingExecutionSummaryStyles } from "./training-execution-summary.styles";
import type { TrainingExecutionSummaryProps } from "./training-execution-summary.types";

export function TrainingExecutionSummary({ execution }: TrainingExecutionSummaryProps) {
  const status = execution?.status ?? "not_started";

  return (
    <aside className={trainingExecutionSummaryStyles.root} aria-label="Resumo da execução">
      <div className={trainingExecutionSummaryStyles.row}>
        <span className={trainingExecutionSummaryStyles.title}>Execução do dia</span>
        <Badge variant={TRAINING_EXECUTION_STATUS_VARIANTS[status]}>
          {TRAINING_EXECUTION_STATUS_LABELS[status]}
        </Badge>
      </div>
      {execution?.comment ? (
        <p className={trainingExecutionSummaryStyles.comment}>{execution.comment}</p>
      ) : null}
    </aside>
  );
}
