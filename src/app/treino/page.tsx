import { Badge } from "@fradelli/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";

export default function TrainingPage() {
  return (
    <section className="grid min-h-[60svh] place-items-center" aria-labelledby="training-title">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Badge variant="secondary">Estrutura inicial</Badge>
          <CardTitle>
            <h1 id="training-title" className="text-2xl font-bold">
              Treino
            </h1>
          </CardTitle>
          <CardDescription>
            A estrutura desta área está pronta. Os dados e registros de treino serão implementados
            na E06.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
