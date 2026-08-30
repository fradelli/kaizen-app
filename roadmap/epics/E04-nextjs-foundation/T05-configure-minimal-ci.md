---
id: E04-T05
epic: E04
depends_on: [E04-T02, E04-T03, E04-T04]
---

# Configurar CI mínimo

## Objetivo

Executar gates proporcionais em pull requests sem pipeline empresarial antecipado.

## Entradas

- Comandos validados em E04-T02–T04.

## Entregáveis

- Workflow de PR definido no guia.

## Subtarefas

- [ ] Executar instalação reproduzível.
- [ ] Executar lint, tipos, testes e build.
- [ ] Configurar cache somente se trouxer benefício medido.

## Validações

- Workflow passa e falha deliberadamente em regressão controlada.

## Critérios de aceite

- [ ] `developer` recebe apenas mudanças que passam nos gates.

## Resultado

Ainda não concluída.
