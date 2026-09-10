# Guia de implementação do P0

## Status do documento

- **Escopo:** índice da implementação incremental do MVP pessoal.
- **Repositório:** `fradelli/kaizen-app`.
- **Branch de integração:** `developer`.
- **Estado:** aprovado e modularizado.
- **Evidência:** produto, arquitetura, transição de dados, privacidade e operação aprovados em E03.
- **Fora de escopo:** código da aplicação, credenciais e decisões comerciais futuras.

## Objetivo

Orientar a sequência da primeira linha de código até produção sem obrigar o Codex a carregar todo o plano em cada tarefa. Este arquivo é um índice; a implementação copiável fica nos pacotes pequenos listados abaixo.

## Protocolo de leitura

1. Leia `AGENTS.md`, `roadmap/ACTIVE.md` e a tarefa ativa.
2. Abra somente o pacote indicado em `Entradas` pela tarefa.
3. Abra decisões, dados ou schemas somente quando seus caminhos estiverem listados explicitamente.
4. Não leia este índice durante uma tarefa já roteada, salvo para auditar a ordem global.

## Decisões estruturais

- Uma aplicação Next.js full-stack com App Router e TypeScript estrito.
- PostgreSQL local em container e Neon em preview/produção, acessados por Prisma.
- JSON versionado define planos; PostgreSQL guarda importações, atribuições e execuções.
- Sessão e autorização server-side são implementadas em E05-T06, antes de qualquer feature operacional.
- E05-T05 comprova backup/restore local; Neon e restore gerenciado pertencem a E08.
- `@fradelli/ui@0.1.0` será adotado antes do shell, após um gate de prontidão sem instalação e por versão exata no GitHub Packages.
- O Design System mantém foundations e primitives sem domínio; shell, páginas, calendário e semântica de produto permanecem no Kaizen.
- A [`decisão local de adoção`](../decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md) registra a substituição visual, o ownership e o rollback sem duplicar o ADR normativo.
- Cada tarefa usa branch e PR próprias para `developer`, com squash antes da próxima.

## Versões aprovadas

Verificadas em 2026-09-02. Atualização exige evidência de compatibilidade e segurança na PR responsável.

| Pacote/runtime | Versão |
| --- | --- |
| Node.js | `24.20.0` |
| pnpm | `11.25.0` |
| Next.js | `16.3.4` |
| React / React DOM | `19.2.8` |
| TypeScript | `7.0.2` |
| tipos Node / React / React DOM | `26.4.1` / `19.2.18` / `19.2.5` |
| ESLint / eslint-config-next | `10.9.1` / `16.3.4` |
| Prettier | `3.9.6` |
| Vitest / coverage-v8 | `4.1.11` |
| Testing Library React / jest-dom | `16.3.3` / `7.0.1` |
| jsdom | `30.0.1` |
| Zod / server-only | `4.5.4` / `0.0.1` |
| Prisma CLI/Client/adapter-pg | `7.10.0` |
| pg / tipos pg | `8.23.0` / `8.23.1` |
| jose | `6.2.10` |
| tsx | `4.23.13` |
| Ajv / ajv-formats | `8.20.0` / `3.0.1` |
| Playwright / axe-core Playwright | `1.62.1` / `4.13.0` |

Não usar `prisma@latest`: o dist-tag observado na aprovação apontava para Prisma 8 release candidate. O pacote de E05 contém os pins estáveis aprovados.

## Dependências visuais planejadas

`@fradelli/ui` possui versão aprovada `0.1.0` e deve ser instalado exatamente assim em E04-T08. Tailwind CSS 4, `@tailwindcss/postcss` e PostCSS recebem pins exatos na execução de E04-T08 após reconfirmação de compatibilidade com o peer `>=4.3.0 <5`. Até lá, não adicionar `latest`, range, caminho local ou valor estimado.

## Pacotes de implementação

| Escopo | Pacote | Fonte operacional |
| --- | --- | --- |
| E04-T01 | [`tasks/E04-T01.md`](tasks/E04-T01.md) | [`T01-scaffold-nextjs.md`](../../roadmap/epics/E04-nextjs-foundation/T01-scaffold-nextjs.md) |
| E04-T02 | [`tasks/E04-T02.md`](tasks/E04-T02.md) | [`T02-configure-static-quality.md`](../../roadmap/epics/E04-nextjs-foundation/T02-configure-static-quality.md) |
| E04-T03 | [`tasks/E04-T03.md`](tasks/E04-T03.md) | [`T03-create-server-only-boundary.md`](../../roadmap/epics/E04-nextjs-foundation/T03-create-server-only-boundary.md) |
| E04-T04 | [`tasks/E04-T04.md`](tasks/E04-T04.md) | [`T04-create-accessible-shell.md`](../../roadmap/epics/E04-nextjs-foundation/T04-create-accessible-shell.md) |
| E04-T05 | [`tasks/E04-T05.md`](tasks/E04-T05.md) | [`T05-configure-minimal-ci.md`](../../roadmap/epics/E04-nextjs-foundation/T05-configure-minimal-ci.md) |
| E04-T06 | [`tasks/E04-T06.md`](tasks/E04-T06.md) | [`T06-adopt-shared-design-system-decision.md`](../../roadmap/epics/E04-nextjs-foundation/T06-adopt-shared-design-system-decision.md) |
| E04-T07 | [`tasks/E04-T07.md`](tasks/E04-T07.md) | [`T07-validate-design-system-readiness.md`](../../roadmap/epics/E04-nextjs-foundation/T07-validate-design-system-readiness.md) |
| E04-T08 | [`tasks/E04-T08.md`](tasks/E04-T08.md) | [`T08-integrate-versioned-design-system.md`](../../roadmap/epics/E04-nextjs-foundation/T08-integrate-versioned-design-system.md) |
| E05 | [`E05.md`](E05.md) | [`E05`](../../roadmap/epics/E05-database-and-import/README.md) |
| E06 | [`E06.md`](E06.md) | [`E06`](../../roadmap/epics/E06-training-execution/README.md) |
| E07 | [`E07.md`](E07.md) | [`E07`](../../roadmap/epics/E07-nutrition-execution/README.md) |
| E08 | [`E08.md`](E08.md) | [`E08`](../../roadmap/epics/E08-personal-release/README.md) |

