# Roadmap do Kaizen

Este arquivo é a fonte canônica do status de todos os épicos e tarefas. Não é necessário abrir cada tarefa para descobrir o que foi concluído.

## Protocolo de leitura

1. Leia `AGENTS.md`.
2. Consulte este índice para o status global.
3. Leia `ACTIVE.md`.
4. Abra somente a tarefa ativa e os arquivos de entrada indicados nela.

## Estados

`PLANNED` · `READY` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `CANCELLED`

Somente este arquivo guarda o status canônico. Arquivos individuais não repetem o campo `status`.

## Épicos

| ID | Status | Épico | Resultado |
| --- | --- | --- | --- |
| E00 | DONE | [Governança do repositório](epics/E00-repository-governance/README.md) | Repositório público governado e legado privado rastreável |
| E01 | DONE | [Migração de treino](epics/E01-training-data-migration/README.md) | Fundação de treino migrada e validada |
| E02 | DONE | [Migração de alimentação](epics/E02-nutrition-data-migration/README.md) | Plano alimentar revisado, versionado e validado |
| E03 | IN_PROGRESS | [Produto e arquitetura](epics/E03-product-and-architecture/README.md) | P0 e arquitetura aprovados, ainda sem código |
| E04 | PLANNED | [Fundação Next.js](epics/E04-nextjs-foundation/README.md) | Aplicação mínima com gates de qualidade |
| E05 | PLANNED | [Banco e importação](epics/E05-database-and-import/README.md) | Persistência e importação íntegras |
| E06 | PLANNED | [Execução de treino](epics/E06-training-read-only/README.md) | Consulta e registro utilizáveis de treino |
| E07 | PLANNED | [Execução de alimentação](epics/E07-nutrition-read-only/README.md) | Consulta e registro utilizáveis de alimentação |
| E08 | PLANNED | [Publicação pessoal](epics/E08-private-deployment/README.md) | Local, preview e produção verificados |
| E09 | PLANNED | [Evolução futura](epics/E09-future-evolution/README.md) | Backlog posterior ao MVP read-only |

## Todas as tarefas

