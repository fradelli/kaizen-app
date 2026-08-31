# E01 — Migração dos dados de treino

## Resultado esperado

Regras, planos, biblioteca, agenda, originais, revisões e documentação de treino migrados com proveniência e integridade, ainda sem código.

## Fora de escopo

- Alimentação.
- Aplicação, banco e scripts.
- Importação de todo o histórico Git.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E01-T01 | E00-T05 | Snapshot imutável da origem |
| E01-T02 | E01-T01 | Dados canônicos e plano ativo migrados |
| E01-T03 | E01-T02 | Histórico e versões anteriores preservados |
| E01-T04 | E01-T03 | Documentação útil transformada |
| E01-T05 | E01-T04 | Schemas migrados |
| E01-T06 | E01-T05 | Fundação validada e marcada |

## Critérios de encerramento

- [ ] Todos os IDs, ponteiros e horários são válidos.
- [ ] Originais literais mantêm hash.
- [ ] Não há caminhos antigos ou arquitetura desatualizada como decisão vigente.
- [ ] Tag `training-foundation-v1` criada.