## Ordem de entrega

| Ordem | Tarefa | Gate de saída |
| ---: | --- | --- |
| 1 | E04-T01 | instalação, execução local e build |
| 2 | E04-T02 | formato, lint, tipos e testes |
| 3 | E04-T06 | decisão de adoção, arquitetura e guia atualizados |
| 4 | E04-T03 | boundary server-only e ambiente testados |
| 5 | E04-T05 | CI e rulesets ativos antes da adoção visual |
| 6 | E04-T07 | GO/NO-GO técnico registrado sem instalar o package |
| 7 | E04-T08 | `@fradelli/ui@0.1.0`, foundations e instalação reproduzível |
| 8 | E04-T04 | shell acessível com Dieta/Treino sobre o Design System |
| 9 | E05-T01 | modelo e metadados aprovados |
| 10 | E05-T02 | migrations reproduzíveis |
| 11 | E05-T03 | importação idempotente |
| 12 | E05-T04 | integridade persistida testada |
| 13 | E05-T05 | backup e restore locais comprovados |
| 14 | E05-T06 | sessão, autorização e pareamento testados |
| 15–19 | E06-T01…T05 | fluxo de Treino íntegro; tela depende do shell |
| 20–24 | E07-T01…T05 | fluxo de Dieta íntegro; tela depende do shell |
| 25–29 | E08-T01…T05 | preview, hardening, produção e rollback |

E04-T03 pode começar após E04-T02, mas o ponteiro ativo seleciona primeiro E04-T06 para registrar a decisão. O CI precede a validação de prontidão; o shell depende da integração versionada. E06 e E07 só começam após E05-T06, e suas telas dependem também de E04-T04.

## Validação acumulada

Após E04, os scripts existentes devem cobrir instalação congelada inclusive do package privado, formato, lint, tipos, testes, cobertura, dados e build. A página foundations comprova CSS público, `@source`, Inter, dark, acessibilidade e responsividade antes do shell. Após E05, acrescentar migration em banco limpo, importação repetida, constraints, backup/restore local e testes de autorização.

Verificações manuais permanentes:

- nenhum segredo, caminho local ou dado operacional no Git;
- DTO anônimo nunca contém atribuição, execução ou comentário;
- carga ausente quando não aplicável;
- datas civis corretas em `America/Sao_Paulo`;
- histórico preserva a versão apresentada;
- preview nunca usa banco ou segredo de produção.

## Rollback

| Falha | Ação segura |
| --- | --- |
| scaffold não instala/builda | reverter somente E04-T01; dados e documentos permanecem |
| check incompatível | corrigir a configuração; não desabilitar o gate |
| prontidão reprovada | manter E04-T08 bloqueada e corrigir o gate ou acesso ausente |
| package privado incompatível | reverter a PR inicial ou fixar a última versão exata conhecida como boa |
| registry indisponível ou sem acesso | falhar a instalação; não copiar código nem usar versão flutuante |
| migration falha | abortar, corrigir adiante e testar banco limpo |
| importação falha | rollback transacional; preservar ativação anterior |
| acesso falha | bloquear operação pessoal até corrigir sessão/autorização |
| feature falha | reverter código compatível; não apagar execuções |
| sessão comprometida | rotacionar hash e segredo, redeploy e revisar logs sanitizados |
| perda/corrupção | interromper escrita, restaurar isoladamente, validar e promover |

Nunca usar force push, reescrita de histórico, `prisma migrate reset` fora de banco descartável ou edição manual de produção como procedimento normal.

## Decisões futuras com responsável

- E05-T01 classifica `measurement_type` e `load_applicable` exercício por exercício.
- E04-T05 audita os SHAs das GitHub Actions antes de criar o workflow.
- E04-T06 registra a substituição explícita da direção visual anterior.
- E04-T07 confirma runtimes, gates, CI, acesso e o contrato publicado de `@fradelli/ui@0.1.0` sem instalar.
- E04-T08 instala a versão exata e fixa a toolchain/configuração comprovada no consumidor.
- E08-T03 reconfirma custos/limites e escolhe armazenamento privado para backup cifrado.
- Segredos e IDs reais são gerados fora do Git no ambiente correspondente.

As pendências de E04-T07/E04-T08 não bloqueiam E04-T02, E04-T06, E04-T03 ou E04-T05. E04-T08 permanece bloqueada até o relatório de prontidão emitir GO.

## Critérios de manutenção

- Cada pacote possui somente o contexto de sua tarefa ou épico.
- A tarefa ativa lista caminhos exatos e não exige leitura deste índice inteiro.
- Arquivos gerados são marcados como `GENERATE`, nunca simulados.
- Nenhum exemplo contém segredo ou placeholder operacional.
- Novas dependências e decisões entram primeiro no pacote responsável, sem duplicação em outros documentos.
