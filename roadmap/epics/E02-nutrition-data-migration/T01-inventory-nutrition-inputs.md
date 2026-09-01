---
id: E02-T01
epic: E02
depends_on: [E01-T06]
---

# Inventariar alimentação e unknowns

## Objetivo

Confirmar quais fontes alimentares existem e quais dados ainda faltam antes de qualquer plano estruturado.

## Entradas

- Arquivos fornecidos pelo usuário.
- Perfil, agenda e carga de treino migrados.

## Entregáveis

- `docs/migration/NUTRITION-INPUT-INVENTORY.md`

## Subtarefas

- [x] Inventariar dieta prescrita e alimentação praticada.
- [x] Separar fatos, estimativas, hipóteses e decisões profissionais.
- [x] Listar dados mínimos ainda ausentes.
- [x] Identificar fontes que não podem ser versionadas.

## Validações

- Nenhum valor nutricional é inferido como fato.
- Toda ausência aparece em `unknowns` ou pendências.

## Critérios de aceite

- [x] Está claro o que pode ser preservado e o que bloqueia a revisão.

## Resultado

O inventário verificou as fontes conhecidas e não encontrou dieta prescrita nem registro da alimentação praticada. Perfil, agenda e plano de treino foram classificados somente como contexto sanitizado. Nenhum valor foi inferido, nenhum artefato foi incluído no manifesto e `E02-T02` permanece bloqueada até uma fonte original ser fornecida e classificada.
