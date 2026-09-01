---
id: E01-T04
epic: E01
depends_on: [E01-T03]
---

# Migrar documentação humana

## Objetivo

Levar ao Kaizen somente guias, evidências e templates úteis, removendo caminhos e decisões obsoletas.

## Entradas

- Guia de treino, evidências, templates e documentação de atualização do snapshot.

## Entregáveis

- `docs/guides/`
- `docs/evidence/`
- `templates/`
- Linhas transformadas no manifesto.

## Subtarefas

- [x] Classificar cada documento como copiar, transformar, resumir ou omitir.
- [x] Atualizar links e nomes do projeto.
- [x] Remover orientação Next + Nest como decisão vigente.
- [x] Preservar limites de segurança e proveniência.

## Validações

- Links relativos resolvem.
- Não há caminho absoluto antigo usado como instrução vigente.

## Critérios de aceite

- [x] Documentação corresponde aos dados migrados.
- [x] Auditorias e prompts não viraram fonte canônica por acidente.

## Resultado

Cinco documentos humanos e três templates vazios foram derivados exclusivamente do snapshot aprovado e dos dados já migrados. Os guias subordinam prescrição aos JSONs canônicos; agenda, contexto pessoal, caminhos antigos e duplicações extensas foram removidos. Cada template exige preenchimento privado e proíbe versionar a instância preenchida.
