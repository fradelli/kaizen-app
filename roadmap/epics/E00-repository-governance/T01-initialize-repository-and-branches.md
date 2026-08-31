---
id: E00-T01
epic: E00
depends_on: []
---

# Inicializar repositório e branches

## Objetivo

Criar o clone local, o commit-base e as branches necessárias ao fluxo de promoção.

## Entradas

- `https://github.com/fradelli/kaizen-app`
- Credencial GitHub com permissão administrativa.

## Entregáveis

- Clone local criado e vinculado ao remote canônico.
- Branches remotas `developer`, `staging` e `master`.
- `developer` como branch padrão.

## Subtarefas

- [x] Clonar o repositório vazio.
- [x] Criar e publicar um commit-base vazio.
- [x] Criar e publicar as três branches.
- [x] Definir `developer` como padrão.

## Validações

- `git branch -a` lista as três branches.
- `gh repo view` retorna `developer` como branch padrão.

## Critérios de aceite

- [x] Branches remotas publicadas no mesmo commit-base.
- [x] Feature branch criada a partir de `developer`.

## Resultado

Concluída em 2026-08-30. Commit-base `6fb1f02`; branch de trabalho `codex/roadmap-foundation` criada a partir de `developer`.
