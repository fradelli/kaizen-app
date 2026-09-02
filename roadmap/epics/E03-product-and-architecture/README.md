# E03 — Produto e arquitetura

## Resultado esperado

Escopo P0, transição da fonte de verdade, operação e arquitetura aprovados em documentação, sem criar código.

## Fora de escopo

- Scaffold, dependências, banco ou deploy.
- Features além da execução essencial de treino e alimentação.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E03-T01 | E01-T06, E02-T06 | Jornadas e aceite do P0 |
| E03-T02 | E03-T01 | Transição arquivos/banco |
| E03-T03 | E03-T01 | Privacidade e operação |
| E03-T04 | E03-T02, E03-T03 | Arquitetura proporcional |
| E03-T05 | E03-T04 | Guia copiável aprovado |

## Critérios de encerramento

- [ ] Nenhuma decisão técnica bloqueante permanece implícita.
- [ ] O guia de implementação possui ordem, arquivos e validações.
- [ ] E04-T01 está `READY`.
