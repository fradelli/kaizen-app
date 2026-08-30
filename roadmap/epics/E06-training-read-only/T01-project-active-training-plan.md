---
id: E06-T01
epic: E06
depends_on: [E05-T04]
---

# Projetar consulta do plano ativo

## Objetivo

Criar uma projeção server-side estável para leitura do plano de treino vigente.

## Entradas

- Modelo persistido e dados importados.

## Entregáveis

- Consulta tipada com plano, agenda, sessões e exercícios.

## Subtarefas

- [ ] Resolver o ponteiro do plano ativo.
- [ ] Ordenar agenda e itens de forma determinística.
- [ ] Preservar `null` e unknowns.
- [ ] Cobrir plano ausente e referências inválidas.

## Validações

- A projeção corresponde aos dados canônicos migrados.

## Critérios de aceite

- [ ] Uma única interface atende às páginas de treino.

## Resultado

Ainda não concluída.
