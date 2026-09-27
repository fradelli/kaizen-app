---
id: E09-T01
epic: E09
depends_on: [E08-T05]
---

# Projetar sono e atividades gerais

## Objetivo

Definir jornadas, dados, limites de privacidade e arquitetura mínima para controle
de sono e atividades gerais antes de criar banco, telas ou integrações.

## Entradas

- `docs/product/P0.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `roadmap/epics/E06-training-execution/README.md`
- `roadmap/epics/E07-nutrition-execution/README.md`
- `roadmap/epics/E09-future-evolution/README.md`

## Entregáveis

- Jornadas e vocabulário de domínio para sono e atividades gerais.
- Dados obrigatórios, opcionais e deliberadamente não coletados.
- Decisão sobre entrada manual, importação e integrações externas.
- Modelo conceitual, ownership, retenção, privacidade e riscos.
- Decisão de acesso que bloqueie implementação caso os dados sejam classificados
  como sensíveis antes de existir autenticação adequada.
- Decomposição revisada das tarefas E09-T02, E09-T03 e E09-T04.

## Subtarefas

- [ ] Separar fatos, decisões, inferências e dados ausentes de cada domínio.
- [ ] Definir quais atividades são gerais e quais permanecem em treino.
- [ ] Definir métricas de sono sem diagnóstico ou alegação médica.
- [ ] Avaliar timezone, datas civis, sobreposição e edição histórica.
- [ ] Classificar a sensibilidade dos dados e decidir o gate de autenticação.
- [ ] Registrar unknowns de integrações e dispositivos sem antecipar dependências.

## Validações

- Revisar coerência com workspace fixo, modelo relacional e fronteiras Server/Client.
- Confirmar que nenhuma entidade ou integração futura foi tratada como requisito já aprovado.

## Critérios de aceite

- [ ] Sono e atividades gerais possuem escopo distinguível e implementável.
- [ ] Privacidade, dados ausentes e decisões adiadas estão explícitos.
- [ ] E09-T02 e E09-T03 não podem ficar `READY` sem acesso compatível com a
      classificação dos dados.
- [ ] As tarefas de implementação podem ser detalhadas sem inventar requisitos.

## Fora de escopo

- Criar schema, migration, tela, API ou integração.
- Diagnosticar qualidade do sono, lesão, recuperação ou saúde.

## Resultado

Ainda não concluída.
