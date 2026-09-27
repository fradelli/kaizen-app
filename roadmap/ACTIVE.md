# Tarefa selecionada

- **Tarefa:** E06-T22 — Permitir organizar a agenda futura sem iniciar treinos
- **Status:** IN_PROGRESS
- **Branch:** `codex/E06-T22-future-agenda-editing`
- **Entrada principal:** `roadmap/epics/E06-training-execution/T22-allow-future-agenda-editing.md`.
- **Resultado anterior:** E06-T14 integrada pela PR #52; E06-T21 integrada pela PR #54 como planejamento da importação externa.
- **Objetivo:** separar edição da agenda futura de execução antecipada, preservando a janela de hoje até hoje + 4 dias.
- **Autorização:** diagnóstico e plano aprovados pelo usuário em 27/09/2026.
- **Próxima ação:** separar permissões de agenda e execução, cobrir os limites temporais e validar o fluxo futuro.

O usuário aprovou o commit local e a limpeza restrita ao treino no PostgreSQL local após backup. Backup atualizado em 26/09 e restaurado em banco temporário. Reinício da E06-T17 concluído, nova ficha importada e ativada, alimentação preservada. Reimportação retornou no-op; consulta repetida não duplicou atividades e a data além de hoje + 4 não materializou registros.
