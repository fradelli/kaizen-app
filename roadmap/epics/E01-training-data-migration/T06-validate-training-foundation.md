---
id: E01-T06
epic: E01
depends_on: [E01-T05]
---

# Validar fundação de treino

## Objetivo

Executar o gate final da migração de treino e marcar uma base imutável para as próximas fases.

## Entradas

- Todos os entregáveis de E01.
- Manifesto completo.

## Entregáveis

- `docs/migration/TRAINING-VALIDATION-REPORT.md`
- Tag `training-foundation-v1` após aprovação.

## Subtarefas

- [x] Validar JSONs, schemas, IDs, ponteiros, agenda sanitizada e links.
- [x] Comparar hashes de cópias literais.
- [x] Confirmar ausência de código, dependências e dados inventados.
- [x] Revisar o manifesto por completude.

## Validações

- O snapshot privado mantém quatro sessões confirmadas; seus valores não são reproduzidos no destino público.
- O destino público mantém quatro sessões com dia, horário e intensidade `null`.
- Dia e horário do jogo continuam `null` se não houver novo fato.

## Critérios de aceite

- [x] Relatório sem falhas abertas.
- [x] E02-T01 pode iniciar.

## Resultado

O gate final verificou diretamente o snapshot privado, os 23 artefatos do manifesto, os 19 destinos publicados, os contratos estruturais e as invariantes entre arquivos. O ponteiro ativo foi transformado para eliminar caminhos ausentes, a agenda pública permaneceu sanitizada e a exposição histórica anterior foi aceita sem autorizar novas publicações. O relatório não possui falhas abertas; a tag `training-foundation-v1` identifica o commit integrado desta entrega.
