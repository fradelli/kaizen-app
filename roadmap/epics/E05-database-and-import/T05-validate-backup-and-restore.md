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
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`
- `compose.yaml`
- `prisma/schema.prisma`
- `scripts/import-canonical-data.ts`

## Entregáveis

- `docs/operations/BACKUP-AND-RESTORE.md`
- Evidência de teste de restauração.

## Subtarefas

- [ ] Executar `pg_dump` no PostgreSQL local de origem.
- [ ] Restaurar com `pg_restore` em outro PostgreSQL local descartável.
- [ ] Validar contagens, IDs e versão ativa.
- [ ] Registrar duração, limitações e evidência; RPO/RTO gerenciado pertence a E08.

## Validações

- Restore local produz banco utilizável e íntegro.
- Nenhuma conta, branch ou credencial Neon é necessária nesta tarefa.

## Critérios de aceite

- [ ] Procedimento local é repetível e não expõe credenciais.

## Resultado

Ainda não concluída.
