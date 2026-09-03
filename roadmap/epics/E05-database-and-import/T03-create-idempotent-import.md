---
id: E05-T03
epic: E05
depends_on: [E05-T02]
---

# Criar importação idempotente

## Objetivo

Importar a fundação documental sem duplicar ou alterar silenciosamente os dados.

## Entradas

- `docs/implementation/E05.md`
- `docs/decisions/DATA-SOURCE-TRANSITION.md`
- `docs/migration/MIGRATION-MANIFEST.md`
- `data/active.json`
- `data/nutrition/active.json`
- `prisma/schema.prisma`

## Entregáveis

- Importador e relatório de execução definidos no guia.

## Subtarefas

- [ ] Validar antes de gravar.
- [ ] Usar IDs e versões estáveis.
- [ ] Registrar origem e hash.
- [ ] Fazer transação onde a consistência exigir.

## Validações

- Segunda execução não cria duplicatas.
- Falha intermediária não deixa versão parcial ativa.

## Critérios de aceite

- [ ] Contagens e relações coincidem com a origem.

## Resultado

Ainda não concluída.
