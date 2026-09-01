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

- [x] Copiar os schemas aprovados.
- [x] Verificar os dados cobertos.
- [x] Registrar formatos ainda sem schema.
- [x] Não ampliar contratos sem evidência.

## Validações

- Schemas e dados fazem parse.
- Dados cobertos validam contra o contrato correspondente.

## Critérios de aceite

- [x] Cobertura e lacunas são explícitas.
- [x] Schema não é apresentado como validação clínica ou de produto.

## Resultado

Os dois schemas Draft 2020-12 foram copiados literalmente e validaram biblioteca, plano v1 e plano v2 com `Test-Json`. O README remove a referência ao script excluído, documenta permissividade, formatos, cobertura e arquivos ainda sem contrato. Unicidade, referências cruzadas e ponteiro ativo foram mantidos como invariantes separadas, sem ampliar os schemas.
