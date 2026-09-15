# Changelog

Mudanças materiais do projeto serão registradas neste arquivo.

## 2026-09-15 — recuperação local comprovada

- Automatizados `pg_dump` e `pg_restore` entre dois PostgreSQL 18.6 descartáveis, sem tocar bancos ou volumes existentes.
- Validada a restauração de definições canônicas e de um canário operacional com migrations, planos ativos, contagens, vínculos e identidades preservados.
- Adicionados comando, runbook e job dedicado `Backup restore`; a prova real restaurou 151.376 bytes e todos os sete gates da PR passaram.
- Mantidos fora do escopo dados reais, Neon, retenção, RPO/RTO gerenciado e restauração de produção.

## 2026-09-14 — integridade persistida comprovada

- Implementado auditor server-only `REPEATABLE READ`/`READ ONLY` de paridade das definições canônicas e proveniência dos bytes Git, sem imprimir dados privados nem reparar divergências.
- Adicionada CLI protegida para `kaizen_test`, com resultados distintos para banco válido, divergente e não importado; executada em cenários preparados pelos testes da CI.
- Ampliados testes relacionais de pais ausentes, unicidade, ownership alimentar, limites, medidas, carga e isolamento de ativações; concorrência real em dois Clients preserva somente a gravação vencedora por revisão.
- Confirmados 144 testes unitários/validadores, 30 integrações e 29 regressões dos scripts, além dos gates completos e audit sem vulnerabilidades; migrations, planos, shells e volumes intactos.
- Refinada a semântica da implementação: fontes discriminadas, DTOs e mapeadores por entidade, regras de paridade coesas, fixtures fora da aplicação e códigos de falha distintos para argumentos, banco, fonte e infraestrutura.
- Adicionado gate automatizado para impedir dependências incompatíveis entre domínio, aplicação, dados, UI e fronteiras `use client`.

## 2026-09-14 — validação Docker da E05-T02 concluída

- Subidos PostgreSQL local e de teste pelo Compose com saúde, volume persistente e tmpfs independente confirmados.
- Tornada configurável a porta de teste, preservando o padrão 5433 e permitindo coexistência com outros projetos sem interromper seus containers.
- Confirmadas aplicação em banco vazio, reexecução sem pendências e persistência da migration após restart; gates completos passaram com 17 integrações no PostgreSQL Docker.
- Encerrada a pendência da E05-T02 sem apagar volumes, alterar migrations ou publicar credenciais.

## 2026-09-14 — importação canônica idempotente por CLI

- Criada importação server-only de bytes Git fixados, com validação antes da escrita, origem/hash e documentos JSONB preservados.
- Projetadas definições de treino/alimentação e ativações em transação serializable; segunda execução é no-op, conflitos não reescrevem versões e falhas não deixam projeção parcial.
- Validados versão nova com ID estável, concorrência, rollback SQL real, referências alimentares e preservação operacional em PostgreSQL isolado; gates completos e auditoria passaram.
- Compartilhadas as regressões do validador de dados com a cobertura e ancoradas exclusões de formatação na raiz para não ignorar os módulos `data/` das features.
- Documentado comando e fluxo seguro de atualização. Shells e JSON canônicos permanecem intactos; Docker segue pendente na E05-T02 conforme autorização explícita de sequência.
- Refinada a semântica em `plan-definition-import`: nomes ligados a definições versionadas, etapas de persistência separadas com transação centralizada, validação única antes do cliente do banco e manifesto com propriedades nomeadas.
- Tornada permanente a revisão semântica: convenções na arquitetura, leitura obrigatória para mudanças de código no AGENTS e checklist no template de PR.

## 2026-09-14 — organização do Prisma e regras permanentes

- Integrada correção isolada da auditoria pela PR #37: override restrito de deepmerge-ts 8.0.2, com compatibilidade Prisma e gates completos confirmados em developer e na composição E05-T02; Docker permanece pendente.
- Separados schemas de plataforma, treino e alimentação, sem alterar a migration inicial.
- Separadas configuração tipada server-only, limites de pool e validação pura; adicionados testes das proteções da CLI.
- Tornada automática a geração do Client nos comandos de desenvolvimento, build, tipos e testes; documentadas convenções normativas na arquitetura e referência no AGENTS.
- Mantidas as pendências de auditoria e inicialização Docker da E05-T02; nenhuma entrega marcada como concluída.

