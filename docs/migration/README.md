# Migração para o Kaizen

## Estratégia

O `kaizen-app` público recebe primeiro regras, dados, planos e documentação explicitamente selecionados. O repositório privado `personal-performance` permanece preservado como origem histórica.

A ausência de uma linha aprovada no manifesto significa que o artefato não pode ser migrado. Tratamento técnico e exposição pública são decisões separadas.

Cada artefato migrado deve registrar:

- repositório e caminho de origem;
- branch e commit de origem;
- caminho de destino;
- tratamento: `COPY`, `TRANSFORM`, `SUMMARIZE` ou `SKIP`;
- exposição: `PUBLIC`, `REVIEW_REQUIRED` ou `DO_NOT_PUBLISH`;
- validação de integridade;
- motivo de qualquer transformação.

## Restrições

- Não importar todo o histórico Git do legado.
- Não versionar caminhos locais absolutos.
- Não migrar scripts ou código durante a fundação documental.
- Não inventar dieta, dados pessoais, regras ou decisões ausentes.
- Não publicar credenciais, identidade, detalhes médicos ou dados pessoais desnecessários.
- Não interpretar a intenção geral de migração como aprovação de exposição de cada artefato.

## Fontes de verdade

- [Política de publicação](../decisions/PUBLIC-REPOSITORY-AND-DATA-POLICY.md)
- [Repositórios de origem](SOURCE-REPOSITORIES.md)
- [Manifesto por artefato](MIGRATION-MANIFEST.md)
