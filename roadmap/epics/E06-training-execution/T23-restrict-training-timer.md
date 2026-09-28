---
id: E06-T23
epic: E06
depends_on: [E06-T22]
---

# Restringir cronômetro ao treino estruturado do dia

## Objetivo

Exibir e operar o cronômetro somente nos treinos estruturados do plano e apenas
na própria data civil, sem transformar futevôlei ou outras atividades esportivas
em execuções cronometradas.

## Contexto conhecido

Um treino de futevôlei futuro exibiu um rascunho pausado com 17 segundos. O valor
veio de intervalos guardados no `localStorage`, que atualmente podem prevalecer
sobre a projeção do servidor. A regra aprovada é mais restrita: somente um treino
estruturado do plano possui cronômetro, e seu ciclo de execução ocorre apenas no
dia correspondente em `America/Sao_Paulo`.

Em 27/09/2026, após testes manuais de edição da agenda, as materializações de
28/09 a 01/10 foram reiniciadas no PostgreSQL local e recriadas pela programação
ativa. O backup anterior ao reinício foi validado e preservado fora do repositório.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/features/training/application/mutate-training-day.ts`
- `src/features/training/application/mutate-training-day.test.ts`
- `src/features/training/data/prisma-training-repository.ts`
- `src/features/training/domain/training-edit-window.ts`
- `src/features/training/domain/training-edit-window.test.ts`
- `src/features/training/ui/components/training-day-page/components/training-activity-card/training-activity-card.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-card/training-activity-card.test.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-timer/training-activity-timer.tsx`
- `src/features/training/ui/hooks/use-training-activity-draft/use-training-activity-draft.ts`
- `src/features/training/ui/hooks/use-training-activity-draft/use-training-activity-draft.test.tsx`
- `src/features/training/ui/hooks/use-training-activity-draft/use-training-activity-draft.utils.ts`
- `tests/integration/training-mutations.test.ts`

## Regras aprovadas

- Somente atividades `structured_training` exibem cronômetro e controles de
  iniciar, pausar, retomar e concluir execução.
- Futevôlei, `specific_training`, `sport_practice` e mobilidade não exibem nem
  persistem intervalos do cronômetro.
- Um treino estruturado só pode iniciar, pausar, retomar ou concluir quando sua
  data civil for hoje em `America/Sao_Paulo`.
- Datas futuras continuam editáveis dentro da janela da agenda, mas nunca são
  executáveis. Datas passadas não podem iniciar ou retomar execução.
- Rascunhos incompatíveis com o tipo ou com a data atual não podem alterar o
  status visual nem alimentar o cronômetro; devem ser descartados com segurança.
- A camada de servidor repete as restrições de tipo e data, independentemente da UI.
- O reinício operacional da agenda não vira comportamento automático do produto.

## Plano da tarefa

1. Separar a capacidade de organizar a agenda da capacidade de executar um treino
   estruturado, incluindo tipo e data na regra de domínio.
2. Impedir que o hook recupere ou grave rascunhos para atividades não estruturadas
   ou fora da data civil atual e remover chaves incompatíveis encontradas.
3. Ocultar cronômetro e controles de execução em futevôlei, esporte, mobilidade,
   datas futuras e datas passadas, preservando consulta e edição da agenda.
4. Validar no servidor que somente `structured_training` do dia aceita conclusão
   e intervalos; rejeitar chamadas diretas incompatíveis antes de persistir.
5. Cobrir regressões de virada de dia em São Paulo, rascunho futuro obsoleto,
   futevôlei sem cronômetro e treino estruturado executável somente hoje.
6. Executar revisão semântica, testes unitários e PostgreSQL, qualidade, dados,
   build, auditoria e validação manual do fluxo diário.

## Fora de escopo

- Alterar a duração planejada, o aquecimento ou a programação do futevôlei.
- Criar placar, cronômetro esportivo, presença ou avaliação específica do esporte.
- Ampliar a janela futura ou reconciliar automaticamente trocas de plano.
- Repetir o reinício do banco como parte da implementação.

## Critérios de aceite

- [ ] Futevôlei e demais atividades não estruturadas não exibem cronômetro.
- [ ] Rascunho antigo de atividade não estruturada ou futura não altera o card.
- [ ] Treino estruturado de hoje inicia, pausa, retoma e conclui normalmente.
- [ ] Treino estruturado futuro ou passado não exibe controles nem aceita execução no servidor.
- [ ] Edição da agenda futura entre amanhã e hoje + 4 permanece disponível.
- [ ] Testes, revisão semântica, validação manual e gates do projeto aprovados.

## Resultado

Planejamento registrado após confirmação das regras pelo usuário. Implementação
ainda não iniciada.
