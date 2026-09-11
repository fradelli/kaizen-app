import { Alert, AlertDescription, AlertTitle } from "@fradelli/ui/alert";

import { foundationsAlertsSectionStyles } from "./foundations-alerts-section.styles";

export function FoundationsAlertsSection() {
  return (
    <section className={foundationsAlertsSectionStyles.root} aria-label="Estados de comunicação">
      <Alert variant="success">
        <AlertTitle>Sucesso</AlertTitle>
        <AlertDescription>Operação genérica concluída.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Aviso</AlertTitle>
        <AlertDescription>Há uma condição que merece atenção.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Informação</AlertTitle>
        <AlertDescription>Contexto adicional está disponível.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>A operação genérica não foi concluída.</AlertDescription>
      </Alert>
    </section>
  );
}
