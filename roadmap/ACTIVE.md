# Tarefa ativa

- **Tarefa:** E01-T01 — Congelar snapshot de origem
- **Status:** READY
- **Entrada principal:** `docs/migration/SOURCE-REPOSITORIES.md`
- **Condição conhecida:** o worktree do legado contém alterações ainda não consolidadas em um commit.
- **Próximo passo:** decidir quais alterações documentais pertencem ao snapshot e registrar um único commit imutável.
- **Depois:** inventariar os artefatos candidatos no manifesto sem copiá-los.

Não usar o commit-base observado como snapshot final nem migrar conteúdo antes da classificação por artefato.
