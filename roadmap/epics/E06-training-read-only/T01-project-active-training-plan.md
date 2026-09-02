---
id: E06-T01
epic: E06
depends_on: [E05-T04]
---

# Projetar treino e execução do dia

## Objetivo

Criar projeções server-side separadas para leitura pública do plano e leitura pessoal do treino e da execução da data.

## Entradas

- Modelo persistido e dados importados.

## Entregáveis

- DTO público do plano e DTO pessoal com atribuição, preparação, séries e revisão.

## Subtarefas

- [ ] Resolver o ponteiro do plano ativo.
- [ ] Resolver workspace e data sem aceitar ownership do cliente.
- [ ] Combinar atribuição, versão e execução sem perder histórico.
- [ ] Ordenar preparação, exercícios e séries de forma determinística.
- [ ] Preservar `null` e unknowns.
- [ ] Cobrir plano ausente e referências inválidas.

## Validações

- A projeção corresponde aos dados canônicos migrados.

## Critérios de aceite

- [ ] DTO anônimo não contém dados operacionais e DTO pessoal atende à página do dia.

## Resultado

Ainda não concluída.
