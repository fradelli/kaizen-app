import { Badge } from "@fradelli/ui/badge";

import { TrainingDateNavigation } from "./components/training-date-navigation/training-date-navigation";
import { trainingDayPageStyles } from "./training-day-page.styles";
import type { TrainingDayPageProps } from "./training-day-page.types";
import { formatTrainingDateLabel } from "./training-day-page.utils";

export function TrainingDayPage({
  dateResolution,
  children,
  controls,
  summary,
}: TrainingDayPageProps) {
  const selectedDate = dateResolution.status === "valid" ? dateResolution.civilDate : null;

  return (
    <section className={trainingDayPageStyles.root} aria-labelledby="training-day-title">
      <header className={trainingDayPageStyles.header}>
        <h1 id="training-day-title" className={trainingDayPageStyles.screenReaderTitle}>
          Treino
        </h1>
        <div className={trainingDayPageStyles.toolbar}>
          <TrainingDateNavigation dateResolution={dateResolution} />
          {controls}
        </div>
        <div className={trainingDayPageStyles.headingRow}>
          <p className={trainingDayPageStyles.date}>
            {selectedDate
              ? formatTrainingDateLabel(selectedDate)
              : "A data informada não é válida."}
          </p>
          {dateResolution.status === "valid" && dateResolution.isToday ? (
            <Badge variant="success">Hoje</Badge>
          ) : null}
        </div>
        {summary}
      </header>
      {children}
    </section>
  );
}
