---
id: E05-T05
epic: E05
depends_on: [E05-T04]
---

# Validar backup e restauração

## Objetivo

Demonstrar recuperação dos dados antes da publicação de produção.

## Entradas

- Banco importado e política de E03-T03.

## Entregáveis

- `docs/operations/BACKUP-AND-RESTORE.md`
- Evidência de teste de restauração.

## Subtarefas

- [ ] Executar backup seguro.
- [ ] Restaurar em ambiente isolado.
- [ ] Validar contagens, IDs e versão ativa.
- [ ] Registrar RPO/RTO observados sem falsa garantia.

## Validações

- Restore produz banco utilizável e íntegro.

## Critérios de aceite

- [ ] Procedimento é repetível e não expõe credenciais.

## Resultado

Ainda não concluída.
