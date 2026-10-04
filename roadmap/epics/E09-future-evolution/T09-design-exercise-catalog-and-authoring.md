---
id: E09-T09
epic: E09
depends_on: [E08-T05]
---

# Projetar catálogo e autoria de treinos

## Objetivo

Definir a evolução incremental entre as definições versionadas atuais e um
catálogo próprio capaz de sustentar busca, exercício adicional por sessão e
edição futura de templates, sem misturar prescrição com execução.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `docs/architecture/DATA-MODEL.md`
- `schemas/training-plan.schema.json`
- `prisma/models/training.prisma`
- `src/features/plan-definition-import/`
- `roadmap/epics/E06-training-execution/T07-show-previous-set-performance.md`
- `roadmap/epics/E06-training-execution/T21-design-external-training-plan-import.md`

## Entregáveis

- Inventário do que já existe em `ExerciseDefinition` e dos limites de identidade
  entre versões, sem criar entidade duplicada por nome.
- Modelo mínimo de catálogo, alias, classificação, equipamento e mídia futura.
- Fronteira explícita entre template, prescrição versionada, sessão ocorrida,
  exercício da sessão e séries realizadas.
- Estratégia para adicionar exercício somente à sessão e, posteriormente, oferecer
  promoção explícita ao template.
- Pesquisa atualizada de dataset, licença, textos e mídia antes de escolher fonte;
  API externa não participa do runtime.
- Decisão entre JSON versionado, importador idempotente e seed de banco, com IDs
  internos e rastreabilidade externa opcional.
- Decomposição das implementações em tarefas pequenas após as decisões.

## Decisões antes da implementação

- Definir identidade estável quando nome, prescrição ou plano mudam.
- Definir quais campos são necessários para musculação e calistenia agora; músculos,
  favoritos, recentes e mídia permanecem opcionais até existir consumidor.
- Confirmar licença e direito de redistribuição de dados e mídia na data da pesquisa.
- Decidir se exercício adicional aceita prescrição livre ou somente doses já
  representáveis pelo contrato atual.

## Fora de escopo

- Importar ExerciseDB ou outra fonte antes da revisão jurídica e técnica.
- Implementar catálogo, busca, mídia, editor ou exercício adicional nesta tarefa.
- Criar contas, treinador ou papéis antecipadamente.

## Critérios de aceite

- [ ] O modelo separa prescrição reutilizável de execução histórica imutável.
- [ ] A proposta reutiliza estruturas atuais quando possível e explicita migração e rollback.
- [ ] Fonte externa e mídia possuem licença, proveniência e limites documentados.
- [ ] As próximas tarefas podem ser implementadas uma por vez sem depender de API externa.

## Resultado

Ainda não iniciada. Registrada como evolução posterior ao MVP para não bloquear
o encerramento de treino nem a construção da tela de dieta.
