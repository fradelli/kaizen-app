---
id: E03-T02
epic: E03
depends_on: [E03-T01]
---

# Definir transição da fonte de verdade

## Objetivo

Evitar duas fontes editáveis ao introduzir banco de dados.

## Entradas

- Dados versionados e jornadas do P0.

## Entregáveis

- `docs/decisions/DATA-SOURCE-TRANSITION.md`

## Subtarefas

- [ ] Definir arquivos como origem da importação inicial.
- [ ] Definir quando o banco vira fonte operacional.
- [ ] Definir exportação, backup e proveniência.
- [ ] Definir política de reimportação e conflito.

## Validações

- Para cada fase existe uma única fonte editável.

## Critérios de aceite

- [ ] Leitura, escrita futura e rollback têm ownership inequívoco.

## Resultado

Ainda não concluída.
