# Migração para o Kaizen

## Estratégia

O `kaizen-app` recebe primeiro regras, dados, planos e documentação selecionada. O repositório `personal-performance` permanece preservado como origem histórica.

Cada artefato migrado deve registrar:

- repositório e caminho de origem;
- branch e commit de origem;
- caminho de destino;
- tratamento: cópia literal, transformação ou resumo;
- validação de integridade;
- motivo de qualquer transformação.

## Restrições

- Não importar todo o histórico Git do legado.
- Não copiar caminhos absolutos antigos como orientação vigente.
- Não migrar scripts ou código durante a fundação documental.
- Não inventar dieta, dados pessoais, regras ou decisões ausentes.
- Não migrar informações pessoais enquanto o repositório estiver público.

O manifesto será criado em `docs/migration/MIGRATION-MANIFEST.md` pela tarefa E00-T05.
