import { Button } from "@fradelli/ui/button";
import Link from "next/link";

import { trainingDateNavigationStyles } from "./training-date-navigation.styles";
import type { TrainingDateNavigationProps } from "./training-date-navigation.types";
import { createTrainingDateHref } from "./training-date-navigation.utils";

export function TrainingDateNavigation({ dateResolution }: TrainingDateNavigationProps) {
  if (dateResolution.status === "invalid") {
    return (
      <nav className={trainingDateNavigationStyles.root} aria-label="Navegação entre datas">
        <Button className={trainingDateNavigationStyles.button} variant="outline" disabled>
          Anterior
        </Button>
        <Button className={trainingDateNavigationStyles.button} asChild>
          <Link href={createTrainingDateHref(dateResolution.todayDate)}>Hoje</Link>
        </Button>
        <Button className={trainingDateNavigationStyles.button} variant="outline" disabled>
          Seguinte
        </Button>
      </nav>
    );
  }

  return (
    <nav className={trainingDateNavigationStyles.root} aria-label="Navegação entre datas">
      <Button className={trainingDateNavigationStyles.button} variant="outline" asChild>
        <Link
          href={createTrainingDateHref(dateResolution.previousDate)}
          aria-label="Abrir dia anterior"
        >
          Anterior
        </Link>
      </Button>
      <Button
        className={trainingDateNavigationStyles.button}
        variant={dateResolution.isToday ? "secondary" : "default"}
        asChild
      >
        <Link
          href={createTrainingDateHref(dateResolution.todayDate)}
          aria-current={dateResolution.isToday ? "date" : undefined}
        >
          Hoje
        </Link>
      </Button>
      <Button className={trainingDateNavigationStyles.button} variant="outline" asChild>
        <Link
          href={createTrainingDateHref(dateResolution.nextDate)}
          aria-label="Abrir dia seguinte"
        >
          Seguinte
        </Link>
      </Button>
    </nav>
  );
}
