# Tarefa ativa

- **Tarefa:** E04-T03 — Criar fronteira server-only
- **Status:** READY
- **Branch prevista:** `codex/E04-T03-create-server-only-boundary`
- **Entrada principal:** `docs/implementation/tasks/E04-T03.md`.
- **Resultado anterior:** E04-T02 configurou os gates locais e E04-T06 registrou a adoção documental do Design System compartilhado.
- **Objetivo:** impedir que dados, segredos e regras privilegiadas vazem para o cliente.
- **Entregável:** boundary server-only, validação mínima de ambiente e workspace fixo definidos no pacote da tarefa.
- **Depois:** liberar e selecionar E04-T05 para configurar o CI antes da prontidão e integração visual.

O pacote de E04-T03 é autocontido. Preserve a integração documental do Design System, não antecipe banco, autenticação completa, shell, CI ou features, e comprove que imports client-side não alcançam ambiente, segurança ou dados server-only.
