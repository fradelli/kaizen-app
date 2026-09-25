---
id: E06-T16
epic: E06
depends_on: [E06-T15, E06-T17]
---

# Validar e importar a nova programação de treino

## Objetivo

Transformar o novo treino fornecido pelo usuário em definições versionadas e
programação semanal válidas, incluindo sessões alternativas sem dia fixo.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `data/plans/2026-08-performance-v2.json`
- `data/schedule.json`
- `data/exercises.json`
- `schemas/training-plan.schema.json`
- `schemas/schedule.schema.json`
- `src/features/plan-definition-import/data/activate-selected-plan-definitions.ts`
- `src/features/training/ui/components/training-day-page/components/training-activity-form/training-activity-form.tsx`

## Entregáveis

- Inventário do novo plano: exercícios, sessões, aquecimentos, horários, durações,
  dias de descanso e opções de reserva; lacunas permanecem explícitas.
- Nova versão canônica sem sobrescrever nem reutilizar indevidamente a antiga.
- Sessões de reserva disponíveis para adição manual no dia, sem atribuição semanal.
- Validação das referências e prévia de uma semana antes da ativação.

## Fora de escopo

- Inventar exercícios, prescrições ou horários ausentes.
- Exercícios combinados, que não são necessários no próximo plano.
- Apagar dados existentes; o reinício controlado anterior é a E06-T17.

## Decisões antes da implementação

- Receber o novo treino e confirmar as lacunas, sobretudo o que será sessão reserva.
- Confirmar ativação após a entrega do novo treino e o reinício autorizado.

## Critérios de aceite

- [ ] O novo plano e a semana passam nas validações de dados e referências.
- [ ] Uma sessão reserva pode ser escolhida manualmente sem aparecer em dias fixos.
- [ ] A ativação não altera definições nem histórico da versão anterior.

## Resultado

Aguardando o novo treino do usuário.
