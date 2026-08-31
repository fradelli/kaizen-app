---
id: E00-T05
epic: E00
depends_on: [E00-T04, E00-T06]
---

# Registrar proveniência do legado

## Objetivo

Criar o manifesto que liga cada artefato futuro à sua origem verificável.

## Entradas

- Decisão de manter `fradelli/kaizen-app` público.
- Repositório privado `developerlucaslima/personal-performance`.
- Commit-base remoto observado; o snapshot definitivo será escolhido em E01-T01.

## Entregáveis

- `docs/migration/MIGRATION-MANIFEST.md`
- `docs/migration/SOURCE-REPOSITORIES.md`
- `docs/decisions/PUBLIC-REPOSITORY-AND-DATA-POLICY.md`

## Subtarefas

- [x] Registrar identificadores, remotes, branches e commits sem caminhos locais absolutos.
- [x] Definir tratamentos `COPY`, `TRANSFORM`, `SUMMARIZE` e `SKIP`.
- [x] Definir exposições `PUBLIC`, `REVIEW_REQUIRED` e `DO_NOT_PUBLISH`.
- [x] Definir uso de SHA-256 para origem e destino.
- [x] Registrar que o legado privado não será apagado.

## Validações

- Todo campo do manifesto tem definição inequívoca.
- Nenhum dado pessoal é copiado nesta tarefa.

## Critérios de aceite

- [x] O manifesto pode receber uma linha por artefato sem nova decisão estrutural.
- [x] A origem pode ser reproduzida por repositório, commit e caminho.
- [x] Nenhum conteúdo do legado foi copiado nesta tarefa.

## Resultado

Concluída em 2026-08-31. A fonte privada, o commit-base remoto, a política pública, os tratamentos, as classificações de exposição e as regras de integridade foram registrados sem copiar conteúdo do legado.
