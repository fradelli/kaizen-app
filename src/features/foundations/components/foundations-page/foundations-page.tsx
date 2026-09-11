import { Separator } from "@fradelli/ui/separator";

import { FoundationsActionsSection } from "./components/foundations-actions-section/foundations-actions-section";
import { FoundationsAlertsSection } from "./components/foundations-alerts-section/foundations-alerts-section";
import { FoundationsColorsSection } from "./components/foundations-colors-section/foundations-colors-section";
import { FoundationsFormSection } from "./components/foundations-form-section/foundations-form-section";
import { FoundationsMotionSection } from "./components/foundations-motion-section/foundations-motion-section";
import { FoundationsPageHeader } from "./components/foundations-page-header/foundations-page-header";
import { FoundationsTypographySection } from "./components/foundations-typography-section/foundations-typography-section";
import { foundationsPageStyles } from "./foundations-page.styles";

export function FoundationsPage() {
  return (
    <div className={foundationsPageStyles.root}>
      <div className={foundationsPageStyles.content}>
        <FoundationsPageHeader />
        <Separator />
        <FoundationsTypographySection />
        <FoundationsActionsSection />
        <FoundationsAlertsSection />
        <FoundationsFormSection />
        <FoundationsColorsSection />
        <FoundationsMotionSection />
      </div>
    </div>
  );
}
