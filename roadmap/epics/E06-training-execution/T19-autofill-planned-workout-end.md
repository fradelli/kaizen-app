---
id: E06-T19
epic: E06
depends_on: [E06-T12]
---

# Preencher automaticamente o fim planejado do treino

## Objetivo

Ao adicionar um treino do plano, calcular o fim planejado a partir do início
informado e da duração da sessão selecionada, sem exigir cálculo manual.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/features/training/ui/components/training-day-page/components/training-activity-form/training-activity-form.tsx`
- `src/features/training/application/training-dto.ts`
- `src/features/training/data/prisma-training-repository.ts`
- `src/app/treino/training-actions.ts`

## Regras confirmadas

- Usar a duração da sessão carregada do plano, nunca um valor fixo na interface.
- Calcular após selecionar a sessão e informar o início, independentemente da ordem.
- A duração atual já inclui aquecimento; não somá-lo novamente.
- Exemplo: início 18h e duração de 40 minutos resultam em fim às 18h40.
- Não iniciar cronômetro nem persistir a atividade somente por preencher o campo.

## Decisões antes da implementação

- Reanalisar e apresentar o plano ao usuário antes de implementar.
- Decidir se o fim continua editável e como preservar uma alteração manual ao trocar início ou sessão.
- Definir o feedback para duração ausente ou término no dia seguinte, respeitando o contrato de horários vigente.
- Confirmar aplicação na edição de atividades existentes, além da inclusão.

## Critérios de aceite

- [ ] Fim automático usa a duração real da sessão e não duplica o aquecimento.
- [ ] Mudança de início ou sessão segue a política aprovada sem sobrescrever silenciosamente alterações manuais.
- [ ] Entrada em qualquer ordem e duração ausente possuem testes.
- [ ] Validação no servidor, janela de edição e ownership permanecem preservados.

## Resultado

Registrada para correção futura; nenhuma mudança de código nesta rodada.
