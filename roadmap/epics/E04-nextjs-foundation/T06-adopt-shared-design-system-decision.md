---
id: E04-T06
epic: E04
depends_on: [E04-T02]
---

# Registrar adoção do Design System compartilhado

## Objetivo

Substituir explicitamente a direção visual local do P0 pelo contrato compartilhado de `@fradelli/ui` antes de qualquer shell ou tela de domínio.

## Contexto

A arquitetura aprovada em E03 escolheu CSS Modules e tokens globais locais. O ADR 0001 do repositório `fradelli/design-system` passou a ser a fonte normativa para tokens, tipografia, primitives e padrões visuais sem domínio. A decisão anterior deve permanecer rastreável e ser substituída por uma nova decisão, nunca reescrita silenciosamente.

## Entradas

- `roadmap/epics/E04-nextjs-foundation/T06-adopt-shared-design-system-decision.md`
- `docs/implementation/E04-T06-DETAILED-PLAN.md`
- `docs/implementation/tasks/E04-T06.md`
- `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `docs/implementation/P0-IMPLEMENTATION-GUIDE.md`
- `docs/implementation/tasks/E04-T04.md`
- `docs/implementation/tasks/E04-T05.md`
- `docs/implementation/tasks/E04-T07.md`
- `docs/implementation/tasks/E04-T08.md`
- `roadmap/epics/E04-nextjs-foundation/README.md`
- `roadmap/epics/E04-nextjs-foundation/T04-create-accessible-shell.md`
- `roadmap/epics/E04-nextjs-foundation/T05-configure-minimal-ci.md`
- `roadmap/epics/E04-nextjs-foundation/T07-validate-design-system-readiness.md`
- `roadmap/epics/E04-nextjs-foundation/T08-integrate-versioned-design-system.md`
- `roadmap/epics/E06-training-execution/T02-create-daily-training-page.md`
- `roadmap/epics/E07-nutrition-execution/T02-create-nutrition-page.md`
- `roadmap/epics/E09-future-evolution/README.md`
- `roadmap/README.md`
- `roadmap/ACTIVE.md`
- `CHANGELOG.md`
- `https://github.com/fradelli/design-system/blob/main/docs/decisions/0001-shared-design-system-foundation.md`
- `https://github.com/fradelli/design-system/blob/3e0c23f591ff458ab9e3e74dc44bb0cdba068a03/package.json`

## Escopo

- Criar a decisão local de adoção e apontar para o ADR normativo.
- Atualizar arquitetura-alvo e guia sem apagar o histórico de E03.
- Registrar ownership, fases de adoção, gates, dependências e rollback por versão.
- Documentar os contratos do package que ainda precisam de evidência.

## Fora do escopo

- Instalar Tailwind CSS, fontes ou `@fradelli/ui`.
- Criar components, shell, páginas finais ou redesign.
- Criar cards no Jira ou alterar o repositório do Design System.

## Entregáveis

- `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md`
- Arquitetura e guia de implementação atualizados com substituição explícita.
- Pacotes E04-T04, E04-T05, E04-T07 e E04-T08 coerentes com a nova ordem.

## Subtarefas

- [ ] Registrar a decisão, consequências e fronteiras de ownership.
- [ ] Marcar as escolhas anteriores substituídas sem alterar resultados concluídos.
- [ ] Definir prontidão sem instalação como gate e GitHub Packages como estado integrado.
- [ ] Registrar contratos ausentes como bloqueios, sem inventar exports ou versões.

## Validações

- Verificar links, IDs, dependências e ausência de ciclos no roadmap.
- Confirmar que nenhum arquivo de implementação ou dependência foi criado.
- Executar `git diff --check` e revisar ausência de segredo.

## Critérios de aceite

- [ ] A fonte normativa e os trechos substituídos estão explícitos.
- [ ] Kaizen e Design System possuem responsabilidades não sobrepostas.
- [ ] Shell e telas de domínio permanecem bloqueados pela adoção técnica.
- [ ] Decisões e tarefas concluídas continuam preservadas como histórico.

## Riscos

- Duplicar o ADR compartilhado e criar duas fontes normativas.
- Deixar de reconfirmar contrato publicado ao mudar uma versão `0.x`.
- Misturar domínio do Kaizen no package visual.

## Rollback

Antes da adoção técnica, reverter somente esta decisão documental. Depois que um release for consumido, substituir a decisão por novo ADR explícito e preservar o histórico.

## Resultado

Ainda não concluída.
