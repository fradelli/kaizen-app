# E04-T06 — Plano detalhado de implementação

## Status do documento

- **Escopo:** planejar a entrega documental que registra a adoção do Design System compartilhado.
- **Repositório:** `kaizen-app`.
- **Branch observada:** `codex/E04-T06-adopt-shared-design-system`.
- **Estado do plano:** executado; implementação documental pronta para validação local.
- **Natureza da entrega:** documentação e roadmap; nenhuma dependência ou aplicação será alterada.
- **Evidência local:** `AGENTS.md`, `roadmap/ACTIVE.md`, pacote E04-T06, arquitetura-alvo, guia do P0 e pacotes E04-T04/E04-T05.
- **Evidência externa imutável:** tag `v0.1.0` do Design System, commit `3e0c23f591ff458ab9e3e74dc44bb0cdba068a03`.
- **Fora do escopo:** instalar packages, configurar Tailwind/PostCSS, carregar fonte, criar shell/provider/página de domínio, editar `src/`, alterar lockfile ou criar card Jira.

## Resultado pretendido

Ao final da E04-T06, o Kaizen terá uma decisão local que:

1. adota por referência o ADR normativo do Design System;
2. substitui explicitamente apenas a direção visual aprovada em E03;
3. mantém o restante da arquitetura e os resultados concluídos intactos;
4. separa ownership do package e do aplicativo sem sobreposição;
5. define a sequência decisão → prontidão → integração versionada → shell;
6. registra os fatos publicados de `@fradelli/ui@0.1.0` e deixa os gaps operacionais para E04-T07/E04-T08;
7. não apresenta adoção documental como integração técnica concluída.

## Fatos, decisões e pendências

### Fatos confirmados

- O ADR 0001 do Design System está aceito e define `fradelli/design-system` como fonte normativa.
- A tag `v0.1.0` existe e aponta para o commit `3e0c23f591ff458ab9e3e74dc44bb0cdba068a03`.
- O manifesto desse commit declara `@fradelli/ui` na versão `0.1.0`.
- O package é restrito e publicado em `https://npm.pkg.github.com`.
- O engine é Node `>=24.20.0 <25`.
- Os peers são React e React DOM `>=19.2.7 <20` e Tailwind CSS opcional `>=4.3.0 <5`.
- O CSS público é `@fradelli/ui/styles.css`, resolvido para `./dist/styles.css`.
- O artefato publicado inclui `dist` e expõe `alert`, `badge`, `button`, `card`, `cn`, `field`, `input`, `label`, `separator`, `sheet` e `skeleton` por subpaths.
- Inter variável, dark-first, `--font-inter`, `@source` explícito e ausência de domínio no package pertencem ao contrato normativo.

### Decisões a registrar no Kaizen

- Consumir `@fradelli/ui` como package externo, sem copiar tokens ou primitives.
- Fixar a versão exata no consumidor; a versão inicial planejada é `0.1.0`.
- Manter repositórios e ciclos de release separados; a rejeição ao monorepo continua válida por esse motivo.
- Usar CSS local somente para composição específica do Kaizen.
- Manter shell, páginas, calendário composto, marca, rotas, textos, i18n e semântica de domínio no Kaizen.
- Exigir um gate de prontidão sem instalação em E04-T07 e fazer a integração real apenas em E04-T08.

### Pendências que não bloqueiam E04-T06

- autenticação local no GitHub Packages;
- `packages: read` e credencial efêmera no workflow;
- caminho relativo final de `@source` a partir de `src/app/globals.css`;
- pins exatos de Tailwind CSS, `@tailwindcss/postcss` e PostCSS no consumidor;
- instalação congelada e build do artefato real;
- confirmação de uma única cópia de React/React DOM.

Essas pendências devem permanecer verificáveis em E04-T07/E04-T08. Não usar placeholders ou suposições para fechá-las nesta tarefa.

## Pré-condições e proteção do trabalho existente

1. E04-T02 foi concluída na branch `codex/E04-T02-configure-static-quality`, commit `4294a273236ba1ab3da3455b65077e62927cf946`.
2. `developer` deve conter esse resultado antes da abertura/merge da PR de E04-T06, sem trazer a implementação de E04-T02 para esta branch documental.
3. O worktree observado já contém alterações não commitadas nos documentos da adoção. Preservá-las e revisar arquivo por arquivo; não substituir arquivos inteiros sem comparar o diff.
4. Antes de editar, reconciliar `Entradas`, `Entregáveis` e `Ações de arquivo`. O pacote atual menciona mutações que não aparecem em `Entradas`, enquanto o worktree contém mudanças adicionais.
5. Classificar qualquer mudança em `roadmap/epics/E09-future-evolution/README.md` como fora do escopo, salvo se uma necessidade explícita e rastreável for adicionada ao pacote.

