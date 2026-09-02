# E05 — Banco e importação

## Resultado esperado

Banco escolhido, migrations versionadas e importação idempotente de definições, com persistência íntegra dos registros operacionais.

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
- Cadastro, login, edição de planos pela interface ou features fora do P0.

## Critérios de encerramento

- [ ] Importação repetida não duplica dados.
- [ ] Origem, versão e plano ativo permanecem rastreáveis.
- [ ] Atribuições e execuções pertencem ao workspace e preservam a versão apresentada.
