---
id: E06-T22
epic: E06
depends_on: [E06-T12]
---

# Permitir organizar a agenda futura sem iniciar treinos

## Objetivo

Permitir adicionar, remover e ajustar atividades em datas futuras acessíveis,
mantendo bloqueado o início de qualquer execução antes de sua data civil.

## Contexto conhecido

O usuário relatou que datas futuras não permitem adicionar ou remover treinos.
A regra aprovada distingue planejamento de execução: organizar os próximos dias
é permitido; treinar antecipadamente no aplicativo não é. A causa técnica deve
ser confirmada antes da implementação, sem assumir que o bloqueio é apenas visual.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/features/training/application/resolve-training-day-date.ts`
- `src/features/training/application/resolve-training-day-date.test.ts`
- `src/features/training/application/mutate-training-day.ts`
- `src/features/training/application/mutate-training-day.test.ts`
- `src/features/training/domain/training-edit-window.ts`
- `src/features/training/domain/training-edit-window.test.ts`
- `src/features/training/domain/training-day.rules.ts`
- `src/features/training/data/ensure-scheduled-training-day.ts`
- `src/features/training/ui/components/training-day-page/training-day-page.tsx`
- `src/features/training/ui/components/training-day-page/components/training-agenda-drawer/training-agenda-drawer.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-controls/training-activity-controls.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-card/training-activity-card.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-card/training-activity-card.test.tsx`
- `src/features/training/ui/components/training-day-page/components/training-activity-delete-form/training-activity-delete-form.tsx`
- `src/features/training/ui/hooks/use-training-activity-draft/use-training-activity-draft.ts`
- `tests/integration/training-mutations.test.ts`

## Regras aprovadas

- Amanhã até hoje + 4 dias: permitir inclusão, exclusão e edição do planejamento.
- Datas futuras: permitir consulta e expansão dos treinos, mas nunca iniciar,
  retomar ou finalizar uma execução nem registrar resultados antecipadamente.
- Separar a permissão de editar agenda da permissão de executar atividade;
  garantir ambas no servidor, além da apresentação correta dos controles.
- Planejamento pode ser persistido; não inicia cronômetro nem cria resultados.
- Preservar hoje e ontem como datas permitidas para registros; datas anteriores
  continuam bloqueadas para alterações, conforme a regra já aprovada.
- Preservar o limite futuro de quatro dias, fuso `America/Sao_Paulo`, ownership,
  revisão concorrente e restrições de exclusão de atividades concluídas.
- Não alterar a programação semanal nem recriar automaticamente atividades
  removidas intencionalmente de uma data já materializada.

## Plano da tarefa

1. Reanalisar as permissões atuais da UI, aplicação e fronteiras de mutação.
2. Apresentar o diagnóstico e o plano detalhado para aprovação antes de implementar.
3. Corrigir a distinção entre edição da agenda e registro da execução nas camadas
   necessárias, sem duplicar validações ou ampliar permissões de ownership.
4. Cobrir inclusão, exclusão e edição futuras, bloqueio de início por chamada
   direta ao servidor, limites temporais e regressões de hoje e ontem.
5. Executar gates proporcionais, revisão semântica e teste manual da agenda futura.

## Fora de escopo

- Ampliar a janela futura, alterar dados canônicos ou reconciliar troca de plano.
- Alterar o fluxo de conclusão, rascunhos ou cronômetros durante um treino.

## Critérios de aceite

- [ ] Adicionar, remover e ajustar planejamento funciona em hoje + 1 e hoje + 4.
- [ ] Iniciar atividade futura permanece indisponível e é rejeitado no servidor.
- [ ] Datas além de hoje + 4 e anteriores a ontem não ganham novas permissões.
- [ ] Exclusão futura não recria o treino na consulta seguinte.
- [ ] Hoje e ontem preservam o fluxo atual e atividades concluídas não podem ser excluídas.
- [ ] Testes, revisão semântica e validações do projeto aprovados.

## Resultado

Registrada por solicitação do usuário como primeira prioridade da próxima rodada,
após encerrar a entrega E06-T14. Nenhuma correção de código implementada.
