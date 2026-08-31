---
id: E01-T02
epic: E01
depends_on: [E01-T01]
---

# Migrar dados canônicos de treino

## Objetivo

Migrar perfil aprovado, agenda aprovada, ponteiro ativo, biblioteca e somente o plano vigente sem alterar IDs ou fatos.

## Entradas

- Snapshot aprovado em E01-T01.
- Linhas `e01-t02-*` do manifesto.

## Entregáveis

- Arquivos canônicos correspondentes e somente o plano apontado por `data/active.json`.
- Linhas de manifesto para cada artefato.

## Subtarefas

- [x] Copiar ou transformar conforme manifesto.
- [x] Preservar `null`, `unknowns` aprovados, IDs e versões.
- [x] Ajustar somente caminhos relativos aprovados.
- [x] Registrar hash de origem e destino.
- [x] Não migrar versões anteriores nesta tarefa.

## Validações

- JSONs fazem parse.
- `active_plan_id` coincide com o plano apontado.
- Todos os `exercise_id` existem e são únicos.

## Critérios de aceite

- [x] Nenhuma regra ou dado foi inventado.
- [x] A leitura canônica de treino é reproduzível.

## Resultado

Cinco artefatos canônicos foram migrados exclusivamente do snapshot `d1acad309e2b81b714d1aa375e9371a310ad6ed0`. As três cópias literais mantiveram o SHA-256; perfil e agenda receberam somente a sanitização aprovada, com hashes de destino registrados. O plano ativo e todos os `exercise_id` foram validados, sem incluir versões ou históricos da E01-T03.
