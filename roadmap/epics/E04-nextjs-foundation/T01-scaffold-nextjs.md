---
id: E04-T01
epic: E04
depends_on: [E03-T05, E00-T07]
---

# Criar aplicação Next.js

## Objetivo

Criar o scaffold aprovado sem remover a fundação documental.

## Entradas

- `docs/implementation/tasks/E04-T01.md`

## Entregáveis

- Manifesto, configuração e estrutura Next.js definidos no guia.

## Subtarefas

- [x] Fixar versões e package manager.
- [x] Criar App Router e TypeScript.
- [x] Preservar `data/`, `docs/`, `roadmap/` e `schemas/`.
- [x] Registrar comandos locais.

## Validações

- Instalação, execução local e build passam.

## Critérios de aceite

- [x] Página mínima abre localmente.
- [x] Nenhuma feature antecipada foi criada.

## Resultado

Scaffold Next.js 16.3.4 criado com Node.js 24.20.0, pnpm 11.25.0, React 19.2.8 e TypeScript estrito. Instalação e build passaram, e a página mínima respondeu HTTP 200 localmente sem antecipar features, banco ou autenticação.
