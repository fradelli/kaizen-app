# E06 — Treino read-only

## Resultado esperado

Plano ativo, semana, sessões, exercícios e proveniência consultáveis sem edição pelo aplicativo.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E06-T01 | E05-T04 | Consulta do plano ativo |
| E06-T02 | E06-T01 | Página semanal |
| E06-T03 | E06-T02 | Detalhes de sessão e exercício |
| E06-T04 | E06-T03 | Proveniência e histórico |
| E06-T05 | E06-T04 | Fluxo validado |

## Fora de escopo

- Edição de planos pelo aplicativo.
- Registro de execução ou métricas do treino.

## Critérios de encerramento

- [ ] O usuário encontra o treino correto para o dia.
- [ ] Dados ausentes são apresentados sem inferências.
- [ ] Origem e versão do plano são rastreáveis.
