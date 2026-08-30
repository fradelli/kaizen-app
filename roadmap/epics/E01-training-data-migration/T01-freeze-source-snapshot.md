---
id: E01-T01
epic: E01
depends_on: [E00-T05]
---

# Congelar snapshot de origem

## Objetivo

Escolher um commit limpo e imutável do legado como única base da migração de treino.

## Entradas

- `C:\Users\devel\Projects\personal-performance`.
- Manifesto criado em E00-T05.

## Entregáveis

- Snapshot registrado em `docs/migration/SOURCE-REPOSITORIES.md`.
- Inventário inicial no manifesto.

## Subtarefas

- [ ] Verificar branch, commit, remote e worktree.
- [ ] Consolidar ou excluir explicitamente alterações não rastreadas da origem.
- [ ] Registrar o commit aprovado.
- [ ] Inventariar arquivos candidatos sem copiá-los.

## Validações

- O commit registrado existe e pode ser lido.
- O manifesto não referencia estado ambíguo de worktree.

## Critérios de aceite

- [ ] Existe uma única referência de origem para E01.
- [ ] Todo candidato tem tratamento planejado.

## Resultado

Ainda não concluída.
