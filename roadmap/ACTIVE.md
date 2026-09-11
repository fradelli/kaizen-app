# Tarefa ativa

- **Tarefa:** E04-T07 — Validar prontidão técnica para o Design System
- **Status:** IN_PROGRESS
- **Branch prevista:** `codex/E04-T07-validate-design-system-readiness`
- **Entrada principal:** `docs/implementation/tasks/E04-T07.md`.
- **Resultado anterior:** E04-T05 entregou CI verde e rulesets ativos; E04-T06 registrou a adoção de `@fradelli/ui@0.1.0`.
- **Objetivo:** emitir GO/NO-GO sem instalar o package, comprovando runtime, peers, contrato, gates, CI e autenticação segura.
- **Entregável:** `docs/implementation/evidence/E04-T07-DESIGN-SYSTEM-READINESS.md` com matriz, resultados, gaps e decisão.
- **Bloqueio atual:** autenticação local de leitura do GitHub Packages não comprovada; a consulta retornou `401` sem token disponível.
- **Depois:** repetir a consulta autenticada fora do repositório e publicar a PR para validar os seis gates remotos.

Não instalar `@fradelli/ui`, Tailwind, PostCSS ou fontes nesta tarefa. Não alterar manifesto, lockfile, CSS, layout, componentes ou workflow e nunca registrar credenciais no Git ou na evidência.
