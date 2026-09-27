---
id: E06-T16
epic: E06
depends_on: [E06-T15]
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
- Navegação automática entre exercícios combinados, reservada à E06-T18. Nesta entrega, preservar blocos e membros no banco e exibir `Bloco nA/nB`, com navegação manual.
- Apagar dados existentes; o reinício controlado anterior é a E06-T17.

## Decisões antes da implementação

- Receber o novo treino e confirmar as lacunas, sobretudo o que será sessão reserva.
- Confirmar ativação após a entrega do novo treino e o reinício autorizado.

## Critérios de aceite

- [ ] O novo plano e a semana passam nas validações de dados e referências.
- [ ] Uma sessão reserva pode ser escolhida manualmente sem aparecer em dias fixos.
- [ ] A ativação não altera definições nem histórico da versão anterior.

## Resultado

Plano aprovado recebido em 25/09/2026: T1 terça, T2 quinta e T3 sexta às 17h; futevôlei de segunda a quinta, 12h–13h30. Jogos são manuais. Variantes reserva ficam fora desta versão. Os 40 minutos são uma meta não validada e incluem aquecimento.

Definições versionadas, quatro aquecimentos e validação de dados implementados. Importação e ativação local aguardam revisão final e commit da fonte; o reinício da E06-T17 ocorre somente após a nova fonte estar pronta.