## Ordem de dependências

```text
E04-T02 DONE
    |
    v
E04-T06 decisão documental
    |
    +----------> E04-T03 boundary server-only
                      |
                      v
                 E04-T05 CI mínimo
                      |
                      v
                 E04-T07 prontidão GO/NO-GO
                      |
                      v
                 E04-T08 integração 0.1.0
                      |
                      v
                 E04-T04 shell acessível
                      |
                      +----> E06-T02 treino
                      +----> E07-T02 dieta
```

E04-T05 depende de E04-T02, E04-T03 e E04-T06. E04-T07 depende de E04-T05 e E04-T06. E04-T08 depende de E04-T07. E04-T04 depende de E04-T08.

## Inventário canônico proposto

O primeiro passo da execução deve alinhar o pacote a este inventário. Caminhos marcados como condicionais só entram se a atualização de dependências realmente exigir a mudança.

| Ordem | Ação | Caminho | Obrigatório | Finalidade |
| ---: | --- | --- | --- | --- |
| 1 | EDIT | `roadmap/epics/E04-nextjs-foundation/T06-adopt-shared-design-system-decision.md` | Sim | Tornar `Entradas`, entregáveis, subtarefas e aceite coerentes com todos os arquivos realmente tocados. |
| 2 | EDIT | `docs/implementation/tasks/E04-T06.md` | Sim | Consolidar o pacote operacional, o contrato publicado e os gaps sem contradizer a fonte normativa. |
| 3 | CREATE | `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md` | Sim | Registrar a decisão local, substituição, ownership, fases, segurança, riscos e rollback. |
| 4 | EDIT | `docs/architecture/TARGET-ARCHITECTURE.md` | Sim | Substituir somente a direção visual e manter E03 rastreável. |
| 5 | EDIT | `docs/implementation/P0-IMPLEMENTATION-GUIDE.md` | Sim | Incorporar E04-T06–T08 e a nova ordem de gates. |
| 6 | EDIT | `docs/implementation/tasks/E04-T04.md` | Sim | Fazer o shell depender da integração e impedir primitives/tokens locais duplicados. |
| 7 | EDIT | `docs/implementation/tasks/E04-T05.md` | Sim | Antecipar CI e reservar autenticação do package para E04-T08. |
| 8 | CREATE/EDIT | `docs/implementation/tasks/E04-T07.md` | Sim | Definir o gate de prontidão sem instalação e o relatório GO/NO-GO. |
| 9 | CREATE/EDIT | `docs/implementation/tasks/E04-T08.md` | Sim | Definir a integração exata pelo GitHub Packages e suas evidências. |
| 10 | EDIT | `roadmap/epics/E04-nextjs-foundation/README.md` | Sim | Sincronizar ordem e critérios de encerramento de E04. |
| 11 | EDIT | `roadmap/epics/E04-nextjs-foundation/T04-create-accessible-shell.md` | Sim | Alterar `depends_on` para E04-T08 e alinhar o ownership. |
| 12 | EDIT | `roadmap/epics/E04-nextjs-foundation/T05-configure-minimal-ci.md` | Sim | Alterar dependências e manter autenticação fora desta tarefa. |
| 13 | CREATE/EDIT | `roadmap/epics/E04-nextjs-foundation/T07-validate-design-system-readiness.md` | Sim | Criar fonte operacional de E04-T07 com entradas exatas. |
| 14 | CREATE/EDIT | `roadmap/epics/E04-nextjs-foundation/T08-integrate-versioned-design-system.md` | Sim | Criar fonte operacional de E04-T08 com entradas exatas. |
| 15 | EDIT | `roadmap/README.md` | Sim | Registrar IDs, links, estados e dependências canônicas. |
| 16 | EDIT | `roadmap/ACTIVE.md` | Sim | Mover o ponteiro conforme a transição real de status. |
| 17 | EDIT | `roadmap/epics/E06-training-execution/T02-create-daily-training-page.md` | Condicional | Tornar explícita a dependência da tela de treino em E04-T04. |
| 18 | EDIT | `roadmap/epics/E07-nutrition-execution/T02-create-nutrition-page.md` | Condicional | Tornar explícita a dependência da tela de dieta em E04-T04. |
| 19 | EDIT | `CHANGELOG.md` | Sim, na conclusão | Registrar uma única entrega material, sem alegar integração técnica. |

