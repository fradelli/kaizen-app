# Manifesto de migração

## Finalidade

Este manifesto é a allowlist dos artefatos que podem sair do legado privado. E00-T05 define o contrato; E01-T01 registra os primeiros candidatos sem copiá-los.

## Valores permitidos

### Tratamento

| Valor | Significado |
| --- | --- |
| `COPY` | Cópia literal dos bytes do artefato aprovado |
| `TRANSFORM` | Estrutura ou campos alterados com justificativa explícita |
| `SUMMARIZE` | Novo documento derivado que preserva somente informação aprovada |
| `SKIP` | Artefato inventariado, mas excluído da migração |

### Exposição

| Valor | Significado |
| --- | --- |
| `PUBLIC` | Aprovado para o repositório público |
| `REVIEW_REQUIRED` | Aguarda revisão ou sanitização específica |
| `DO_NOT_PUBLISH` | Deve permanecer apenas no legado privado |

### Status

| Valor | Significado |
| --- | --- |
| `PLANNED` | Inventariado, sem conteúdo criado no destino |
| `MIGRATED` | Conteúdo criado no destino e ainda não verificado |
| `VERIFIED` | Tratamento, exposição e integridade confirmados |
| `SKIPPED` | Encerrado sem conteúdo no destino |

## Campos

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `artifact_id` | Sim | ID estável em kebab-case |
| `source_repository` | Sim | Deve existir em `SOURCE-REPOSITORIES.md` |
| `source_commit` | Sim | SHA completo e imutável; nunca worktree |
| `source_path` | Sim | Caminho relativo ao repositório de origem |
| `source_sha256` | Para migração | `sha256:` seguido de 64 caracteres hexadecimais minúsculos |
| `destination_path` | Exceto `SKIP` | Caminho relativo ao `kaizen-app` |
| `destination_sha256` | Para `MIGRATED` ou `VERIFIED` | Hash dos bytes versionados no destino |
| `treatment` | Sim | `COPY`, `TRANSFORM`, `SUMMARIZE` ou `SKIP` |
| `exposure` | Sim | `PUBLIC`, `REVIEW_REQUIRED` ou `DO_NOT_PUBLISH` |
| `status` | Sim | `PLANNED`, `MIGRATED`, `VERIFIED` ou `SKIPPED` |
| `decision` | Sim | Motivo da seleção, transformação ou exclusão |
| `verified_at` | Para `VERIFIED` | Data ISO 8601 `YYYY-MM-DD` |

## Regras de integridade

- `COPY`: `source_sha256` e `destination_sha256` devem ser iguais.
- `TRANSFORM` e `SUMMARIZE`: os dois hashes são preservados e `decision` explica a diferença.
- `SKIP`: `destination_path` e `destination_sha256` são `null`.
- `REVIEW_REQUIRED` e `DO_NOT_PUBLISH` não podem avançar para `MIGRATED`.
- Um artefato não listado abaixo não está autorizado para migração.

## Artefatos

| artifact_id | source_repository | source_commit | source_path | source_sha256 | destination_path | destination_sha256 | treatment | exposure | status | decision | verified_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Nenhum artefato foi registrado ou copiado em E00-T05.
