---
id: E07-T01
epic: E07
depends_on: [E05-T06]
---

# Projetar dieta e execução do dia

## Objetivo

Criar projeções server-side separadas do plano público e da dieta pessoal da data.

## Entradas

- `docs/implementation/E07.md`
- `docs/product/P0.md`
- `docs/architecture/DATA-MODEL.md`
- `data/nutrition/active.json`
- `src/lib/security/authorization.ts`
- `prisma/schema.prisma`

## Entregáveis

- DTO público do plano e DTO pessoal com tipo de dia, refeições, execuções e revisão.

## Subtarefas

- [ ] Resolver o ponteiro do plano ativo.
- [ ] Resolver workspace, data e tipo do dia sem inferir carga ausente.
- [ ] Preservar ordem, unidades e texto de origem.
- [ ] Representar alternativas sem equivalências inventadas.
- [ ] Combinar registros existentes sem expô-los no DTO anônimo.
- [ ] Cobrir plano ausente e referências inválidas.

## Validações

- Comparar a projeção com os dados canônicos.

## Critérios de aceite

- [ ] DTOs contêm somente os dados necessários ao modo anônimo ou pessoal correspondente.

## Resultado

Ainda não concluída.