`roadmap/epics/E04-nextjs-foundation/T06-adopt-shared-design-system-decision.md` já é a fonte operacional da própria tarefa e não precisa de uma segunda cópia. Os pacotes T07/T08 só devem ser adicionados ao inventário quando seus caminhos exatos também constarem nas `Entradas` da E04-T06.

## Mudanças detalhadas por arquivo

### 1. `roadmap/epics/E04-nextjs-foundation/T06-adopt-shared-design-system-decision.md`

**Ação:** editar antes dos demais arquivos.

**Local exato:** frontmatter, `Entradas`, `Entregáveis`, `Subtarefas`, `Validações`, `Critérios de aceite` e, apenas ao concluir, `Resultado`.

**Mudança:** listar todos os caminhos obrigatórios que a tarefa realmente lê ou modifica. Incluir explicitamente a decisão nova, os pacotes T07/T08, fontes operacionais T04–T08, índices e changelog quando permanecerem no escopo.

**Motivo:** a regra do repositório permite ler somente entradas exatas. O inventário atual não cobre todas as mutações já planejadas.

**Verificação:** cada arquivo no diff deve aparecer em `Entradas` ou ser removido do escopo; nenhuma expressão vaga deve substituir um caminho.

### 2. `docs/implementation/tasks/E04-T06.md`

**Ação:** editar sem apagar as regras já registradas.

**Local exato:** adicionar `Entradas` se a seção continuar ausente; alinhar `Ações de arquivo`, `Dependências`, `Critérios de aceite`, `Validações`, `Contrato conhecido e gaps` e eventual `Resultado`.

**Mudança:** separar quatro classes de informação:

- fonte normativa externa;
- consequências específicas do Kaizen;
- fatos publicados na versão `0.1.0`;
- gaps que pertencem a E04-T07/E04-T08.

**Motivo:** evitar que o pacote duplique o ADR ou declare como comprovada uma integração ainda inexistente.

**Verificação:** todas as ações têm caminho exato e toda pendência tem uma tarefa responsável.

### 3. `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md`

**Ação:** criar.

**Local exato:** arquivo completo.

**Estrutura obrigatória:**

1. status `aceita`, data, tarefa e escopo;
2. fonte normativa em `main` e snapshot de evidência no commit `3e0c23f591ff458ab9e3e74dc44bb0cdba068a03`;
3. contexto da decisão E03 e do scaffold transitório de E04-T01;
4. decisão de consumir `@fradelli/ui` por versão exata;
5. seção “Decisões substituídas” limitada a “CSS Modules + tokens globais como fundação exclusiva” e à rejeição absoluta de Tailwind/biblioteca;
6. matriz de ownership Design System × Kaizen;
7. contrato publicado da versão `0.1.0`;
8. fases E04-T06, E04-T07, E04-T08 e E04-T04;
9. segurança do registry e proibição de credenciais no Git;
10. validações acumuladas;
11. riscos, rollback e condições de revisão;
12. pendências verificáveis, com owner por tarefa.

**Regras de conteúdo:** não copiar paletas, tokens nem contratos completos do ADR externo. O documento local registra somente a decisão de consumo e suas consequências no Kaizen.

**Verificação:** o texto permite responder, sem ambiguidade, quem mantém cada responsabilidade e qual tarefa comprova cada gap.

### 4. `docs/architecture/TARGET-ARCHITECTURE.md`

**Ação:** editar de forma cirúrgica.

**Locais exatos:** `Status`, tabela `Stack escolhida`, `UI`, `Incrementos`, `Alternativas rejeitadas no P0`, `Fontes oficiais` e `Critério de conclusão` se necessário.

**Mudança:**

- preservar data, tarefa e aprovação original de E03;
- adicionar uma revisão posterior que aponte para a decisão E04-T06;
- trocar a fundação exclusiva local por Tailwind CSS 4 + CSS público de `@fradelli/ui`, mantendo CSS Modules apenas para composição local;
- registrar o package compartilhado sem transformar o Kaizen em monorepo;
- manter domínio, shell, páginas e calendário fora do package;
- substituir a rejeição absoluta a Tailwind/biblioteca por uma nota histórica explicitamente superada;
- reformular a rejeição ao monorepo: o motivo é preservar ciclos independentes, não a inexistência de packages reutilizados;
- atualizar o incremento E04 para incluir decisão, prontidão, integração e shell nessa ordem.

