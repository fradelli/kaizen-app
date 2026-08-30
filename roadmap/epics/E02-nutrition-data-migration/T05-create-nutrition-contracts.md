---
id: E02-T05
epic: E02
depends_on: [E02-T04]
---

# Criar ponteiro, schema e guia

## Objetivo

Tornar o plano alimentar vigente localizável, validável e compreensível sem transformá-lo em código.

## Entradas

- Plano estruturado de E02-T04.

## Entregáveis

- `data/nutrition/active.json`
- `schemas/nutrition-plan.schema.json`
- `docs/guides/NUTRITION.md`

## Subtarefas

- [ ] Criar ponteiro inequívoco para versão vigente.
- [ ] Criar contrato mínimo e permissivo.
- [ ] Criar guia derivado com proveniência.
- [ ] Documentar limites e atualização.

## Validações

- Ponteiro resolve e ID coincide.
- Plano valida contra o schema.
- Guia não diverge dos dados.

## Critérios de aceite

- [ ] Consumidor read-only consegue localizar e interpretar o plano.

## Resultado

Ainda não concluída.
