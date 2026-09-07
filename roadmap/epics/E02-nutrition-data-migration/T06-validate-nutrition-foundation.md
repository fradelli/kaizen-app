---
id: E02-T06
epic: E02
depends_on: [E02-T05]
---

# Validar fundação alimentar

## Objetivo

Executar o gate final da migração alimentar antes de produto e arquitetura.

## Entradas

- Todos os entregáveis de E02.
- Manifesto atualizado.

## Entregáveis

- `docs/migration/NUTRITION-VALIDATION-REPORT.md`
- Tag `nutrition-foundation-v1` após aprovação.

## Subtarefas

- [x] Validar JSON, schema, ponteiros, links e proveniência.
- [x] Confirmar separação entre original, revisão e plano vigente.
- [x] Confirmar ausência de diagnóstico e dados inventados.
- [x] Revisar privacidade do conteúdo versionado.

## Validações

- Relatório lista comandos, resultados e limitações.

## Critérios de aceite

- [x] Não há falha aberta que impeça leitura do plano.
- [x] E03-T01 pode iniciar.

## Resultado

Gate concluído sem falhas bloqueantes. O relatório valida 13 artefatos E02 na origem, 3 derivados públicos, contratos, ponteiros, referências, links e privacidade; E03-T01 foi liberada. A tag `nutrition-foundation-v1` é criada no commit mesclado em `developer` e verificada contra o remote.
