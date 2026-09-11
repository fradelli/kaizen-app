# Tarefa ativa

- **Tarefa:** E04-T05 — Configurar CI mínimo
- **Status:** IN_PROGRESS
- **Branch prevista:** `codex/E04-T05-configure-minimal-ci`
- **Entrada principal:** `docs/implementation/tasks/E04-T05.md`.
- **Resultado anterior:** E04-T03 criou a fronteira server-only, validou o ambiente mínimo e comprovou o bloqueio de imports client-side.
- **Objetivo:** implementar os gates estáveis aprovados para pull requests e promoções.
- **Entregável:** workflow reutilizável de PR, validação de governança e proteção das branches definidas no pacote da tarefa.
- **Depois:** liberar E04-T07 para validar a prontidão técnica do Design System compartilhado.

O pacote de E04-T05 é autocontido. Preserve os gates locais e a fronteira server-only, não configure credenciais do GitHub Packages antes de E04-T08 e mantenha Tailwind, fontes, componentes e features fora do escopo.
