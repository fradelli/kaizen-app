---
id: E00-T05
epic: E00
depends_on: [E00-T02, E00-T04]
---

# Registrar proveniência do legado

## Objetivo

Criar o manifesto que liga cada artefato futuro à sua origem verificável.

## Entradas

- Repositório privado.
- `C:\Users\devel\Projects\personal-performance`.
- Commit de origem escolhido em E01-T01.

## Entregáveis

- `docs/migration/MIGRATION-MANIFEST.md`
- `docs/migration/SOURCE-REPOSITORIES.md`

## Subtarefas

- [ ] Registrar raízes, remotes, branches e commits.
- [ ] Definir tratamentos `COPY`, `TRANSFORM`, `SUMMARIZE` e `SKIP`.
- [ ] Definir uso de SHA-256 para cópias literais.
- [ ] Registrar que o legado não será apagado.

## Validações

- Todo campo do manifesto tem definição inequívoca.
- Nenhum dado pessoal é copiado nesta tarefa.

## Critérios de aceite

- [ ] O manifesto pode receber uma linha por artefato sem nova decisão estrutural.
- [ ] A origem pode ser reproduzida por repositório, commit e caminho.

## Resultado

Ainda não concluída.
