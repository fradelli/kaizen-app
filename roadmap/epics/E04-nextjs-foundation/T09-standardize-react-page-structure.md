---
id: E04-T09
epic: E04
depends_on: [E04-T04]
---

# Padronizar estrutura das páginas React

## Objetivo

Deixar as entradas de rota finas e separar renderização, estilos, contratos,
constantes e interatividade dos componentes existentes, preservando o resultado
visual e mantendo Server Components como padrão.

## Contexto

O shell já estabelece a fronteira mínima entre servidor e cliente, mas as
páginas placeholder de Dieta e Treino ainda concentram markup e classes na
entrada de rota. A página técnica `/foundations` também mantém toda a árvore no
cliente por causa de uma única demonstração interativa. Esta tarefa corrige
essas responsabilidades sem antecipar as features E06 e E07.

## Entradas

- `docs/implementation/tasks/E04-T09.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/app/dieta/page.tsx`
- `src/app/treino/page.tsx`
- `src/app/foundations/page.tsx`
- `src/app/foundations/page.test.tsx`
- `src/components/shared/app-shell/app-shell.tsx`

## Entregáveis

- Entradas de rota limitadas à composição e aos dados estáticos da rota.
- Placeholder compartilhado com renderização, estilos, contratos e testes separados.
- `/foundations` server-side com a demonstração de `Sheet` isolada em uma ilha Client.
- Convenções verificáveis sem arquivos vazios ou abstrações sem consumidor.

## Fora do escopo

- Implementar dados, formulários ou regras reais de treino e alimentação.
- Criar Server Actions, acesso a banco, sessão, providers ou cliente HTTP interno.
- Alterar primitives, tokens, versão ou API pública de `@fradelli/ui`.
- Redesenhar o shell ou modificar o comportamento visual aprovado na E04-T04.

## Subtarefas

- [ ] Extrair o placeholder reutilizado por Dieta e Treino para componente compartilhado.
- [ ] Separar props e composição de classes em arquivos com responsabilidade explícita.
- [ ] Manter `src/app/dieta/page.tsx` e `src/app/treino/page.tsx` como Server Components finos.
- [ ] Mover a composição visual de foundations para uma família de componente própria.
- [ ] Restringir `"use client"` ao exemplo interativo que realmente usa `Sheet`.
- [ ] Separar a lista fixa de amostras de cor em constantes tipadas.
- [ ] Mover e ampliar testes sem alterar nomes acessíveis ou comportamento.
- [ ] Não criar hooks, utils, tipos ou barrels sem responsabilidade concreta.

## Validações

- `page.tsx` contém somente composição de rota e permanece sem `"use client"`.
- Apenas componentes que usam hooks, estado ou APIs do navegador possuem `"use client"`.
- Client Components não importam Prisma, dados, application layer ou módulos server-only.
- Dieta, Treino e Foundations preservam conteúdo, landmarks, foco e navegação.
- Viewport de 320 px e zoom de 200% não geram rolagem horizontal.
- Formato, lint, tipos, testes, integridade, build e auditoria passam.

## Critérios de aceite

- [ ] O JSX das entradas de rota não concentra estilos nem blocos visuais reutilizáveis.
- [ ] O placeholder possui dois consumidores reais e pode ser removido quando E06/E07 o substituírem.
- [ ] `/foundations` renderiza sua composição estática no servidor.
- [ ] A menor ilha Client contém somente a demonstração interativa necessária.
- [ ] Nenhum arquivo existe apenas para satisfazer uma convenção nominal.

## Riscos

- Criar abstração temporária maior que os dois placeholders consumidores.
- Alterar a demonstração técnica de foundations durante uma refatoração estrutural.
- Empurrar primitives do Design System ou dados server-only para módulos client.

## Rollback

Reverter as extrações e restaurar as páginas da E04-T04/E04-T08, sem alterar o
shell, a integração do Design System ou os contratos de dados.

## Resultado

Ainda não concluída.