**Motivo:** o arquivo atual ainda contém duas afirmações incompatíveis com a decisão nova: a linha de estilos e a alternativa rejeitada de Tailwind/biblioteca.

**Verificação:** buscar `CSS Modules`, `Tailwind`, `biblioteca de componentes`, `Monorepo` e `@fradelli/ui`; toda ocorrência deve ser histórica ou coerente com a nova decisão.

### 5. `docs/implementation/P0-IMPLEMENTATION-GUIDE.md`

**Ação:** editar e preservar todos os pacotes E05–E08 não afetados.

**Locais exatos:** premissas, versões/dependências visuais, tabela de pacotes, ordem de execução, validação acumulada, rollback e decisões pendentes.

**Mudança:**

- incluir E04-T06, E04-T07 e E04-T08 com links relativos válidos;
- registrar `@fradelli/ui@0.1.0` como versão inicial exata;
- não inventar pins da toolchain CSS;
- ordenar E04-T02 → T06 → T03 → T05 → T07 → T08 → T04;
- fazer T07 produzir GO/NO-GO sem instalar e T08 executar a integração;
- acrescentar rollback por versão e falha segura do registry;
- fazer telas de domínio dependerem do shell sem alterar seu escopo funcional.

**Verificação:** a tabela de ordem, os links e o grafo do roadmap devem descrever a mesma sequência.

### 6. `docs/implementation/tasks/E04-T04.md`

**Ação:** editar.

**Locais exatos:** título/status, fonte, versões, ownership, ações, validação e rollback.

**Mudança:** bloquear o shell até E04-T08, consumir primitives publicados quando aplicáveis e permitir CSS Module apenas para layout/composição. Proibir clones locais de tokens e primitives.

**Verificação:** o pacote não instala dependências e não cria primitive ausente para contornar o contrato compartilhado.

### 7. `docs/implementation/tasks/E04-T05.md`

**Ação:** editar.

**Locais exatos:** contexto/dependências, matriz do workflow, nota de GitHub Packages, validação e rollback.

**Mudança:** executar CI antes da integração visual, manter gates locais equivalentes e reservar `packages: read`/autenticação efêmera para E04-T08.

**Verificação:** não existe PAT, `_authToken`, segredo, placeholder autenticado ou permissão de package prematura.

### 8. `docs/implementation/tasks/E04-T07.md`

**Ação:** criar ou revisar o arquivo já presente no worktree.

**Local exato:** arquivo completo.

**Mudança:** definir diagnóstico de engines, peers, exports, gates, CI e estratégia de autenticação sem instalação; produzir `docs/implementation/evidence/E04-T07-DESIGN-SYSTEM-READINESS.md` com decisão GO/NO-GO.

**Verificação:** o aceite proíbe alterações em package, lockfile, `.tgz`, `src/` e dependência `file:`.

### 9. `docs/implementation/tasks/E04-T08.md`

**Ação:** criar ou revisar o arquivo já presente no worktree.

**Local exato:** arquivo completo.

**Mudança:** condicionar a integração ao GO de E04-T07; listar `.npmrc`, manifest/lockfile, PostCSS, globals, layout, página foundations, testes e CI como ações prováveis que só serão fechadas com evidência real.

**Verificação:** manter como desconhecidos o caminho relativo de `@source` e os pins CSS até a execução; nenhuma credencial entra no repositório.

### 10. Fontes operacionais e índice do épico E04

**Arquivos:**

- `roadmap/epics/E04-nextjs-foundation/README.md`;
- `roadmap/epics/E04-nextjs-foundation/T04-create-accessible-shell.md`;
- `roadmap/epics/E04-nextjs-foundation/T05-configure-minimal-ci.md`;
- `roadmap/epics/E04-nextjs-foundation/T07-validate-design-system-readiness.md`;
- `roadmap/epics/E04-nextjs-foundation/T08-integrate-versioned-design-system.md`.

**Ação:** editar/criar conforme o inventário.

