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

- [ ] Copiar ou transformar conforme manifesto.
- [ ] Preservar `null`, `unknowns`, IDs e versões.
- [ ] Ajustar somente caminhos relativos aprovados.
- [ ] Registrar hash de origem e destino.
- [ ] Não migrar versões anteriores nesta tarefa.

## Validações

- JSONs fazem parse.
- `active_plan_id` coincide com o plano apontado.
- Todos os `exercise_id` existem e são únicos.

## Critérios de aceite

- [ ] Nenhuma regra ou dado foi inventado.
- [ ] A leitura canônica de treino é reproduzível.

## Resultado

Ainda não concluída.
