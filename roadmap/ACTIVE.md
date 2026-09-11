# Tarefa ativa

- **Tarefa:** E04-T08 — Integrar Design System versionado
- **Status:** BLOCKED
- **Branch prevista:** `codex/E04-T08-integrate-versioned-design-system`
- **Entrada principal:** `docs/implementation/tasks/E04-T08.md`.
- **Resultado anterior:** E04-T07 comprovou runtime, peers, contrato, gates, CI e rulesets, mas emitiu NO-GO por ausência de autenticação de leitura do package.
- **Objetivo:** integrar `@fradelli/ui@0.1.0` somente depois de uma nova evidência emitir GO.
- **Bloqueio atual:** a consulta local ao GitHub Packages retornou `401` e a credencial usada pela API não possui `read:packages`.
- **Próxima ação:** configurar credencial de leitura no perfil do usuário, fora do repositório, e repetir somente a consulta de metadados de `@fradelli/ui@0.1.0`.

Não iniciar E04-T08 nem instalar packages enquanto o acesso de leitura não for comprovado. Nunca registrar PAT, token, `_authToken`, valor de `NODE_AUTH_TOKEN` ou URL autenticada no Git, em comandos compartilhados ou na evidência.
