---
id: E04-T03
epic: E04
depends_on: [E04-T02]
---

# Criar fronteira server-only

## Objetivo

Impedir que acesso a dados, segredos e regras privilegiadas vaze para o cliente.

## Entradas

- `docs/implementation/tasks/E04-T03.md`
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`
- `package.json`
- `tsconfig.json`

## Entregáveis

- Boundary server-only e validação mínima de ambiente definidos no guia.

## Subtarefas

- [ ] Isolar acesso a ambiente e dados.
- [ ] Retornar projeções mínimas para renderização.
- [ ] Impedir import por Client Components.
- [ ] Definir erros discriminados mínimos.

## Validações

- Build falha para import indevido no cliente.
- Nenhum segredo aparece no bundle.

## Critérios de aceite

- [ ] Entrada de dados possui um único boundary.

## Resultado

Ainda não concluída.
