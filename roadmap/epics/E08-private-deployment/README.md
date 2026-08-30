# E08 — Publicação privada

## Resultado esperado

Aplicação validada localmente, em preview e em produção, com acesso privado, observabilidade mínima e rollback.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E08-T01 | E06-T05, E07-T05 | Preview publicado |
| E08-T02 | E08-T01 | Acesso protegido |
| E08-T03 | E08-T02, E05-T05 | Produção preparada |
| E08-T04 | E08-T03 | Operação e rollback validados |
| E08-T05 | E08-T04 | MVP privado publicado |

## Fora de escopo

- Publicação aberta ao público.
- Ambientes adicionais sem necessidade comprovada.

## Critérios de encerramento

- [ ] Local, preview e produção usam configurações documentadas.
- [ ] Segredos não estão versionados.
- [ ] Acesso e rollback foram testados.
