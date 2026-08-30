---
id: E01-T02
epic: E01
depends_on: [E01-T01]
---

# Migrar dados canônicos de treino

## Objetivo

Migrar perfil, agenda, ponteiro ativo, biblioteca e todas as versões de plano sem alterar IDs ou fatos.

## Entradas

- Snapshot aprovado em E01-T01.
- `data/profile.json`, `data/schedule.json`, `data/active.json`, `data/exercises.json` e `data/plans/`.

## Entregáveis

- Arquivos correspondentes em `data/` no Kaizen.
- Linhas de manifesto para cada artefato.

## Subtarefas

- [ ] Copiar ou transformar conforme manifesto.
- [ ] Preservar `null`, `unknowns`, IDs e versões.
- [ ] Ajustar somente caminhos relativos aprovados.
- [ ] Registrar hash de origem e destino.

## Validações

- JSONs fazem parse.
- `active_plan_id` coincide com o plano apontado.
- Todos os `exercise_id` existem e são únicos.

## Critérios de aceite

- [ ] Nenhuma regra ou dado foi inventado.
- [ ] A leitura canônica de treino é reproduzível.

## Resultado

Ainda não concluída.
