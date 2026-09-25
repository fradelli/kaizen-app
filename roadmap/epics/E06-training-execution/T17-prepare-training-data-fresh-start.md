---
id: E06-T17
epic: E06
depends_on: [E06-T11]
---

# Preparar reinício controlado dos dados de treino

## Objetivo

Planejar e executar, somente após autorização específica, um início operacional
limpo antes de receber a nova programação, sem perder dados fora do escopo aprovado.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `prisma/models/training.prisma`
- `prisma/models/nutrition.prisma`
- `roadmap/epics/E05-database-and-import/T05-validate-backup-and-restore.md`
- `roadmap/epics/E06-training-execution/T11-review-daily-plan-lifecycle.md`

## Entregáveis

- Inventário do banco e definição explícita de ambiente, tabelas e registros alvo.
- Escolha documentada entre reiniciar somente dados operacionais de treino ou
  também definições/importações e alimentação; nada será presumido.
- Backup verificável, plano de rollback e confirmação do usuário antes da exclusão.
- Execução transacional ou procedimento recuperável e verificação do estado vazio.
  A importação/ativação e a leitura da nova semana pertencem à E06-T16.

## Fora de escopo

- Excluir qualquer dado antes de definir escopo, obter backup e aprovação.
- Apagar ambientes ou volumes inteiros por conveniência.

## Decisões antes da implementação

- Confirmar com o usuário o banco/ambiente exato e o alcance do reinício.
- Confirmar política para histórico antigo e dados de alimentação.

## Critérios de aceite

- [ ] Alvos de exclusão, backup e recuperação foram comprovados e aprovados.
- [ ] Somente dados explicitamente autorizados foram removidos.
- [ ] O ambiente aprovado fica pronto para receber a nova programação, sem
      resíduos operacionais fora do escopo decidido.

## Resultado

Ainda não iniciada; nenhuma limpeza autorizada ou executada.