## 2026-09-13 — persistência local implementada, entrega pendente

- Criados schema Prisma P0, migration transacional e constraints/triggers de ownership, versões, doses, carga, medidas, estados alimentares e preservação histórica.
- Separados runtime server-only lazy, migrations diretas e PostgreSQL descartável de testes; adicionada geração explícita do Client aos gates e testes reais sem mocks/SQLite.
- Confirmada aplicação em bancos PostgreSQL 18.6 vazios, reexecução sem migrations pendentes e testes de integridade; telas e dados canônicos permanecem intactos.
- Corrigidos os findings mysql2 com override restrito 3.23.1; auditoria deepmerge-ts e inicialização dos containers Docker locais permanecem pendentes, sem bypass do gate ou tarefa marcada como concluída.

## 2026-09-12 — modelo P0 e metadados especificados

- Documentadas as 18 entidades conceituais com ownership, vínculos de versão, unicidade, checks, índices e preservação histórica.
- Revisados os 38 exercícios usados nos planos versionados, com doses explícitas, segundos por lado, direções e qualificadores preservados.
- Criado schema estrito e ampliada a validação de dados para bloquear classificação ausente, referências inválidas, carga incompatível e normalizações não revisadas.
- Nenhum plano histórico, banco, migration, Prisma Client, dependência ou endpoint foi alterado/criado.

## 2026-09-11 — estrutura React padronizada

- Reduzidas as entradas de Dieta, Treino e Foundations à composição server-side, com placeholder compartilhado e ilha Client mínima para o exemplo interativo.
- Encapsulados componentes compartilhados e filhos privados em pastas próprias, mantendo tipos, estilos, constantes, hooks, utilitários e testes junto de seus responsáveis.
- Registrada a convenção na arquitetura e adicionada validação estrutural local e na CI para impedir componentes soltos ou arquivos auxiliares misturados.
- Preservados conteúdo, acessibilidade e comportamento visual; formato, lint, tipos, testes, dados, build e auditoria passaram.

## 2026-09-11 — shell acessível do Kaizen concluído

- Criado shell mobile-first sobre `@fradelli/ui@0.1.0` com landmarks, skip link e navegação Dieta/Treino identificando a rota atual.
- Mantido o shell como Server Component e isolado `usePathname` em uma ilha Client mínima, com tipos, constantes, estilos, hook e utilitário separados por responsabilidade.
- Adicionados placeholders explícitos sem dados de domínio e redirecionamento de `/` para `/dieta`, preservando `/foundations`.
- Validados teclado, foco, viewport de 320 px, ausência de overflow, testes, build e auditoria; criada E04-T09 para padronizar separadamente as páginas existentes.

## 2026-09-11 — integração versionada do Design System concluída

- Fixados `@fradelli/ui@0.1.0`, Tailwind CSS `4.3.3`, `@tailwindcss/postcss@4.3.3` e PostCSS `8.5.28` com instalação congelada comprovada em worktree limpo.
- Integrados Inter variável, tema dark explícito, CSS público único e detecção do `dist` publicado via `@source`.
- Criada `/foundations` com primitives públicas, estados rotulados, foco, teclado, responsividade e movimento reduzido, sem antecipar domínio ou shell.
- Configurado acesso efêmero `packages: read` somente nos jobs de CI que instalam dependências; nenhuma credencial foi versionada.
- Gates locais e os seis jobs obrigatórios da PR #30 passaram, incluindo instalação autenticada, build estático, auditoria e árvore única de React.

## 2026-09-10 — prontidão do Design System avaliada

- Confirmados runtime, peers, exports, CSS público e arquivos publicados de `@fradelli/ui@0.1.0` sem instalar o package.
- Reexecutados os gates locais e remotos com sucesso e registrada a estratégia segura de autenticação local e do CI.
- Emitida decisão NO-GO porque a leitura autenticada do GitHub Packages não foi comprovada; E04-T08 permanece bloqueada.
- Nenhuma dependência, credencial, configuração autenticada ou mudança de aplicação foi adicionada.

