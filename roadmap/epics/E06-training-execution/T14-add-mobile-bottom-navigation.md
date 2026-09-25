---
id: E06-T14
epic: E06
depends_on: [E04-T04]
---

# Mover navegação principal para baixo no mobile

## Objetivo

Apresentar os acessos de Treino e Dieta numa barra inferior em telas mobile, com comportamento de aplicativo, sem duplicar a navegação para leitores de tela.

## Contexto conhecido

Hoje os acessos principais ficam no topo. A mudança visual é transversal ao app, mas está registrada neste épico por ter surgido na revisão da jornada de treino; não contém regra de negócio de treino.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/app/layout.tsx`
- `src/components/shared/app-shell/app-shell.tsx`
- `src/components/shared/app-shell/components/app-shell-navigation/app-shell-navigation.tsx`
- `src/components/shared/app-shell/components/app-shell-navigation/app-shell-navigation.module.css`

## Comportamento esperado

- Em mobile, Treino e Dieta aparecem fixos na parte inferior com indicação clara da rota ativa e respeito à área segura do dispositivo.
- Em desktop, a navegação permanece no topo.
- A barra não cobre conteúdo, controles ou o painel flutuante de descanso; teclado virtual e leitores de tela continuam utilizáveis.

## Escopo e impactos

- Reavaliar a estrutura real do shell e os componentes disponíveis no Design System antes de escolher os arquivos a alterar.
- Testar foco, navegação por teclado, responsividade, contraste, viewport estreita e safe area.

## Fora de escopo

- Redesenhar as páginas de dieta/treino ou criar navegação para rotas ainda inexistentes.

## Decisões antes da implementação

- Confirmar a largura de transição e o comportamento com teclado virtual na análise da tarefa.
- Reanalisar o código vigente, apresentar solução e trade-offs e aguardar aprovação explícita antes de implementar.

## Critérios de aceite

- [ ] Navegação inferior mobile e superior desktop funcionam sem duplicação acessível.
- [ ] Nenhum conteúdo fica encoberto em celular comum ou com safe area.

## Resultado

Ainda não iniciada.
