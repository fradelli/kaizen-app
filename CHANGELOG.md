# Changelog

Mudanças materiais do projeto serão registradas neste arquivo.

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
