import { Badge } from "@fradelli/ui/badge";

import {
  TRAINING_SET_STATUS_LABELS,
  TRAINING_SET_STATUS_VARIANTS,
} from "./training-set-row.constants";
import { trainingSetRowStyles } from "./training-set-row.styles";
import type { TrainingSetRowProps } from "./training-set-row.types";
import { formatTrainingSetLoad, formatTrainingSetResult } from "./training-set-row.utils";

export function TrainingSetRow({
  set,
  measurementType,
  loadApplicable,
  loadUnit,
}: TrainingSetRowProps) {
  return (
    <li className={trainingSetRowStyles.root}>
      <span className={trainingSetRowStyles.number}>Série {set.setNumber}</span>
      <div>
        <p className={trainingSetRowStyles.result}>
          {formatTrainingSetResult(set, measurementType)}
        </p>
        {loadApplicable ? (
          <p className={trainingSetRowStyles.load}>{formatTrainingSetLoad(set, loadUnit)}</p>
        ) : null}
      </div>
      <div className={trainingSetRowStyles.badges}>
        <Badge variant={TRAINING_SET_STATUS_VARIANTS[set.status]}>
          {TRAINING_SET_STATUS_LABELS[set.status]}
        </Badge>
      </div>
    </li>
  );
}