## 2026-09-10 — CI mínimo e proteção de branches concluídos

- Integrada a E04-T05 pela PR #27 com gates separados de governança, qualidade, testes, integridade dos dados, build e auditoria de dependências.
- Ativados rulesets sem bypass para exigir pull request e os seis checks em `developer`, `staging` e `master`.
- Restringido `developer` a squash e promoções a merge commit; rebase merge foi desabilitado.
- Configurado o Dependabot semanal para dependências npm e GitHub Actions.

## 2026-09-10 — fronteira server-only criada

- Adicionados contrato mínimo de ambiente e resolvedor fixo de workspace protegidos por `server-only`.
- Limitada a configuração desta etapa a `APP_ENV` e `PERSONAL_WORKSPACE_ID`, sem antecipar banco, sessão ou autenticação.
- Criado erro discriminado e sanitizado que não inclui valores de ambiente.
- Adicionados testes de validação, cache, imutabilidade e resolução exclusiva no servidor.
- Comprovado que um Client Component não consegue importar a boundary e que nenhum marcador privado aparece no bundle cliente.

## 2026-09-10 — adoção documental do Design System compartilhado

- Criada a decisão local que adota por referência o ADR normativo e registra o contrato publicado de `@fradelli/ui@0.1.0`.
- Substituída explicitamente a fundação visual exclusiva local, preservando as demais decisões e resultados de E03/E04-T01.
- Definidos ownership, segurança do registry, riscos e rollback por versão, sem copiar tokens, primitives ou domínio.
- Criadas E04-T07 e E04-T08 para separar prontidão sem instalação da integração técnica pelo GitHub Packages.
- Reordenada E04 para concluir CI, prontidão e integração antes do shell; telas de Treino e Dieta passam a depender do shell.
- Nenhum package, Tailwind, fonte, componente, credencial ou código de aplicação foi adicionado nesta atualização.

## 2026-09-10 — qualidade estática configurada

- Integrada a E04-T02 pela PR #24 com Prettier, ESLint, Vitest, Testing Library e cobertura mínima de 80%.
- Adicionados scripts reproduzíveis de formato, lint, tipos, testes, cobertura e build.
- Alinhados ESLint 9.39.5 e TypeScript 6.0.3 aos peers suportados pelo Next.js 16.3.4.
- Preservados documentação, dados, CI, Design System, banco, boundaries e features fora do escopo da tarefa.

## 2026-09-07 — aplicação Next.js inicial criada

- Fixados Node.js 24.20.0, pnpm 11.25.0, Next.js 16.3.4, React 19.2.8 e TypeScript 7.0.2.
- Criado o App Router mínimo com metadados de privacidade, página inicial responsiva e TypeScript estrito.
- Gerado e versionado o lockfile de instalação reproduzível sem adicionar banco, autenticação ou features de negócio.
- Desabilitada a geração automática de instruções do Next.js para preservar o contexto enxuto e controlado do `AGENTS.md`.
- Validados instalação, build de produção e carregamento local com HTTP 200.
- Concluída E04-T01 e liberada E04-T02 para configurar qualidade estática e testes.

## 2026-09-02 — contexto e sequência pré-MVP saneados

- Reduzido o contrato raiz e distribuídas instruções específicas para `roadmap/`, `data/`, `docs/` e migração.
- Modularizado o guia de implementação em cinco pacotes de E04 e pacotes concisos para E05–E08.
- Substituídas entradas vagas das tarefas futuras por caminhos exatos e contexto limitado.
- Criada E05-T06 para implementar sessão, autorização e pareamento antes dos fluxos operacionais.
- Limitado E05-T05 ao backup/restore local; Neon e restore gerenciado permanecem em E08.
- Renomeados os diretórios E06–E08 para refletir execução e publicação pessoal, com links atualizados.
- Normalizadas as checklists concluídas de E02/E03 e mantida E04-T01 como próxima tarefa pronta.
- Concluída E00-T07 sem criar aplicação, dependência, workflow, banco ou ambiente.

