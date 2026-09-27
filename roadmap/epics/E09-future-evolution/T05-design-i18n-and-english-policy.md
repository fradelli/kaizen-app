---
id: E09-T05
epic: E09
depends_on: [E06-T05, E07-T05, E09-T04]
---

# Projetar arquitetura i18n e política English-first

## Objetivo

Definir inglês como idioma-fonte do produto e do repositório e aprovar uma
arquitetura i18n capaz de atender outros idiomas sem espalhar traduções pelo código.

## Entradas

- `AGENTS.md`
- `.github/pull_request_template.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/app/layout.tsx`
- `src/components/shared/app-shell/app-shell.tsx`
- `roadmap/epics/E06-training-execution/README.md`
- `roadmap/epics/E07-nutrition-execution/README.md`
- `roadmap/epics/E09-future-evolution/T04-validate-sleep-and-activity-flows.md`

## Entregáveis

- Decisão arquitetural de locale, catálogo, fallback, formatação e roteamento.
- Inglês definido como idioma-fonte para UI, código, testes, documentação e PRs.
- Estratégia para preservar IDs, versões importadas, URLs antigas e histórico Git.
- Inventário do padrão i18n do Sandicts com decisões adotadas ou rejeitadas.
- Plano executável para E09-T06, E09-T07 e E09-T08.

## Subtarefas

- [ ] Identificar a referência exata do Sandicts antes de comparar implementações.
- [ ] Escolher biblioteca somente após confirmar consumidores e requisitos.
- [ ] Definir negociação, persistência e fallback de locale no servidor.
- [ ] Separar texto de produto, conteúdo canônico e documentação técnica.
- [ ] Definir política para rotas `/treino` e `/dieta` sem quebrar URLs existentes.
- [ ] Definir como impedir novas strings fora do catálogo sem falsos positivos.

## Dados ausentes

- Repositório, versão e arquivos exatos do padrão i18n do Sandicts.
- Idiomas iniciais confirmados: português, espanhol e inglês. Ordem de prioridade e locale padrão ainda serão definidos.
- Necessidade de detecção automática versus seleção explícita de idioma.

## Validações

- Provar a decisão com um spike mínimo descartável ou teste de contrato, sem migrar o produto.
- Revisar compatibilidade com Server Components, Server Actions e conteúdo versionado.

## Critérios de aceite

- [ ] A arquitetura suporta inglês e expansão de locales sem duplicar regras de negócio.
- [ ] IDs, histórico, ownership e versões canônicas possuem estratégia de preservação.
- [ ] Unknowns restantes estão explícitos e não foram convertidos em defaults.

## Fora de escopo

- Traduzir telas, dados, documentos ou PRs históricos.
- Reescrever commits, migrations aplicadas ou versões já importadas.

## Resultado

Ainda não concluída.
