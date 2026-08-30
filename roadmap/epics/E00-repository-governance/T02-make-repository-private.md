---
id: E00-T02
epic: E00
depends_on: []
---

# Tornar o repositório privado

## Objetivo

Impedir exposição pública dos dados pessoais que serão migrados nos épicos seguintes.

## Entradas

- Configuração de visibilidade de `fradelli/kaizen-app` no GitHub.

## Entregáveis

- Repositório com visibilidade `PRIVATE` confirmada.

## Subtarefas

- [ ] Alterar a visibilidade no GitHub.
- [ ] Confirmar acessos necessários.
- [ ] Verificar a visibilidade com `gh repo view`.

## Validações

- `gh repo view fradelli/kaizen-app --json isPrivate` retorna `true`.

## Critérios de aceite

- [ ] O repositório não é acessível publicamente.
- [ ] A migração de dados pessoais pode ser desbloqueada.

## Resultado

Bloqueada: o repositório permanecia público durante a criação do roadmap.
