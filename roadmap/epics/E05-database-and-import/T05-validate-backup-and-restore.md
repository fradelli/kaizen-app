---
id: E05-T05
epic: E05
depends_on: [E05-T04]
---

# Validar backup e restauração

## Objetivo

Demonstrar recuperação dos dados em PostgreSQL local antes de depender de um provedor gerenciado.

## Entradas

- `docs/implementation/E05.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`
- `compose.yaml`
- `prisma/schema.prisma`
- `prisma/models/platform.prisma`
- `prisma/models/training.prisma`
- `prisma/models/nutrition.prisma`
- `prisma/migrations/20260913011504_initial_p0/migration.sql`
- `.env.example`
- `package.json`
- `.github/workflows/ci.yml`
- `.github/pull_request_template.md`
- `scripts/import-versioned-plan-definitions.ts`
- `scripts/validate-persisted-data.ts`
- `src/lib/db/test-database-configuration.types.ts`
- `src/lib/db/test-database-configuration.utils.ts`
- `src/features/plan-definition-import/data/read-plan-definitions-from-git.ts`
- `src/features/persisted-data-integrity/application/validate-persisted-data.ts`
- `src/features/persisted-data-integrity/data/prisma-persisted-data-reader.ts`
- `tests/integration/database.setup.ts`
- `tests/integration/fixtures/database.fixture.ts`
- `tests/integration/fixtures/import-database.fixture.ts`
- `vitest.integration.config.ts`
- `roadmap/ACTIVE.md`
- `roadmap/README.md`
- `CHANGELOG.md`

## Entregáveis

- `docs/operations/BACKUP-AND-RESTORE.md`
- Evidência de teste de restauração.

## Subtarefas

- [ ] Executar `pg_dump` no PostgreSQL local de origem.
- [ ] Restaurar com `pg_restore` em outro PostgreSQL local descartável.
- [ ] Validar contagens, IDs e versão ativa.
- [ ] Registrar duração, limitações e evidência; RPO/RTO gerenciado pertence a E08.
- [ ] Isolar origem e destino em containers descartáveis sem tocar volumes existentes.
- [ ] Automatizar o fluxo e sua limpeza com erros sanitizados.
- [ ] Executar a prova em job dedicado da CI.

## Validações

- Restore local produz banco utilizável e íntegro.
- Nenhuma conta, branch ou credencial Neon é necessária nesta tarefa.

## Critérios de aceite

- [ ] Procedimento local é repetível e não expõe credenciais.

## Resultado

Ainda não concluída.
