# Tarefa selecionada

- **Tarefa:** E06-T23 — Separar execução guiada de registro retrospectivo
- **Status:** READY
- **Branch prevista:** `codex/E06-T23-restrict-training-timer`
- **Entrada principal:** `roadmap/epics/E06-training-execution/T23-restrict-training-timer.md`.
- **Resultado anterior:** E06-T22 implementada na PR #56; agenda local de 28/09 a 01/10 restaurada da programação ativa após backup.
- **Objetivo:** manter cronômetro apenas no treino estruturado do dia e permitir registrar atividades externas depois, sem início, horário real ou aquecimento obrigatório.
- **Bloqueio atual:** a E06-T22 está implementada e aprovada na PR #56, mas ainda não foi integrada em `developer`.
- **Próxima ação:** integrar a PR #56 e então implementar a E06-T23; depois seguir E06-T24, E06-T07 e E06-T05 antes de iniciar E07-T01.

O usuário aprovou o commit local e a limpeza restrita ao treino no PostgreSQL local após backup. Backup atualizado em 26/09 e restaurado em banco temporário. Reinício da E06-T17 concluído, nova ficha importada e ativada, alimentação preservada. Reimportação retornou no-op; consulta repetida não duplicou atividades e a data além de hoje + 4 não materializou registros.
