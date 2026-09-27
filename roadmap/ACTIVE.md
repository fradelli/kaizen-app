# Tarefa selecionada

- **Tarefa:** E06-T22 — Permitir organizar a agenda futura sem iniciar treinos
- **Status:** READY
- **Branch prevista:** `codex/E06-T22-future-agenda-editing`
- **Entrada principal:** `roadmap/epics/E06-training-execution/T22-allow-future-agenda-editing.md`.
- **Resultado anterior:** E06-T14 integrada pela PR #52; E06-T21 integrada pela PR #54 como planejamento da importação externa.
- **Objetivo:** separar edição da agenda futura de execução antecipada, preservando a janela de hoje até hoje + 4 dias.
- **Bloqueio atual:** nenhum para a análise; a implementação exige diagnóstico e aprovação do plano.
- **Próxima ação:** revisar as permissões atuais da UI, aplicação e servidor e apresentar o plano detalhado antes de implementar.

O usuário aprovou o commit local e a limpeza restrita ao treino no PostgreSQL local após backup. Backup atualizado em 26/09 e restaurado em banco temporário. Reinício da E06-T17 concluído, nova ficha importada e ativada, alimentação preservada. Reimportação retornou no-op; consulta repetida não duplicou atividades e a data além de hoje + 4 não materializou registros.