**Mudança:** sincronizar `depends_on`, entradas exatas, entregáveis, subtarefas, riscos e rollback. O README do épico deve listar a ordem completa e os critérios de encerramento: instalação exata, foundations, Inter, dark, CSS público, `@source`, gates e ausência de domínio.

**Verificação:** todos os IDs existem, nenhum ciclo é introduzido e cada dependência representa um gate real.

### 11. `roadmap/README.md` e `roadmap/ACTIVE.md`

**Ação:** editar somente quando a transição real ocorrer.

**Mudança de estado esperada:**

- antes da execução: E04-T02 deve estar `DONE` e E04-T06 deve estar `READY`;
- durante a execução: no máximo E04-T06 fica `IN_PROGRESS`;
- na conclusão: E04-T06 fica `DONE`, E04-T03 fica `READY` e `ACTIVE.md` aponta para E04-T03;
- E04-T04, T05, T07 e T08 continuam bloqueadas pelo grafo até suas dependências serem concluídas.

**Verificação:** índice global, README do épico e ponteiro ativo usam os mesmos estados e dependências.

### 12. Dependências das telas de domínio

**Arquivos condicionais:**

- `roadmap/epics/E06-training-execution/T02-create-daily-training-page.md`;
- `roadmap/epics/E07-nutrition-execution/T02-create-nutrition-page.md`.

**Ação:** editar apenas se o roadmap ainda não expressar a dependência no shell.

**Mudança:** adicionar E04-T04 a `depends_on`, preservando as dependências de dados/aplicação de cada tela.

**Verificação:** as páginas de domínio não podem começar antes do shell, mas o Design System não vira dependência direta das regras de negócio.

### 13. `CHANGELOG.md`

**Ação:** editar uma vez na conclusão.

**Mudança:** registrar adoção documental, nova ordem, ownership e gaps encaminhados. Dizer explicitamente que nenhum package, fonte, Tailwind, component, credencial ou código de aplicação foi instalado/criado.

**Motivo:** o worktree observado contém duas entradas sucessivas sobre o mesmo planejamento. Na entrega final, consolidar em uma única entrada material para evitar duplicidade narrativa.

**Verificação:** a entrada descreve somente fatos comprovados pela PR.

## Estratégia de execução

### Fase 0 — Gate e reconciliação

1. Confirmar E04-T02 em `DONE` e em `developer`.
2. Proteger as alterações locais existentes.
3. Comparar o diff com o inventário canônico.
4. Completar `Entradas` antes de ler ou editar novos caminhos.
5. Remover do escopo mudanças sem consumidor direto nesta tarefa.

### Fase 1 — Decisão e arquitetura

1. Criar a decisão local por referência.
2. Atualizar a arquitetura-alvo somente nos pontos visuais.
3. Fazer uma busca por decisões antigas contraditórias.
4. Revisar ownership e garantir que nenhuma semântica de domínio foi movida.

### Fase 2 — Planejamento técnico futuro

1. Atualizar o guia P0.
2. Ajustar E04-T04 e E04-T05.
3. Fechar os pacotes E04-T07/E04-T08 com entradas e evidências claras.
4. Separar fatos de `0.1.0` de gaps operacionais.

### Fase 3 — Roadmap e rastreabilidade

1. Sincronizar fontes operacionais T04–T08.
2. Atualizar README do épico e índice global.
3. Ajustar dependências das telas somente se necessário.
4. Atualizar `ACTIVE.md` de acordo com o estado real, nunca antecipadamente.
5. Consolidar uma entrada de changelog.

### Fase 4 — Validação e encerramento

1. Executar buscas de coerência.
2. Validar links relativos, IDs e grafo.
3. Confirmar diff exclusivamente documental.
4. Executar `git diff --check`.
5. revisar ausência de segredos.
6. Preencher `Resultado` com evidências concisas e atualizar estados.

## Validação proposta

### Coerência documental

```powershell
rg -n "E04-T0[4-8]" roadmap docs/implementation
rg -n "Tailwind|@fradelli/ui|Inter|font-inter|@source|dark" docs roadmap
rg -n "CSS Modules|tokens globais|biblioteca de componentes|Monorepo" docs roadmap
```

Resultado esperado: todas as referências antigas estão explicitamente marcadas como históricas/substituídas ou permanecem válidas para composição local.

### Escopo do diff

```powershell
git diff --name-only
git diff --name-only -- src package.json pnpm-lock.yaml .npmrc postcss.config.mjs
```

