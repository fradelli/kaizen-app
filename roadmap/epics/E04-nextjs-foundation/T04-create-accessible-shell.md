---
id: E04-T04
epic: E04
depends_on: [E04-T08]
---

# Criar shell acessível

## Objetivo

Criar estrutura visual responsiva e sem regra de negócio consumindo a fundação compartilhada já validada.

## Contexto

Shell, páginas, rotas, marca e composição pertencem ao Kaizen. Tokens, tipografia, foco, estados genéricos e primitives pertencem a `@fradelli/ui`; esta tarefa não pode recriá-los localmente.

## Entradas

- `docs/implementation/tasks/E04-T04.md`
- `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md`
- `docs/product/P0.md`
- `src/app/foundations/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`

## Entregáveis

- Layout, navegação mínima e estados compartilhados aprovados no guia.

## Fora do escopo

- Criar tokens, primitives ou variantes específicas do Kaizen no package.
- Compartilhar calendário, dieta, treino, hábito ou tarefa.
- Alterar a versão do Design System sem validação própria.

## Subtarefas

- [ ] Definir landmarks e navegação por teclado.
- [ ] Criar layout mobile-first.
- [ ] Consumir primitives e tokens públicos sem duplicação local.
- [ ] Criar loading, vazio e erro somente quando houver repetição real.
- [ ] Evitar providers globais sem consumidor.

## Validações

- Navegação e foco funcionam sem mouse.
- Shell não depende de banco.
- Todos os gates de E04-T08 permanecem verdes.

## Critérios de aceite

- [ ] Treino e alimentação podem ser encaixados sem duplicar layout.
- [ ] O shell permanece local e não amplia a API pública do Design System.

## Riscos

- Recriar localmente um primitive já compartilhado.
- Empurrar navegação ou domínio do Kaizen para o package.

## Rollback

Reverter somente o shell e manter a integração e a página foundations como base técnica validada.

## Resultado

Ainda não concluída.
