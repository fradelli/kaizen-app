---
id: E06-T23
epic: E06
depends_on: [E06-T12]
---

# Registrar futevôlei e atividades externas retrospectivamente

## Escopo implementado

Registro direto de práticas esportivas e treinos específicos em hoje e ontem,
sem cronômetro, horários reais ou aquecimento obrigatório. Preparação opcional
consultável; formulário de registro somente no fim do cartão expandido.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/app/treino/training-actions.ts`
- `src/features/training/application/mutate-training-day.ts`
- `src/features/training/application/training-mutation.types.ts`
- `src/features/training/data/prisma-training-repository.ts`
- `src/features/training/domain/training-retrospective-record.rules.ts`
- `src/features/training/ui/components/training-day-page/components/training-activity-card/training-activity-card.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-controls/training-activity-controls.tsx`
- `prisma/migrations/20261004120000_allow_retrospective_external_activity/migration.sql`
- `tests/integration/training-mutations.test.ts`

## Aceite e resultado

- [x] Registro sem execução guiada; horários desconhecidos permanecem ausentes.
- [x] Aquecimento opcional visível, sem bloquear o registro.
- [x] Registro oculto no cartão recolhido e na última posição quando expandido.
- [x] Workspace fixo, ownership, revisão e bloqueio de conclusão futura preservados.
- [x] Migration aditiva aplicada no PostgreSQL local em 04/10/2026.
- [ ] Integrações PostgreSQL e checks da PR aprovados.

Implementação autorizada e revisada pelo usuário na conversa. Atualização de
`developer` com a E06-T22 incorporada sem ampliar a janela retrospectiva.
Integrações pendentes em 12/10/2026: serviço Docker indisponível. A tarefa permanece
aberta até essa validação; nenhum documento de planejamento acompanha a entrega.
