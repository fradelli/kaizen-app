---
id: E00-T06
epic: E00
depends_on: [E00-T04]
---

# Adaptar governança de PR e CI/CD

## Objetivo

Adaptar as regras comprovadas do Sandicts ao fluxo local, sem Jira e com aplicação futura somente em Next.js e banco.

## Entradas

- Padrões de PR e CI/CD do Sandicts.
- Branches e roadmap do Kaizen.

## Entregáveis

- Título e template de PR baseados em IDs locais.
- Template de promoção entre ambientes.
- Política progressiva de CI/CD.
- Regras sincronizadas no contrato raiz e nas tarefas futuras.

## Subtarefas

- [x] Substituir Jira pelo ID `E00-T01` sem criar exceção sem rastreamento.
- [x] Preservar seções de problema, causa, impacto, validação e observações.
- [x] Adaptar checks ao Next.js e à integridade dos dados pessoais.
- [x] Separar documentação atual de workflows futuros.
- [x] Atualizar a PR aberta conforme o padrão.

## Validações

- Conferir links, IDs, dependências, templates e diff.

## Critérios de aceite

- [x] Uma PR pode ser compreendida e auditada sem Jira.
- [x] CI/CD possui direção, gates, ambientes e rollback definidos.
- [x] Regras não antecipam workflows durante a fase sem código.

## Resultado

Padrões do Sandicts adaptados ao Kaizen com ID de roadmap obrigatório, template de oito seções, matriz de promoção e checks específicos de Next.js e integridade de dados.
