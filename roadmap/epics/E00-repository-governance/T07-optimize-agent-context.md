---
id: E00-T07
epic: E00
depends_on: [E03-T05]
---

# Otimizar contexto e sanear dependências pré-MVP

## Objetivo

Reduzir leituras desnecessárias do Codex e tornar a sequência E04–E08 executável sem dependências implícitas.

## Entradas

- `AGENTS.md`
- `roadmap/README.md`
- `roadmap/ACTIVE.md`
- `docs/implementation/P0-IMPLEMENTATION-GUIDE.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`

## Entregáveis

- Instruções segmentadas por árvore.
- Guia de implementação modular e tarefas com entradas exatas.
- Ordem corrigida para autorização, backup local e Neon.
- Nomes e checklists coerentes com o P0 operacional.

## Subtarefas

- [x] Reduzir o contrato raiz e criar instruções especializadas.
- [x] Separar a implementação em pacotes pequenos por tarefa ou épico.
- [x] Antecipar sessão e autorização para antes de E06/E07.
- [x] Limitar E05-T05 ao restore local e manter Neon em E08.
- [x] Normalizar nomes, checklists, entradas, links e índices.

## Validações

- Medir a rota mínima de leitura de E04-T01 antes e depois.
- Validar Markdown, JSON, schemas, IDs, dependências e estados.
- Confirmar ausência de código, dependências, workflows e segredos.

## Critérios de aceite

- [x] E04-T01 é autocontida e pode começar sem ler o guia inteiro.
- [x] Nenhuma feature operacional antecede sua autorização.
- [x] Nenhuma tarefa exige Neon antes de sua configuração.

## Resultado

Contrato do agente segmentado, guia modularizado, tarefas futuras com entradas exatas e sequência de segurança/infraestrutura corrigida. A rota mínima de E04-T01 caiu de 4.801 para 1.761 palavras, redução aproximada de 63%. O saneamento permanece exclusivamente documental e mantém E04-T01 como próximo incremento de código.
