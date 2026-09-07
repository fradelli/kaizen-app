---
id: E05-T01
epic: E05
depends_on: [E03-T05]
---

# Modelar treino e alimentação

## Objetivo

Modelar somente entidades, relações e constraints exigidas pelo P0.

## Entradas

- `docs/implementation/E05.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `docs/decisions/DATABASE-AND-ORM.md`
- `data/active.json`
- `data/exercises.json`
- `data/nutrition/active.json`

## Entregáveis

- `docs/architecture/DATA-MODEL.md`
- `data/training-execution-metadata.json`
- `schemas/training-execution-metadata.schema.json`

## Subtarefas

- [ ] Mapear IDs, versões, status e proveniência.
- [ ] Modelar definições, ativações, atribuições e execuções de treino e alimentação.
- [ ] Modelar rate limit sem armazenar chave de pareamento ou IP bruto.
- [ ] Definir unicidade e integridade referencial.
- [ ] Classificar medição e aplicabilidade de carga de todo exercício usado, sem default por inferência.
- [ ] Excluir domínios futuros.

## Validações

- Cada campo deriva de dado ou requisito aprovado.

## Critérios de aceite

- [ ] Modelo representa treino e alimentação sem duplicar fontes.

## Resultado

Ainda não concluída.
