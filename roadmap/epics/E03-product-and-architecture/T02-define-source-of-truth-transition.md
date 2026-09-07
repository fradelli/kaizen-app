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

- [x] Definir arquivos como origem da importação inicial.
- [x] Definir quando o banco vira fonte operacional.
- [x] Definir exportação, backup e proveniência.
- [x] Definir política de reimportação e conflito.

## Validações

- Para cada fase existe uma única fonte editável.

## Critérios de aceite

- [x] Leitura, escrita futura e rollback têm ownership inequívoco.

## Resultado

Decidido que Git/JSON permanece a única fonte editável das definições no MVP, enquanto o banco é a fonte exclusiva de atribuições e execuções. Importação unidirecional, imutável e idempotente, conflitos, proveniência, exportação, backup, cutover futuro e rollback foram especificados em `docs/decisions/DATA-SOURCE-TRANSITION.md`.
