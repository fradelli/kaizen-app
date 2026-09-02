# E08 — Publicação pessoal

## Resultado esperado

Aplicação validada localmente, em preview e em produção, com leitura pública controlada, dados pessoais protegidos, observabilidade mínima e rollback.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E08-T01 | E06-T05, E07-T05 | Preview publicado |
| E08-T02 | E08-T01 | Mutações e dados pessoais protegidos |
| E08-T03 | E08-T02, E05-T05 | Produção preparada |
| E08-T04 | E08-T03 | Operação e rollback validados |
| E08-T05 | E08-T04 | MVP pessoal publicado |

## Fora de escopo

- Cadastro público e múltiplos usuários.
- Ambientes adicionais sem necessidade comprovada.

## Critérios de encerramento

- [ ] Local, preview e produção usam configurações documentadas.
- [ ] Segredos não estão versionados.
- [ ] Acesso e rollback foram testados.
