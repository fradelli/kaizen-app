# E02 — Migração dos dados alimentares

## Resultado esperado

Dieta original preservada, revisão documentada e plano alimentar vigente estruturado, versionado e validado, ainda sem aplicação.

## Fora de escopo

- Diagnóstico, medicamento ou substituição de acompanhamento profissional.
- Código, banco ou UI.
- Dieta dinâmica e contador completo de calorias.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E02-T01 | E01-T06 | Inventário e unknowns |
| E02-T02 | E02-T01, dieta fornecida | Original preservado |
| E02-T03 | E02-T02 | Revisão segura |
| E02-T04 | E02-T03 | Plano estruturado |
| E02-T05 | E02-T04 | Contratos e guia |
| E02-T06 | E02-T05 | Fundação validada |

## Critérios de encerramento

- [ ] Plano vigente possui proveniência, versão e status.
- [ ] Fatos, estimativas e decisões profissionais estão separados.
- [ ] Tag `nutrition-foundation-v1` criada.
