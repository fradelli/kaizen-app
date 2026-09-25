---
id: E06-T12
epic: E06
depends_on: [E06-T11]
---

# Refinar edição de atividades do dia

## Objetivo

Garantir que a instância diária possa divergir do template semanal sem alterar a definição recorrente nem perder atividades independentes.

## Contexto conhecido

Na E06-T03 já há inclusão, edição de horário/tipo e exclusão lógica de atividades não concluídas em um drawer. Esta tarefa deve corrigir apenas lacunas confirmadas pela E06-T11, inclusive o caso de materialização parcial, sem recriar o fluxo existente.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `roadmap/epics/E06-training-execution/T11-review-daily-plan-lifecycle.md`
- `prisma/models/training.prisma`
- `src/features/training/data/ensure-scheduled-training-day.ts`
- `src/features/training/data/prisma-training-repository.ts`
- `src/features/training/ui/components/training-day-page/components/training-agenda-drawer/training-agenda-drawer.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-form/training-activity-form.tsx`

## Comportamento esperado

- É possível cancelar um jogo do dia, mover um treino para outro horário e adicionar outra atividade, sem mudar a agenda semanal.
- Origem do plano, alteração manual e exclusão intencional permanecem distinguíveis.
- Atividades concluídas e histórico real não são removidos pela edição do planejamento.
- A data materializa corretamente as atividades restantes mesmo quando já possui inclusão manual, conforme decisão da E06-T11.

## Escopo e impactos

- Ajustar somente mutações, leitura, UI e testes necessários às lacunas comprovadas.
- Verificar ownership, revisão concorrente, preparação vinculada e horários nulos.

## Fora de escopo

- Editor do template semanal ou replanejamento automático por recomendações.

## Decisões antes da implementação

- Reanalisar o código vigente e as decisões da E06-T11, apresentar plano incremental e aguardar aprovação explícita.

## Critérios de aceite

- [ ] Os cenários de cancelamento, troca de horário, inclusão e materialização parcial passam em testes.
- [ ] Alterações diárias não afetam o template nem o passado executado.

## Resultado

Ainda não iniciada.
