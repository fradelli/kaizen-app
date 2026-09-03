# Changelog

Mudanças materiais do projeto serão registradas neste arquivo.

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
