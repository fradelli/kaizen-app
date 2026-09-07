# E05 — Banco, importação e acesso

## Resultado esperado

Banco escolhido, migrations versionadas, importação idempotente e acesso pessoal implementado antes dos registros operacionais.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E05-T01 | E03-T05 | Modelo relacional aprovado |
| E05-T02 | E04-T03, E05-T01 | Banco e migrations |
| E05-T03 | E05-T02 | Importação idempotente |
| E05-T04 | E05-T03 | Integridade testada |
| E05-T05 | E05-T04 | Backup/restore local validado |
| E05-T06 | E05-T05 | Acesso pessoal implementado antes das features |

## Fora de escopo

- Domínios posteriores ao P0.
- Cadastro, login, edição de planos pela interface ou features fora do P0.

## Critérios de encerramento

- [ ] Importação repetida não duplica dados.
- [ ] Origem, versão e plano ativo permanecem rastreáveis.
- [ ] Atribuições e execuções pertencem ao workspace e preservam a versão apresentada.
- [ ] Sessão e autorização protegem o workspace antes de E06/E07.
