# Repositórios de origem

## Registro

| Campo | Valor |
| --- | --- |
| `repository_id` | `personal-performance` |
| `canonical_remote` | `https://github.com/developerlucaslima/personal-performance.git` |
| `visibility` | `PRIVATE` |
| `default_branch` | `main` |
| `baseline_commit` | `37c54fa3fb94b12afa4ae76504b5535a7da82ce9` |
| `baseline_remote_ref` | `refs/heads/main` |
| `snapshot_commit` | `null` |
| `snapshot_owner_task` | `E01-T01` |
| `worktree_state_observed` | `DIRTY` |
| `observed_at` | `2026-08-31` |
| `preserve_legacy` | `true` |

## Interpretação

O `baseline_commit` é o commit remoto verificável observado durante E00-T05. Ele prova a origem, mas não foi aprovado como snapshot definitivo porque existem alterações locais ainda não consolidadas no legado.

E01-T01 deve selecionar um único commit limpo, atualizar `snapshot_commit` e inventariar os artefatos candidatos. Nenhum arquivo pode usar o estado ambíguo do worktree como origem.

O caminho local do clone não faz parte da proveniência versionada. Ferramentas devem localizar a fonte por configuração local e confirmar o remote antes de ler qualquer artefato.
