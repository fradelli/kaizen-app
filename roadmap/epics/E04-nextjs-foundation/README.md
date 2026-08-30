# E04 — Fundação Next.js

## Resultado esperado

Aplicação Next.js mínima, sem features de negócio, com boundaries e gates de qualidade aprovados.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E04-T01 | E03-T05 | Scaffold validado |
| E04-T02 | E04-T01 | Qualidade estática |
| E04-T03 | E04-T02 | Boundary server-only |
| E04-T04 | E04-T02 | Shell acessível |
| E04-T05 | E04-T02, E04-T03, E04-T04 | CI mínimo |

## Fora de escopo

- Regras, páginas finais, banco produtivo ou deploy.

## Critérios de encerramento

- [ ] Lint, tipos, testes e build passam.
- [ ] Não há regra de treino ou alimentação em componentes/rotas.
