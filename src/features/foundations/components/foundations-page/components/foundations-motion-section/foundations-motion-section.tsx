import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";
import { Skeleton } from "@fradelli/ui/skeleton";

import { FoundationsSheetExample } from "../foundations-sheet-example/foundations-sheet-example";
import { foundationsMotionSectionStyles } from "./foundations-motion-section.styles";

export function FoundationsMotionSection() {
  return (
    <section className={foundationsMotionSectionStyles.root} aria-labelledby="motion-title">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="motion-title">Carregamento e movimento</h2>
          </CardTitle>
          <CardDescription>
            O skeleton respeita a preferência do sistema por movimento reduzido.
          </CardDescription>
        </CardHeader>
        <CardContent
          className={foundationsMotionSectionStyles.skeletons}
          aria-label="Exemplo de carregamento"
        >
          <Skeleton className={foundationsMotionSectionStyles.skeletonWide} />
          <Skeleton className={foundationsMotionSectionStyles.skeletonNarrow} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Painel acessível</h2>
          </CardTitle>
          <CardDescription>Primitive interativa com título e descrição.</CardDescription>
        </CardHeader>
        <CardContent>
          <FoundationsSheetExample />
        </CardContent>
      </Card>
    </section>
  );
}
