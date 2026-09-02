# Changelog

Mudanças materiais do projeto serão registradas neste arquivo.

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
