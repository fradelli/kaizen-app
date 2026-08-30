---
id: E05-T03
epic: E05
depends_on: [E05-T02]
---

# Criar importação idempotente

## Objetivo

Importar a fundação documental sem duplicar ou alterar silenciosamente os dados.

## Entradas

- JSONs validados, manifesto e banco migrado.

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