| ID | Status | Tarefa | Depende de |
| --- | --- | --- | --- |
| E00-T01 | DONE | [Inicializar repositório e branches](epics/E00-repository-governance/T01-initialize-repository-and-branches.md) | — |
| E00-T02 | CANCELLED | [Tornar o repositório privado](epics/E00-repository-governance/T02-make-repository-private.md) | Cancelada por decisão do proprietário |
| E00-T03 | DONE | [Criar contrato raiz](epics/E00-repository-governance/T03-create-root-contract.md) | E00-T01 |
| E00-T04 | DONE | [Criar sistema de roadmap](epics/E00-repository-governance/T04-create-roadmap-system.md) | E00-T03 |
| E00-T06 | DONE | [Adaptar governança de PR e CI/CD](epics/E00-repository-governance/T06-adapt-delivery-governance.md) | E00-T04 |
| E00-T05 | DONE | [Registrar proveniência do legado](epics/E00-repository-governance/T05-register-legacy-provenance.md) | E00-T04, E00-T06 |
| E01-T01 | DONE | [Congelar snapshot de origem](epics/E01-training-data-migration/T01-freeze-source-snapshot.md) | E00-T05 |
| E01-T02 | DONE | [Migrar dados canônicos de treino](epics/E01-training-data-migration/T02-migrate-canonical-training-data.md) | E01-T01 |
| E01-T03 | DONE | [Migrar histórico de treino](epics/E01-training-data-migration/T03-migrate-training-history.md) | E01-T02 |
| E01-T04 | DONE | [Migrar documentação humana](epics/E01-training-data-migration/T04-migrate-human-documentation.md) | E01-T03 |
| E01-T05 | DONE | [Migrar schemas](epics/E01-training-data-migration/T05-migrate-schemas.md) | E01-T04 |
| E01-T06 | DONE | [Validar fundação de treino](epics/E01-training-data-migration/T06-validate-training-foundation.md) | E01-T05 |
| E02-T01 | DONE | [Inventariar alimentação e unknowns](epics/E02-nutrition-data-migration/T01-inventory-nutrition-inputs.md) | E01-T06 |
| E02-T02 | DONE | [Preservar dieta original](epics/E02-nutrition-data-migration/T02-preserve-original-diet.md) | E02-T01, dieta fornecida |
| E02-T03 | DONE | [Revisar plano alimentar](epics/E02-nutrition-data-migration/T03-review-nutrition-plan.md) | E02-T02 |
| E02-T04 | DONE | [Estruturar plano alimentar](epics/E02-nutrition-data-migration/T04-structure-nutrition-plan.md) | E02-T03, decisões aprovadas |
| E02-T05 | DONE | [Criar ponteiro, schema e guia](epics/E02-nutrition-data-migration/T05-create-nutrition-contracts.md) | E02-T04 |
| E02-T06 | DONE | [Validar fundação alimentar](epics/E02-nutrition-data-migration/T06-validate-nutrition-foundation.md) | E02-T05 |
| E03-T01 | DONE | [Definir jornadas do P0](epics/E03-product-and-architecture/T01-define-p0-journeys.md) | E01-T06, E02-T06 |
| E03-T02 | READY | [Definir transição da fonte de verdade](epics/E03-product-and-architecture/T02-define-source-of-truth-transition.md) | E03-T01 |
| E03-T03 | READY | [Definir privacidade e operação](epics/E03-product-and-architecture/T03-define-privacy-and-operations.md) | E03-T01 |
| E03-T04 | PLANNED | [Definir arquitetura](epics/E03-product-and-architecture/T04-define-target-architecture.md) | E03-T02, E03-T03 |
| E03-T05 | PLANNED | [Aprovar guia de implementação](epics/E03-product-and-architecture/T05-approve-implementation-guide.md) | E03-T04 |
| E04-T01 | PLANNED | [Criar aplicação Next.js](epics/E04-nextjs-foundation/T01-scaffold-nextjs.md) | E03-T05 |
| E04-T02 | PLANNED | [Configurar qualidade estática](epics/E04-nextjs-foundation/T02-configure-static-quality.md) | E04-T01 |
| E04-T03 | PLANNED | [Criar fronteira server-only](epics/E04-nextjs-foundation/T03-create-server-only-boundary.md) | E04-T02 |
| E04-T04 | PLANNED | [Criar shell acessível](epics/E04-nextjs-foundation/T04-create-accessible-shell.md) | E04-T02 |
| E04-T05 | PLANNED | [Configurar CI mínimo](epics/E04-nextjs-foundation/T05-configure-minimal-ci.md) | E04-T02, E04-T03, E04-T04 |
| E05-T01 | PLANNED | [Modelar treino e alimentação](epics/E05-database-and-import/T01-design-relational-model.md) | E03-T05 |
| E05-T02 | PLANNED | [Configurar banco e migrations](epics/E05-database-and-import/T02-configure-database-and-migrations.md) | E04-T03, E05-T01 |
| E05-T03 | PLANNED | [Criar importação idempotente](epics/E05-database-and-import/T03-create-idempotent-import.md) | E05-T02 |
| E05-T04 | PLANNED | [Testar integridade persistida](epics/E05-database-and-import/T04-test-persisted-integrity.md) | E05-T03 |
| E05-T05 | PLANNED | [Validar backup e restauração](epics/E05-database-and-import/T05-validate-backup-and-restore.md) | E05-T04 |
| E06-T01 | PLANNED | [Projetar treino e execução do dia](epics/E06-training-read-only/T01-project-active-training-plan.md) | E05-T04 |
| E06-T02 | PLANNED | [Criar página de treino do dia](epics/E06-training-read-only/T02-create-weekly-training-page.md) | E06-T01 |
| E06-T03 | PLANNED | [Registrar preparação, séries e comentários](epics/E06-training-read-only/T03-create-session-and-exercise-details.md) | E06-T02 |
| E06-T04 | PLANNED | [Exibir proveniência e histórico](epics/E06-training-read-only/T04-show-training-provenance.md) | E06-T03 |
| E06-T05 | PLANNED | [Validar fluxo de treino](epics/E06-training-read-only/T05-validate-training-flow.md) | E06-T04 |
| E07-T01 | PLANNED | [Projetar dieta e execução do dia](epics/E07-nutrition-read-only/T01-project-active-nutrition-plan.md) | E05-T04 |
| E07-T02 | PLANNED | [Criar página de dieta do dia](epics/E07-nutrition-read-only/T02-create-nutrition-page.md) | E07-T01 |
| E07-T03 | PLANNED | [Registrar escolhas, cumprimento e comentários](epics/E07-nutrition-read-only/T03-show-meals-and-alternatives.md) | E07-T02 |
| E07-T04 | PLANNED | [Exibir segurança e proveniência](epics/E07-nutrition-read-only/T04-show-nutrition-safety.md) | E07-T03 |
| E07-T05 | PLANNED | [Validar fluxo alimentar](epics/E07-nutrition-read-only/T05-validate-nutrition-flow.md) | E07-T04 |
| E08-T01 | PLANNED | [Publicar preview](epics/E08-private-deployment/T01-deploy-preview.md) | E06-T05, E07-T05 |
| E08-T02 | PLANNED | [Proteger acesso](epics/E08-private-deployment/T02-protect-access.md) | E08-T01 |
| E08-T03 | PLANNED | [Preparar produção](epics/E08-private-deployment/T03-prepare-production.md) | E08-T02, E05-T05 |
| E08-T04 | PLANNED | [Validar operação e rollback](epics/E08-private-deployment/T04-validate-operations-and-rollback.md) | E08-T03 |
| E08-T05 | PLANNED | [Publicar MVP privado](epics/E08-private-deployment/T05-release-private-mvp.md) | E08-T04 |

## Regra de atualização

Ao iniciar ou concluir uma tarefa:

1. altere o status nesta tabela;
2. atualize `ACTIVE.md`;
3. preencha `Resultado` no arquivo da tarefa concluída;
4. atualize `CHANGELOG.md` quando houver entrega material.

Não é necessário abrir tarefas concluídas para conferir o progresso: esta tabela deve permanecer sincronizada.