## 2026-09-02 — guia de implementação do P0

- Convertidas as decisões aprovadas em uma ordem incremental de E04-T01 a E08-T05, com uma PR por tarefa.
- Pinadas as versões iniciais de runtime, framework, qualidade, banco, testes e segurança.
- Documentados conteúdos completos do scaffold inicial, ações por arquivo, dependências, validações e rollback.
- Associadas as decisões futuras dependentes de evidência às tarefas responsáveis, sem criar código prematuro.
- Concluídos E03-T05 e o épico E03; liberados E04 e E04-T01 para iniciar a aplicação Next.js.

## 2026-09-02 — arquitetura alvo do MVP

- Escolhidos Node.js 24 LTS, Next.js 16 App Router, React 19, TypeScript estrito e pnpm pinado.
- Escolhidos PostgreSQL local/Neon e Prisma ORM 7 estável com conexões pooled e direta separadas.
- Definidos boundaries de UI, aplicação, domínio e dados, sem backend ou API interna separados.
- Especificados modelo conceitual, metadados explícitos de execução, transações, concorrência, migrations, segurança e testes.
- Alinhadas E05, E06 e E07 ao registro operacional aprovado de dieta e treino.
- Concluída E03-T04 e liberada E03-T05 para produzir o guia copiável.

## 2026-09-02 — privacidade e operação do MVP

- Escolhidas Vercel e Neon PostgreSQL, com URL gerada e sem domínio próprio ou cadastro no MVP.
- Separada leitura pública dos planos de atribuições, execuções e comentários privados.
- Definidos pareamento do dispositivo, cookie seguro e autorização server-side para toda operação pessoal.
- Isolados local, previews, staging e produção com bancos, dados e segredos próprios.
- Definidos RPO de 24 horas, RTO de 4 horas, backup cifrado, restore mensal e evolução futura para contas.
- Concluída E03-T03, corrigido o escopo de publicação pessoal em E08 e liberada E03-T04.

## 2026-09-02 — transição da fonte de verdade

- Mantidos Git e JSON como fonte editável das definições de planos durante o MVP.
- Definido o banco como fonte exclusiva de atribuições, execuções, séries, escolhas e comentários.
- Especificadas importação transacional e idempotente, versões imutáveis, ativações e conflitos bloqueantes.
- Definidos backup, exportação, rollback e cutover futuro sem dual-write.
- Concluída E03-T02 e mantida E03-T03 como próxima tarefa pronta.

## 2026-09-02 — jornadas operacionais do P0

- Limitado o P0 às áreas Dieta e Treino, com navegação por data em `America/Sao_Paulo`.
- Definido o registro de opção alimentar seguida, refeição diferente, item pulado e comentário.
- Definidos treino, mobilidade e descanso, com preparação separada, execução por série, carga somente quando aplicável e comentários.
- Especificados estados de leitura e gravação, conflitos, histórico, acessibilidade e critérios comportamentais.
- Concluída E03-T01 e liberadas E03-T02 e E03-T03, mantendo execução sequencial por E03-T02.

## 2026-09-02 — fundação alimentar validada

- Validados 13 artefatos E02 na origem privada e os três derivados públicos pelos hashes versionados.
- Confirmados schema, ponteiros, referências cruzadas, relação com o treino ativo, links e separação entre fonte, revisão e plano.
- Revisados unknowns, limites não clínicos e privacidade sem encontrar falha bloqueante.
- Publicado relatório reproduzível e definido o procedimento para marcar o merge com `nutrition-foundation-v1`.
- Concluída E02-T06, encerrado o épico E02 e liberada E03-T01.

## 2026-09-02 — contratos do plano alimentar

- Criado o ponteiro canônico para `nutrition_2026_09_personal_v1` com caminhos do plano, schema e guia.
- Adicionado JSON Schema Draft 2020-12 permissivo para a estrutura vigente, sem inventar metas ou regras clínicas.
- Publicado guia humano derivado com tipos de dia, horários, limites de uso e procedimento de versionamento.
- Documentada a precedência do JSON e mantidas referências cruzadas como validação complementar.
- Concluída E02-T05 e liberada E02-T06 para o gate final da fundação alimentar.

