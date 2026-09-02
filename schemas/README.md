# Schemas de dados

Os schemas documentam contratos estruturais mínimos para os dados de treino e alimentação. Eles são intencionalmente permissivos nesta fase e não substituem validações entre arquivos, de produto ou clínicas.

## Cobertura

| Schema | Dados cobertos | Garantias principais |
| --- | --- | --- |
| [`exercise-library.schema.json`](exercise-library.schema.json) | [`data/exercises.json`](../data/exercises.json) | Campos obrigatórios da biblioteca e dos exercícios, ID em `snake_case`, categorias e nível de evidência |
| [`training-plan.schema.json`](training-plan.schema.json) | Arquivos em [`data/plans/`](../data/plans/) | Metadados do plano, status permitido, sessões, duração e estrutura básica da prescrição |
| [`nutrition-plan.schema.json`](nutrition-plan.schema.json) | Arquivos em [`data/nutrition/plans/`](../data/nutrition/plans/) | Metadados, aprovação, proveniência, tipos de dia, refeições, opções, horários e limites de uso |

Ambos declaram JSON Schema Draft 2020-12. O `$id` sob `https://example.local/` é apenas um identificador do contrato e não representa endpoint publicado.

## Permissividade intencional

- `additionalProperties: true` permite campos de domínio ainda não formalizados.
- `schema_version`, regras globais e vários campos descritivos são exigidos ou aceitos sem formato semântico estrito.
- Chaves de sessão são abertas para novas modalidades.
- Um validador precisa habilitar `format` para verificar datas declaradas com `format: date`.

Não amplie nem restrinja os contratos sem dados de exemplo, impacto conhecido e migração explícita.

## Lacunas conhecidas

Ainda não existe schema inventariado para:

- `data/profile.json`;
- `data/schedule.json`;
- `data/active.json`;
- `data/reviews/`;
- manifesto, guias e templates.

Os schemas atuais também não verificam:

- unicidade dos IDs da biblioteca;
- existência de cada `exercise_id` referenciado pelos planos;
- correspondência entre `active_plan_id`, `active_plan_path` e o plano selecionado;
- que somente um plano seja o vigente;
- coerência de dose, segurança, eficácia ou adequação individual.

Essas invariantes devem ser validadas separadamente. O fato de um JSON validar contra o schema significa somente que sua estrutura mínima é aceita.

## Validação atual

E01-T05 confirmou com `Test-Json` que biblioteca, plano v1 e plano v2 validam contra seus contratos. Nenhum script, pacote ou dependência de validação foi adicionado ao repositório.

Exemplos para conferência manual com PowerShell 7:

```powershell
Get-Content -Raw data/exercises.json | Test-Json -SchemaFile schemas/exercise-library.schema.json
Get-Content -Raw data/plans/2026-08-performance-v1.json | Test-Json -SchemaFile schemas/training-plan.schema.json
Get-Content -Raw data/plans/2026-08-performance-v2.json | Test-Json -SchemaFile schemas/training-plan.schema.json
Get-Content -Raw data/nutrition/plans/2026-09-personal-v1.json | Test-Json -SchemaFile schemas/nutrition-plan.schema.json
```

A automação estável desses contratos pertence ao futuro check `Data integrity`, não a esta etapa documental.
