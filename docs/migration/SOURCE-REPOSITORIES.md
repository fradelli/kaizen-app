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
| `snapshot_commit` | `d1acad309e2b81b714d1aa375e9371a310ad6ed0` |
| `snapshot_branch` | `codex/E01-T01-freeze-source-snapshot` |
| `snapshot_tag` | `kaizen-training-source-v1` |
| `snapshot_owner_task` | `E01-T01` |
| `snapshot_validation` | `PASSED` |
| `worktree_state_observed` | `SNAPSHOT_PINNED_WITH_LOCAL_EXCLUSIONS` |
| `observed_at` | `2026-08-31` |
| `preserve_legacy` | `true` |

## Interpretação

O `baseline_commit` é o commit remoto observado durante E00-T05. O `snapshot_commit` é a única origem aprovada para E01 e está publicado na branch e na tag registradas acima.

Os hashes do manifesto foram calculados diretamente dos blobs de `snapshot_commit`. Nenhum arquivo pode usar o estado atual do worktree como origem, mesmo quando o caminho local tiver o mesmo nome.

O caminho local do clone não faz parte da proveniência versionada. Ferramentas devem localizar a fonte por configuração local e confirmar o remote antes de ler qualquer artefato.

## Exclusões locais fora do snapshot

| Padrão observado | Motivo |
| --- | --- |
| `docs/arquitetura/**` | Arquitetura de aplicação fora da fundação de treino |
| `docs/prompts/**` | Prompts e auditorias não canônicos |
| `output/**` | Saídas geradas |
| `scripts/generate_training_quick_pdf.py` | Código local fora da migração documental |
| `tmp/**` | Arquivos temporários |

Esses caminhos não pertencem ao commit fixado e não podem receber linhas de artefato com esse `snapshot_commit`.
