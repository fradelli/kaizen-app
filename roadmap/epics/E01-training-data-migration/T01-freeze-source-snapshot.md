---
id: E01-T01
epic: E01
depends_on: [E00-T05]
---

# Congelar snapshot de origem

## Objetivo

Escolher um commit limpo e imutável do legado como única base da migração de treino.

## Entradas

- Fonte lógica `personal-performance` registrada em `docs/migration/SOURCE-REPOSITORIES.md`.
- Manifesto criado em E00-T05.

## Entregáveis

- Snapshot registrado em `docs/migration/SOURCE-REPOSITORIES.md`.
- Inventário inicial no manifesto.

## Subtarefas

- [x] Verificar branch, commit, remote e worktree.
- [x] Consolidar ou excluir explicitamente alterações não rastreadas da origem.
- [x] Registrar o commit e a tag aprovados.
- [x] Inventariar arquivos candidatos sem copiá-los.

## Validações

- O commit registrado existe e pode ser lido.
- O manifesto não referencia estado ambíguo de worktree.

## Critérios de aceite

- [x] Existe uma única referência de origem para E01.
- [x] Todo candidato tem hash, tratamento e exposição.
- [x] Nenhum conteúdo do legado foi criado no destino.

## Resultado

Concluída em 2026-08-31. O commit privado `d1acad309e2b81b714d1aa375e9371a310ad6ed0`, publicado na tag `kaizen-training-source-v1`, é a única origem de E01. O manifesto contém 23 artefatos calculados dos blobs desse commit e nenhuma cópia no Kaizen.
