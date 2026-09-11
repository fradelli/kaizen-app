import { Badge } from "@fradelli/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <Card className={styles.card} aria-labelledby="kaizen-title">
        <CardHeader>
          <Badge variant="secondary">Fundação</Badge>
          <CardTitle>
            <h1 id="kaizen-title">Kaizen</h1>
          </CardTitle>
          <CardDescription>
            A nova aplicação de dieta e treino está pronta para evoluir por incrementos.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
