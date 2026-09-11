"use client";

import { Alert, AlertDescription, AlertTitle } from "@fradelli/ui/alert";
import { Badge } from "@fradelli/ui/badge";
import { Button } from "@fradelli/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fradelli/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@fradelli/ui/field";
import { Input } from "@fradelli/ui/input";
import { Separator } from "@fradelli/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@fradelli/ui/sheet";
import { Skeleton } from "@fradelli/ui/skeleton";

export default function FoundationsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col items-start gap-3">
          <Badge variant="secondary">@fradelli/ui 0.1.0</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Foundations</h1>
            <p className="max-w-2xl text-muted-foreground">
              Smoke test da fundação compartilhada, sem conceitos de domínio do Kaizen.
            </p>
          </div>
        </header>

        <Separator />

        <section aria-labelledby="typography-title">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="typography-title">Tipografia e superfícies</h2>
              </CardTitle>
              <CardDescription>
                Inter variável, contraste dark-first e hierarquia visual fornecidos pelo contrato.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Superfície padrão
                </p>
                <p className="mt-2 text-xl font-semibold">Texto de destaque</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Superfície elevada
                </p>
                <p className="mt-2 text-base">Conteúdo secundário legível.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4" aria-labelledby="actions-title">
          <div>
            <h2 id="actions-title" className="text-2xl font-bold">
              Ações e estados
            </h2>
            <p className="text-muted-foreground">
              Variantes genéricas com foco visível e estado desabilitado.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Ação principal</Button>
            <Button variant="secondary">Ação secundária</Button>
            <Button variant="outline">Ação contornada</Button>
            <Button variant="ghost">Ação discreta</Button>
            <Button variant="destructive">Ação destrutiva</Button>
            <Button disabled>Ação indisponível</Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" aria-label="Estados de comunicação">
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

        <section aria-labelledby="form-title">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="form-title">Campos e feedback</h2>
              </CardTitle>
              <CardDescription>
                Rótulo, ajuda e erro permanecem associados ao campo.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="foundation-name">Nome de exemplo</FieldLabel>
                <Input
                  id="foundation-name"
                  aria-describedby="foundation-name-description"
                  placeholder="Digite um texto"
                />
                <FieldDescription id="foundation-name-description">
                  Exemplo neutro sem persistência.
                </FieldDescription>
              </Field>
              <Field data-invalid>
                <FieldLabel htmlFor="foundation-error">Campo com erro</FieldLabel>
                <Input
                  id="foundation-error"
                  aria-describedby="foundation-error-message"
                  aria-invalid
                  defaultValue="Valor inválido"
                />
                <FieldError id="foundation-error-message">Revise o valor informado.</FieldError>
              </Field>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4" aria-labelledby="colors-title">
          <div>
            <h2 id="colors-title" className="text-2xl font-bold">
              Cores categóricas
            </h2>
            <p className="text-muted-foreground">
              Amostras identificadas por texto, sem significado de produto.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Amostras de cor">
            <li className="rounded-md border border-category-yellow-border bg-category-yellow-subtle p-3">
              Amarelo
            </li>
            <li className="rounded-md border border-category-orange-border bg-category-orange-subtle p-3">
              Laranja
            </li>
            <li className="rounded-md border border-category-red-border bg-category-red-subtle p-3">
              Vermelho
            </li>
            <li className="rounded-md border border-category-pink-border bg-category-pink-subtle p-3">
              Rosa
            </li>
            <li className="rounded-md border border-category-purple-border bg-category-purple-subtle p-3">
              Roxo
            </li>
            <li className="rounded-md border border-category-blue-border bg-category-blue-subtle p-3">
              Azul
            </li>
            <li className="rounded-md border border-category-cyan-border bg-category-cyan-subtle p-3">
              Ciano
            </li>
            <li className="rounded-md border border-category-green-border bg-category-green-subtle p-3">
              Verde
            </li>
          </ul>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" aria-labelledby="motion-title">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="motion-title">Carregamento e movimento</h2>
              </CardTitle>
              <CardDescription>
                O skeleton respeita a preferência do sistema por movimento reduzido.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3" aria-label="Exemplo de carregamento">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Abrir painel</Button>
                </SheetTrigger>
                <SheetContent side="right" closeLabel="Fechar painel">
                  <SheetHeader>
                    <SheetTitle>Painel de exemplo</SheetTitle>
                    <SheetDescription>
                      Conteúdo neutro para validar foco, teclado e sobreposição.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="secondary">Concluir</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
