---
id: E03-T04
epic: E03
depends_on: [E03-T02, E03-T03]
---

# Definir arquitetura

## Objetivo

Definir uma aplicação Next.js full-stack proporcional, com regras portáveis e sem backend separado.

## Entradas

- P0, transição de dados e operação aprovados.
- Auditorias do projeto legado como referência, não autoridade.

## Entregáveis

- `docs/architecture/TARGET-ARCHITECTURE.md`
- Registro da escolha de banco e ORM.

## Subtarefas

- [ ] Definir boundaries de UI, aplicação, domínio e dados.
- [ ] Definir Server/Client Components e mutações futuras.
- [ ] Escolher banco e ORM por requisitos confirmados.
- [ ] Definir testes, migrations e segurança.

## Validações

- Não há NestJS, OpenAPI ou client HTTP interno sem consumidor real.
- Cada camada resolve um problema observado.

## Critérios de aceite

- [ ] A arquitetura permite implementar o P0 em incrementos pequenos.

## Resultado

Ainda não concluída.