## 2026-09-02 — plano alimentar pessoal estruturado

- Registrada a aprovação do proprietário para uso e publicação do derivado sanitizado da alimentação vigente.
- Criado o plano `nutrition_2026_09_personal_v1` com seis tipos de dia, cinco refeições, vinte opções e faixas energéticas rastreáveis ao legado.
- Separados uso pessoal e validação profissional; metas ausentes permanecem `null` e nenhuma inferência clínica foi adicionada.
- Excluídos identidade, contexto médico, suplementos, protocolo cognitivo e caminhos privados.
- Concluída E02-T04 e liberada E02-T05 para criar ponteiro, schema e guia.

## 2026-09-02 — revisão alimentar segura

- Comparados privadamente os estados prescrito, praticado e proposto em 23 decisões rastreáveis.
- Preservados no Kaizen somente metadados e resumo sanitizados, sem alimentos, refeições, quantidades, medidas ou contexto médico.
- Mantido o modelo por tipo de dia como candidato e exigida reconciliação com o plano de treino ativo v2.
- Rejeitadas metas pessoais exatas e protocolos de suplementos sem dados ou validação suficientes; nenhum diagnóstico foi produzido.
- Concluída E02-T03 e bloqueada E02-T04 até aprovação explícita das decisões que podem entrar na proposta.

## 2026-09-01 — preservação privada da fonte alimentar

- Publicado no legado privado o snapshot alimentar `0d6456a68329f51fb9f83e1230cb285fe82f5996` e a tag `kaizen-nutrition-source-v1`.
- Preservados oito artefatos sob aliases neutros com identidade dos objetos Git e hashes SHA-256 confirmados contra o inventário.
- Registradas no manifesto somente referências seguras como `SKIP/DO_NOT_PUBLISH`, sem conteúdo alimentar, caminhos históricos ou dados pessoais.
- Concluída E02-T02 e liberada E02-T03 para revisão segura da fonte original, alimentação praticada e plano derivado.

## 2026-09-01 — correção do inventário alimentar

- Ampliada a descoberta para todas as refs remotas do legado após o inventário inicial ter pesquisado somente o snapshot de treino e o worktree observado.
- Localizados oito artefatos alimentares em commit privado remoto, com tamanhos e hashes calculados diretamente dos blobs.
- Registradas dieta original, alimentação praticada, contexto, plano derivado, receita, auditoria e guia sem copiar conteúdo ou expor caminhos pessoais.
- Mantidos todos os candidatos como `DO_NOT_PUBLISH` até decisão específica por artefato.
- Ajustada E02-T02 para preservação privada segura e alterado seu estado de `BLOCKED` para `READY`.

## 2026-09-01 — inventário das entradas alimentares

- Verificados o snapshot privado, o worktree conhecido e o anexo disponível sem localizar uma dieta ou registro da alimentação praticada.
- Classificados perfil, agenda e plano de treino somente como contexto público sanitizado.
- Registrados fatos, fontes ausentes, decisões profissionais indisponíveis e `unknowns` sem inferir valores nutricionais.
- Mantido o manifesto inalterado e nenhum arquivo criado em `data/nutrition/`.
- Concluída E02-T01 e bloqueada E02-T02 até o fornecimento e a classificação da dieta original.

## 2026-09-01 — fundação de treino validada

- Verificados o snapshot privado, os 23 artefatos do manifesto e os hashes dos 19 destinos publicados.
- Corrigido o ponteiro ativo para usar o `artifact_id` do original privado e o caminho vigente do guia humano.
- Confirmados 9 JSONs, 3 aplicações de schema, 38 IDs únicos e 87 referências de exercícios resolvidas.
- Sanitizado o critério público de agenda e registrada a aceitação do histórico anterior sem reescrita.
- Publicado o relatório sem falhas abertas, encerrada E01 e liberada E02-T01.

## 2026-09-01 — schemas de treino

