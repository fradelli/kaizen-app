# Tarefa selecionada

- **Tarefa:** E06-T23 — Restringir cronômetro ao treino estruturado do dia
- **Status:** READY
- **Branch prevista:** `codex/E06-T23-restrict-training-timer`
- **Entrada principal:** `roadmap/epics/E06-training-execution/T23-restrict-training-timer.md`.
- **Resultado anterior:** E06-T22 implementada na PR #56; agenda local de 28/09 a 01/10 restaurada da programação ativa após backup.
- **Objetivo:** remover cronômetro de futevôlei e outras atividades não estruturadas e permitir execução somente na própria data civil.
- **Bloqueio atual:** implementação aguarda aprovação explícita do plano.
- **Próxima ação:** revisar o plano da E06-T23 com o usuário antes de alterar código.

O usuário aprovou o commit local e a limpeza restrita ao treino no PostgreSQL local após backup. Backup atualizado em 26/09 e restaurado em banco temporário. Reinício da E06-T17 concluído, nova ficha importada e ativada, alimentação preservada. Reimportação retornou no-op; consulta repetida não duplicou atividades e a data além de hoje + 4 não materializou registros.
