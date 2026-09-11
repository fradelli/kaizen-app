import { Badge } from "@fradelli/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";

export default function DietPage() {
  return (
    <section className="grid min-h-[60svh] place-items-center" aria-labelledby="diet-title">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Badge variant="secondary">Estrutura inicial</Badge>
          <CardTitle>
            <h1 id="diet-title" className="text-2xl font-bold">
              Dieta
            </h1>
          </CardTitle>
          <CardDescription>
            A estrutura desta área está pronta. Os dados e registros de alimentação serão
            implementados na E07.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
