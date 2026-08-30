---
id: E00-T04
epic: E00
depends_on: [E00-T03]
---

# Criar sistema de roadmap

## Objetivo

Permitir que humanos e Codex encontrem status, tarefa ativa e detalhes sem carregar todo o projeto.

## Entradas

- Convenções de `AGENTS.md`.
- Épicos e tarefas aprovados.

## Entregáveis

- `roadmap/README.md`
- `roadmap/ACTIVE.md`
- `roadmap/templates/EPIC-TEMPLATE.md`
- `roadmap/templates/TASK-TEMPLATE.md`
- Pastas e arquivos dos épicos E00–E09.

## Subtarefas

- [x] Consolidar todos os status no arquivo pai.
- [x] Criar ponteiro de tarefa ativa.
- [x] Manter subtarefas dentro da tarefa.
- [x] Definir dependências e critérios de aceite.

## Validações

- Todos os IDs são únicos.
- Cada link do índice resolve para um arquivo existente.
- Existe no máximo uma tarefa `IN_PROGRESS`.

## Critérios de aceite

- [x] O progresso global é visível sem abrir tarefas individuais.
- [x] A leitura mínima está documentada.

## Resultado

Concluída em 2026-08-30. O status canônico está em `roadmap/README.md`.
