---
id: E06-T24
epic: E06
depends_on: [E06-T23]
---

# Permitir execução livre das séries e sinalizar parcial

## Objetivo

Exibir todas as séries do exercício simultaneamente e permitir preencher qualquer
uma delas, representando visualmente a diferença entre exercício completo,
parcial, não realizado e ignorado.

## Contexto conhecido

A implementação atual mostra uma série por vez e o servidor rejeita uma série
posterior preenchida quando uma anterior está vazia. O banco já persiste todas as
séries e aceita resultado parcial na conclusão da atividade, mas a interface e a
validação ainda impõem ordem. Os blocos A/B já possuem identidade e posição
estruturadas, embora a navegação continue manual.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `prisma/models/training.prisma`
- `src/features/training/application/training-dto.ts`
- `src/features/training/data/prisma-training-repository.ts`
- `src/features/training/ui/hooks/use-training-exercise-draft/use-training-exercise-draft.utils.ts`
- `src/features/training/ui/components/training-day-page/components/training-session/components/training-exercise/training-exercise.tsx`
- `src/features/training/ui/components/training-day-page/components/training-session/components/training-exercise/components/training-local-exercise-editor/training-local-exercise-editor.tsx`
- `roadmap/epics/E06-training-execution/T08-require-applicable-fields-before-next-set.md`
- `roadmap/epics/E06-training-execution/T18-guide-combined-exercise-blocks.md`

## Regras aprovadas

- Todas as séries aparecem simultaneamente numa apresentação adequada ao mobile.
- Qualquer série pode ser preenchida ou corrigida sem liberar a anterior primeiro.
- Medidas obrigatórias dependem do tipo da dose; carga aparece apenas quando
  aplicável, mas ausência de uma série não bloqueia a edição das demais.
- Exercício completo, parcial, não realizado e ignorado possuem estados distintos.
- O estado parcial usa borda amarela ou laranja e também texto ou ícone; a cor não
  é o único sinal acessível.
- O treino pode ser concluído com exercícios parciais ou não realizados após uma
  confirmação curta, preservando o que realmente foi feito.
- Blocos A/B permanecem agrupados visualmente, sem carousel ou avanço obrigatório.

## Plano da tarefa

1. Definir o estado derivado de exercício e série sem adicionar status redundante
   ao banco quando os resultados persistidos já forem suficientes.
2. Substituir o editor de série única por uma lista ou tabela responsiva com todas
   as séries, mantendo rascunho local e campos específicos da dose.
3. Remover da interface e do servidor a regra de prefixo consecutivo realizado.
4. Aplicar estados completos e parciais com semântica, contraste e testes.
5. Preservar agrupamento dos blocos combinados e conclusão parcial da atividade.

## Fora de escopo

- Mostrar histórico anterior; isso permanece na E06-T07 sobre a nova interface.
- Adicionar exercícios não prescritos, criar catálogo ou editar o template.
- Recomendar carga ou progressão automaticamente.

## Critérios de aceite

- [ ] Todas as séries são visíveis e editáveis em qualquer ordem no celular.
- [ ] Uma série posterior pode ser realizada com anterior vazia e ambas persistem corretamente.
- [ ] Estados completo, parcial, não realizado e ignorado são distinguíveis sem depender só da cor.
- [ ] Exercícios com repetições, lados, direções, tempo e carga seguem suas medidas aplicáveis.
- [ ] Blocos A/B permanecem legíveis sem impor navegação guiada.
- [ ] Conclusão parcial avisa sem bloquear e mantém os resultados informados.

## Resultado

Planejada a partir da revisão do fluxo e do prompt de evolução do produto. Absorve
as antigas E06-T08 e E06-T18; implementação ainda não iniciada.
