---
id: E01-T05
epic: E01
depends_on: [E01-T04]
---

# Migrar schemas

## Objetivo

Migrar contratos documentais de treino e registrar explicitamente sua cobertura e permissividade.

## Entradas

- `schemas/` do snapshot.
- Dados migrados em E01-T02 e E01-T03.

## Entregáveis

- `schemas/training-plan.schema.json`
- `schemas/exercise-library.schema.json`
- `schemas/README.md`

## Subtarefas

- [ ] Copiar os schemas aprovados.
- [ ] Verificar os dados cobertos.
- [ ] Registrar formatos ainda sem schema.
- [ ] Não ampliar contratos sem evidência.

## Validações

- Schemas e dados fazem parse.
- Dados cobertos validam contra o contrato correspondente.

## Critérios de aceite

- [ ] Cobertura e lacunas são explícitas.
- [ ] Schema não é apresentado como validação clínica ou de produto.

## Resultado

Ainda não concluída.