- Copiados literalmente os contratos Draft 2020-12 da biblioteca e dos planos, preservando seus hashes de origem.
- Confirmada a validação estrutural da biblioteca e dos planos v1 e v2 com `Test-Json`.
- Transformado o README para remover o script ausente e explicitar cobertura, permissividade, formatos e lacunas.
- Mantidas unicidade, referências cruzadas e seleção do plano ativo como validações separadas dos schemas.
- Verificados os três artefatos da E01-T05; manifesto sem pendências e E01-T06 liberada.

## 2026-09-01 — documentação humana de treino

- Publicados cinco guias compactos, derivados dos dados canônicos e sem agenda ou contexto pessoal.
- Mantidas evidências e limitações com proveniência, sem apresentar a migração como nova revisão científica.
- Publicados três templates vazios com preenchimento exclusivamente privado e proibição de versionar respostas.
- Removidas instruções, caminhos e duplicidades do legado; prompts restantes foram rotulados como exemplos não canônicos.
- Verificados no manifesto os oito artefatos da E01-T04; tarefa concluída e E01-T05 liberada.

## 2026-08-31 — histórico de treino

- Migrado literalmente o plano v1 como versão histórica, sem alterar seu `status` embutido nem o ponteiro ativo para a v2.
- Mantido o treino original do coach exclusivamente no snapshot privado como `SKIPPED/DO_NOT_PUBLISH`.
- Publicada a revisão com referência auditável ao `artifact_id` privado, sem link quebrado para arquivo ausente.
- Publicada a análise histórica sem dias, horários exatos ou questão de saúde.
- Registrados hashes e tratamentos dos quatro artefatos; concluída E01-T03 e liberada E01-T04.

## 2026-08-31 — dados canônicos de treino

- Migrados literalmente o ponteiro ativo, a biblioteca de exercícios e o plano vigente v2 a partir do snapshot imutável.
- Publicado o perfil sem identidade, medidas corporais, contexto de saúde ou `unknowns` médicos.
- Publicada a agenda sem dias, horários exatos ou modelos semanais, preservando as regras de distribuição.
- Registrados e verificados no manifesto os hashes de origem e destino dos cinco artefatos.
- Concluída E01-T02 e liberada E01-T03 para decisão de exposição do histórico.

## 2026-08-31 — snapshot imutável do treino

- Publicado no legado privado o snapshot `d1acad309e2b81b714d1aa375e9371a310ad6ed0`.
- Criada a tag privada `kaizen-training-source-v1` para preservar a referência imutável.
- Inventariados 23 artefatos candidatos ou excluídos com SHA-256 calculado diretamente dos blobs do commit.
- Mantidos fora do snapshot arquitetura, prompts, saídas geradas, temporários e o script local não rastreado.
- Nenhum arquivo de treino foi copiado para o Kaizen.
- Concluída E01-T01 e liberada E01-T02 para a migração canônica após revisão de exposição.

## 2026-08-31 — política pública e proveniência do legado

- Mantido o repositório público por decisão do proprietário para a governança de CI/CD no GitHub.
- Cancelada a tarefa de tornar o repositório privado, preservando seu histórico e motivo.
- Definida uma política de publicação por allowlist com classificação de exposição por artefato.
- Registrado o repositório legado privado e seu commit-base remoto verificável.
- Criado o contrato do manifesto de migração sem copiar dados pessoais, planos ou código.
- Concluído o épico E00 e liberada E01-T01 para escolher o snapshot definitivo do treino.

## 2026-08-30 — fundação do repositório e roadmap

- Inicializado o repositório com as branches `developer`, `staging` e `master`.
- Definido `developer` como branch padrão de integração.
- Criada a governança documental sem código, dependências ou aplicação.
- Criado um roadmap hierárquico com status consolidado no arquivo pai.
- Adaptado o padrão de títulos, descrições e promoções de pull request do Sandicts para IDs locais do roadmap.
- Definida a governança futura de CI/CD com gates próprios para Next.js e integridade dos dados do Kaizen.
- Registrada a associação futura de `staging` com preview e `master` com produção; a Vercel ainda não está configurada.
- Inicialmente bloqueada a migração de dados pessoais enquanto a estratégia de exposição ainda não estava decidida.
