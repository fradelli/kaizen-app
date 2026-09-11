import { Badge } from "@fradelli/ui/badge";

import { foundationsPageHeaderStyles } from "./foundations-page-header.styles";

export function FoundationsPageHeader() {
  return (
    <header className={foundationsPageHeaderStyles.root}>
      <Badge variant="secondary">@fradelli/ui 0.1.0</Badge>
      <div className={foundationsPageHeaderStyles.copy}>
        <h1 className={foundationsPageHeaderStyles.title}>Foundations</h1>
        <p className={foundationsPageHeaderStyles.description}>
          Smoke test da fundação compartilhada, sem conceitos de domínio do Kaizen.
        </p>
      </div>
    </header>
  );
}
