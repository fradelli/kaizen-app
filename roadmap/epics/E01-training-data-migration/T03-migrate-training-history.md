---
id: E01-T03
epic: E01
depends_on: [E01-T02]
---

# Migrar histórico de treino

## Objetivo

Preservar treinos originais, revisões e histórico sem transformar artefatos imutáveis.

## Entradas

- `data/coach-workouts/`, `data/reviews/` e `docs/historico/` do snapshot.

## Entregáveis

- Histórico correspondente no Kaizen.
- SHA-256 de cada cópia literal no manifesto.

## Subtarefas

- [ ] Copiar originais byte a byte.
- [ ] Migrar revisões mantendo a referência à origem.
- [ ] Migrar resumos históricos com proveniência.
- [ ] Confirmar que nenhum mês foi omitido.

## Validações

- Hash de originais é idêntico.
- Cada revisão aponta para um original existente.

## Critérios de aceite

- [ ] Histórico e plano vigente são distinguíveis.
- [ ] O legado continua preservado.

## Resultado

Ainda não concluída.
