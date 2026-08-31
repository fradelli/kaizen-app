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

Cancelada em 2026-08-31 por decisão do proprietário. O `kaizen-app` permanecerá público para facilitar a governança gratuita de CI/CD e regras no GitHub; a exposição de conteúdo passou a ser controlada por allowlist e classificação por artefato.
