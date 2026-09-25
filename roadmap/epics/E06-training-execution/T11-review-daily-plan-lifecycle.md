---
id: E06-T11
epic: E06
depends_on: [E06-T03]
---

# Revisar o ciclo de vida do plano diário

## Objetivo

Documentar e decidir as regras de geração, navegação e persistência do dia antes de alterar sua implementação.

## Contexto conhecido

A E06-T03 guarda a agenda semanal na versão do plano e materializa somente a data consultada, em transação, de hoje até hoje + 4 dias. Não há entidade denominada `DailyPlan`; a data é composta por atribuição e atividades. A existência prévia de qualquer atividade ou atribuição impede nova materialização. Confirmar o comportamento no código vigente após o merge.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `data/schedule.json`
- `prisma/models/training.prisma`
- `src/features/training/application/get-training-day.ts`
- `src/features/training/application/resolve-training-day-date.ts`
- `src/features/training/data/ensure-scheduled-training-day.ts`
- `src/app/treino/page.tsx`
- `src/features/training/data/prisma-training-repository.ts`

## Entregáveis e impactos

- Fluxo atual comprovado: template semanal, acesso ao dia, criação, persistência, proteção contra duplicação e retorno à UI.
- Decisão entre leitura futura sem persistência, limite de navegação ou outra solução simples; não mudar arbitrariamente o limite atual.
- Regra para dia parcialmente criado, inclusive atividade manual adicionada antes da primeira materialização, exclusão intencional e descanso.
- Decisão de feedback de carregamento mobile quando houver geração perceptível.
- Casos de concorrência, fuso `America/Sao_Paulo`, limites do passado e do futuro.

## Fora de escopo

- Implementar outra estratégia antes da aprovação ou pré-gerar mês inteiro.
- Limpar dados operacionais ou importar uma nova programação semanal.

## Decisões antes da implementação

- Aprovar a política de leitura/persistência e o limite futuro; qualquer tarefa de código derivada requer nova análise e aprovação.

## Critérios de aceite

- [ ] O fluxo real está documentado sem supor um `DailyPlan` inexistente.
- [ ] Decisões de navegação, materialização parcial e feedback estão explícitas.
- [ ] Lacunas foram decompostas para E06-T12 e E06-T13 sem implementar código nesta tarefa.

## Resultado

Ainda não iniciada.
