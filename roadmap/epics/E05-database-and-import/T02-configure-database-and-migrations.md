---
id: E05-T02
epic: E05
depends_on: [E04-T03, E05-T01]
---

# Configurar banco e migrations

## Objetivo

Configurar o banco e o ORM aprovados com migrations reproduzíveis.

## Entradas

- `AGENTS.md`
- `docs/implementation/E05.md`
- `docs/architecture/DATA-MODEL.md`
- `docs/decisions/DATABASE-AND-ORM.md`
- `data/training-execution-metadata.json`
- `.env.example`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `src/lib/env/server.ts`
- `src/lib/env/server.test.ts`
- `vitest.config.ts`
- `vitest.setup.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `.gitignore`
- `.prettierignore`
- `.github/workflows/ci.yml`
- `roadmap/ACTIVE.md`
- `roadmap/README.md`
- `CHANGELOG.md`
- `prisma.config.ts`
- `prisma/schema.prisma`
- `src/lib/db/client.ts`
- `src/lib/db/environment.ts`
- `src/lib/db/environment.test.ts`

## Entregáveis

- `compose.yaml`, `prisma.config.ts`, `prisma/schema.prisma`, schemas de domínio em `prisma/models/` e configuração testável da CLI.
- `prisma/migrations/20260913011504_initial_p0/migration.sql` e `migration_lock.toml`.
- Client e configuração server-only em `src/lib/db/`, com testes unitários.
- Configuração Vitest Node e testes PostgreSQL em `tests/integration/`.
- Geração do Client e integração PostgreSQL nos gates locais/CI.
- Operação, deploy, recuperação e pendências documentados no guia.

## Subtarefas

- [x] Isolar URLs por ambiente.
- [x] Versionar migration inicial.
- [x] Impedir acesso do cliente ao banco.
- [x] Definir processo de deploy e rollback.

## Validações

- Banco vazio converge pela migration.
- Segredos não entram no Git ou bundle.

## Critérios de aceite

- [ ] Local e teste usam configuração reproduzível.
- [x] Banco vazio converge e segunda aplicação não encontra migrations pendentes.
- [x] Testes reais validam ownership, versões, carga, medidas, refeições e histórico.
- [ ] Gates locais completos passam, incluindo auditoria das novas dependências.

## Resultado

Em 14/09, schema dividido por domínio com equivalência dos 30 blocos confirmada,
sem modificar a migration. Configuração tipada e proteções puras da CLI separadas;
geração automática incluída nos comandos de desenvolvimento, build, tipos e testes.
Convenções registradas na arquitetura e referenciadas no AGENTS. Nova execução
validou 42 testes unitários, 10 testes PostgreSQL, 28 regressões dos validadores,
formato, lint, estrutura, tipos, dados e build. O `ci` falhou somente na auditoria
transitiva já registrada abaixo; Docker permanece pendente.

Implementação preparada para PR de revisão, com merge condicionado aos critérios
pendentes. Schema validado, Client gerado e migration
aplicada em dois bancos temporários PostgreSQL 18.6; segunda aplicação e status
confirmaram convergência. Testes unitários e PostgreSQL, tipos, lint, dados e build
foram executados. Containers locais ainda aguardam correção da inicialização do
Docker Desktop; Compose foi validado sem iniciar containers.

Auditoria permanece bloqueante por `deepmerge-ts@7.1.5` transitivo de
`@prisma/config@7.10.0` (GHSA-ggr8-5vv4-36mx), sem correção compatível na linha
Prisma 7 publicada. Os dois findings de mysql2 foram corrigidos com override
restrito para 3.23.1. Nenhuma exceção de auditoria ou upgrade major incompatível
foi aplicado. Tarefa não concluída até resolver as pendências.
