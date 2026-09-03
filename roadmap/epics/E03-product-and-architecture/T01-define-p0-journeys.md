---
id: E03-T01
epic: E03
depends_on: [E01-T06, E02-T06]
---

# Definir jornadas do P0

## Objetivo

Fechar o menor produto operacional utilizável para treino e alimentação.

## Entradas

- Fundações validadas de treino e alimentação.
- Roadmap e decisões vigentes.

## Entregáveis

- `docs/product/P0.md`

## Subtarefas

- [x] Definir jornadas, telas e navegação.
- [x] Definir estados pronto, vazio, incompleto e erro.
- [x] Definir critérios de aceite observáveis.
- [x] Incluir somente os registros necessários para cumprir dieta e executar treino.
- [x] Excluir automações e áreas alheias a dieta e treino.

## Validações

- Cada jornada referencia dados existentes.
- Nenhuma tela exige dado ainda desconhecido sem estado alternativo.

## Critérios de aceite

- [x] P0 pode ser testado por comportamento, não por opinião visual.

## Resultado

Definidas duas jornadas testáveis em `docs/product/P0.md`: Dieta registra opção seguida, refeição diferente, item pulado e comentário; Treino resolve sessão, mobilidade ou descanso, separa preparação, registra séries, carga somente quando aplicável, repetições e comentários. Estados, falhas, histórico, acessibilidade e limites do P0 foram explicitados.
