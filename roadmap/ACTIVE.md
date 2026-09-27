# Tarefa selecionada

- **Tarefa:** E06-T16 — Validar e importar a nova programação de treino
- **Status:** IN_PROGRESS
- **Branch:** `codex/E06-T11-new-training-program`
- **Entrada principal:** `roadmap/epics/E06-training-execution/T16-import-new-training-program.md`.
- **Resultado anterior:** E06-T03 integrada em `developer` pela PR #48.
- **Objetivo:** entregar o plano aprovado em 25/09, com semana genérica, aquecimentos e blocos A/B preservados.
- **Autorização:** commit local e importação aprovados pelo usuário; sem push nem PR.
- **Próxima ação:** terminar testes de integração e revisar o diff; então importar somente a ficha ativa após o reinício recuperável da E06-T17.

O usuário aprovou a implementação e a limpeza restrita ao treino no PostgreSQL local após backup. O backup já foi restaurado em um banco temporário; a exclusão dos registros principais ainda não foi executada.
