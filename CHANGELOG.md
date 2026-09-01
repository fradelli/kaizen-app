# Changelog

Mudanças materiais do projeto serão registradas neste arquivo.

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
