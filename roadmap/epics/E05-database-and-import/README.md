# E05 — Banco e importação

## Resultado esperado

Banco escolhido, migrations versionadas e importação idempotente dos dados documentais com integridade e rollback.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E05-T01 | E03-T05 | Modelo relacional aprovado |
| E05-T02 | E04-T03, E05-T01 | Banco e migrations |
| E05-T03 | E05-T02 | Importação idempotente |
| E05-T04 | E05-T03 | Integridade testada |
| E05-T05 | E05-T04 | Backup/restore validado |

## Fora de escopo

- Domínios posteriores ao P0.
- Escrita pelo usuário no aplicativo.

## Critérios de encerramento

- [ ] Importação repetida não duplica dados.
- [ ] Origem, versão e plano ativo permanecem rastreáveis.