Resultado esperado: o segundo comando não produz saída. Arquivos não listados nas `Entradas` também não devem aparecer no primeiro.

### Higiene e segredos

```powershell
git diff --check
git diff -- . ':!pnpm-lock.yaml' | rg -ni "auth(token)?|credential|secret|pat"
```

Resultado esperado: nenhum erro de whitespace e nenhuma credencial. Menções literais a `_authToken` só podem existir como proibição documental, nunca com valor.

### Links, IDs e dependências

- abrir cada link relativo novo a partir do documento que o declara;
- confirmar que E04-T06, E04-T07 e E04-T08 têm um único arquivo operacional e um único pacote de implementação;
- confirmar que todos os IDs em `depends_on` existem em `roadmap/README.md`;
- confirmar ausência de ciclos no encadeamento E04;
- confirmar no máximo uma tarefa `IN_PROGRESS`;
- confirmar que tarefas concluídas mantêm checklist e `Resultado` imutáveis.

## Critérios de aceite do plano

- [x] E04-T02 está concluída na branch própria; sua integração em `developer` permanece como gate da PR.
- [ ] O inventário de `Entradas` cobre exatamente o diff pretendido.
- [ ] A decisão local referencia o ADR externo sem copiar a paleta ou criar fonte normativa concorrente.
- [ ] “CSS Modules + tokens globais” deixa de ser a fundação visual exclusiva e permanece rastreável como decisão substituída.
- [ ] A rejeição ao monorepo é reformulada sem sugerir ausência de package compartilhado.
- [ ] Ownership do Design System e do Kaizen não se sobrepõe.
- [ ] `@fradelli/ui@0.1.0`, CSS público, `dist`, engines, peers e exports são registrados com evidência imutável.
- [ ] Gaps de autenticação, CI, toolchain e `@source` permanecem atribuídos a E04-T07/E04-T08.
- [ ] E04-T04 depende de E04-T08 e telas de domínio dependem do shell.
- [ ] Não há alterações em código, manifest, lockfile ou configuração de build.
- [ ] Roadmap, pacote, guia e changelog descrevem o mesmo estado.
- [ ] `git diff --check`, links, IDs, dependências e revisão de segredos passam.

## Riscos e controles

| Risco | Controle |
| --- | --- |
| Duplicar o ADR externo | Referenciar a fonte normativa e registrar só consequências do Kaizen. |
| Misturar fato publicado com plano futuro | Usar seções separadas para fatos, decisões e pendências. |
| Declarar integração concluída cedo | Repetir o limite documental no ADR, guia, tarefas e changelog. |
| Criar primitive local antes do release | Bloquear E04-T04 em E04-T08 e proibir clones no pacote do shell. |
| Expor credencial do registry | Versionar apenas URL/scope público; tokens ficam no ambiente e workflow efêmero. |
| Quebrar o grafo | Validar IDs e dependências antes de atualizar estados. |
| Sobrescrever trabalho local | Aplicar edições pontuais após comparar o diff existente. |
| Expandir escopo para calendário/E09 | Registrar ownership na decisão; não editar evolução futura sem entrada explícita. |

## Rollback

- **Antes de E04-T08:** reverter a PR documental da E04-T06. A arquitetura anterior volta a ser a decisão vigente e nenhum artefato técnico precisa ser removido.
- **Depois de E04-T08:** não apagar esta decisão. Criar um novo ADR que a substitua, restaurar a versão/configuração técnica anterior e preservar o histórico.
- **Alterações locais existentes:** nunca usar reset destrutivo. Reverter apenas arquivos confirmados como pertencentes à PR e preservar mudanças do usuário.

## Entrega de Git

- Base: `developer` contendo E04-T02 concluída.
- Branch: `codex/E04-T06-adopt-shared-design-system` ou o nome já existente, sem recriação destrutiva.
- PR: uma tarefa, com squash para `developer`.
- Título sugerido: `[E04-T06] docs(architecture): registrar adoção do Design System compartilhado`.
- Corpo: usar `.github/pull_request_template.md` e marcar somente validações realmente executadas.

## Pendências após a implementação

1. Integrar E04-T02 em `developer` antes de abrir/mesclar a PR de E04-T06.
2. Executar a validação local adicional do proprietário e registrar qualquer divergência encontrada.
3. Atualizar o estado canônico de E04-T06 somente quando a base contiver E04-T02 e a validação final estiver concluída.
