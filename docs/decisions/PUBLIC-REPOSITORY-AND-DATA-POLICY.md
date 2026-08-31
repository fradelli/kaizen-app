# Política do repositório público e dos dados

## Status

- Data: 2026-08-31
- Decisão: aprovada pelo proprietário
- Escopo: conteúdo versionado em `fradelli/kaizen-app`

## Decisão

O `kaizen-app` permanecerá público para facilitar a governança de CI/CD e regras no GitHub. O repositório `developerlucaslima/personal-performance` permanece privado como fonte histórica.

Repositório público não significa banco ou ambiente público. Dados de execução futuros devem permanecer no banco e nos ambientes protegidos, nunca no Git.

## Regra padrão

Todo artefato começa como `DO_NOT_PUBLISH`. Ele só pode entrar neste repositório após receber uma linha no manifesto com tratamento, exposição, commit de origem, caminho e justificativa.

## Classificações de exposição

| Exposição | Significado | Regra |
| --- | --- | --- |
| `PUBLIC` | Conteúdo aprovado para versionamento público | Pode ser migrado conforme o tratamento registrado |
| `REVIEW_REQUIRED` | Pode conter contexto pessoal ou campos excessivos | Exige revisão e decisão explícita antes da migração |
| `DO_NOT_PUBLISH` | Não deve entrar no repositório público | Permanece apenas no legado privado |

## Conteúdo proibido por padrão

- credenciais, tokens, chaves e URLs com segredo;
- identidade, contato e identificadores pessoais desnecessários;
- detalhes médicos, diagnósticos ou histórico clínico;
- conteúdo de terceiros sem direito claro de publicação;
- arquivos gerados, temporários, binários ou código fora do escopo aprovado.

Planos, horários, dieta e contexto físico não são automaticamente públicos. Cada artefato deve ser classificado e, quando necessário, transformado para remover campos que não contribuam para a finalidade do projeto.

## Controles

- O manifesto funciona como allowlist: sem linha aprovada, não há migração.
- Caminhos de origem são relativos ao repositório; caminhos locais absolutos não são versionados.
- O commit de origem é imutável e deve existir no remote registrado.
- `COPY` exige equivalência SHA-256 entre origem e destino.
- `TRANSFORM` e `SUMMARIZE` preservam o hash da origem, registram o hash do destino e explicam a alteração.
- O legado privado não é apagado nem reescrito para acomodar o destino.

## Revisão da decisão

Uma futura mudança de visibilidade ou de política exige nova decisão versionada. Ela não altera retroativamente a exposição de artefatos já publicados.
