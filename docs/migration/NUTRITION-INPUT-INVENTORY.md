# Inventário de entradas alimentares

## Resultado corrigido

- Data da correção: `2026-09-01`.
- Repositório de origem: `personal-performance` (`PRIVATE`).
- Referência observada: `refs/heads/codex/mvp-incremental-foundation`.
- Commit remoto verificado: `138531e4fbca6d744de73274fbb96da39c02bad3`.
- Dieta original disponível: `true`.
- Registro da alimentação praticada disponível: `true`.
- Artefatos candidatos: `8`.
- Artefatos aprovados para publicação: `0`.
- Snapshot alimentar preservado: `0d6456a68329f51fb9f83e1230cb285fe82f5996`.
- Branch privada: `codex/E02-T02-freeze-nutrition-source`.
- Tag privada: `kaizen-nutrition-source-v1`.
- Próxima tarefa: `E02-T03`, liberada para revisar a fonte preservada sem promover recomendações automaticamente.

A primeira versão deste inventário inspecionou somente o snapshot de treino, o worktree observado e o anexo conhecido. A correção ampliou a descoberta para todas as refs remotas e localizou a fonte alimentar em uma branch privada. Nenhum conteúdo alimentar foi copiado para o Kaizen.

## Candidatos privados

Os identificadores abaixo pertencem somente ao inventário. Não são `artifact_id` do manifesto e não expõem caminhos privados.

| candidate_id | Papel | Bytes | SHA-256 | Tratamento candidato | Exposição padrão |
| --- | --- | ---: | --- | --- | --- |
| `nutrition-source-context` | Contexto alimentar e operacional | 19154 | `0ab7cda38f9d592ac173b1b2b2d12dc419c2fab6f4cb759726517f527e111830` | `SUMMARIZE` após revisão | `DO_NOT_PUBLISH` |
| `nutrition-source-current-intake` | Resumo da alimentação praticada | 5237 | `d25cbb7f2a5b59423e7df51ab1fa6e41c6143d50648df3337792eb8fa2f1b10e` | `SUMMARIZE` após revisão | `DO_NOT_PUBLISH` |
| `nutrition-source-original-json` | Transcrição estruturada da fonte original | 11598 | `7421e0fa8ef39d42910328e1aa540c9bfb325c634d53bef0fd591add53d42eb1` | `COPY` privado e `SKIP` público | `DO_NOT_PUBLISH` |
| `nutrition-source-original-pdf` | Documento original | 135629 | `a84e1ebadf28e45a40b5922f509e83761f1bc2c96d5eabfb67ccb84904862ee1` | `COPY` privado e `SKIP` público | `DO_NOT_PUBLISH` |
| `nutrition-source-periodized-plan-v1` | Plano derivado existente | 29726 | `50bc329418447026fa791e22c9c64f4bbb56f92a4754cc4e9550fa019155017f` | `TRANSFORM` somente após revisão | `DO_NOT_PUBLISH` |
| `nutrition-source-weekend-recipe` | Receita vinculada ao plano | 4372 | `2e1f1681eaf45036c97ec7fe1365960573a8226d9d63c407cbd3a62e680aa057` | `TRANSFORM` somente após revisão | `DO_NOT_PUBLISH` |
| `nutrition-source-legacy-audit` | Auditoria anterior da dieta | 35071 | `b14e5959bfab6305e35359eb02bc32542f9a916452648aab7c61a3fe43299abb` | `SUMMARIZE` após revalidação | `DO_NOT_PUBLISH` |
| `nutrition-source-human-guide` | Guia humano do plano anterior | 23706 | `3c210923480926fc495fec20d2279e3931516d50bbfeeee8b06bf8e5e2840185` | `SUMMARIZE` após aprovação | `DO_NOT_PUBLISH` |

Os oito blobs totalizam `264493` bytes. Seus hashes foram calculados diretamente do commit remoto observado.

## Contexto já público

| input_id | Entrada | Disponibilidade | Uso permitido |
| --- | --- | --- | --- |
| `nutrition-context-profile` | `data/profile.json` | `AVAILABLE` | Contexto sanitizado; não cria fatos alimentares |
| `nutrition-context-schedule` | `data/schedule.json` | `AVAILABLE` | Carga agregada; agenda pessoal permanece nula |
| `nutrition-context-active-training` | Plano apontado por `data/active.json` | `AVAILABLE` | Contexto de treino; não substitui revisão nutricional |

## Separação epistemológica

### Fatos confirmados

- A fonte privada contém documento original, transcrição, contexto, alimentação praticada, plano derivado, receita, auditoria e guia.
- A branch remota resolve para o commit registrado.
- Nenhum dos oito artefatos recebeu aprovação de publicação.
- O plano derivado existente não foi promovido a plano vigente do Kaizen.

### Estimativas

Nenhuma estimativa foi produzida nesta tarefa.

### Hipóteses

Nenhuma hipótese foi promovida a dado. Atualidade, adequação e autoria profissional ainda precisam ser confirmadas em etapa privada.

### Decisões profissionais

A existência de um documento original não confirma, por si só, autoria, vigência ou validação profissional do plano derivado. Essas relações permanecem pendentes.

## Unknowns

- autoria e relação profissional da fonte original;
- data de emissão, versão e vigência do documento;
- direito de preservar ou publicar conteúdo de terceiro;
- relação exata entre PDF e transcrição JSON;
- atualidade do resumo da alimentação praticada;
- quais partes do plano derivado foram aprovadas pelo usuário ou por profissional;
- decisão explícita de exposição para qualquer derivado futuro;
- restrições ou orientações profissionais que devam permanecer exclusivamente privadas.

Nenhum desses campos pode ser preenchido por inferência.

## Resultado da preservação E02-T02

`E02-T02` foi concluída com:

1. snapshot privado criado a partir do commit verificado;
2. oito blobs preservados sob aliases neutros com os mesmos hashes dos blobs históricos;
3. tag privada `kaizen-nutrition-source-v1` publicada e validada no remote;
4. referências seguras registradas no manifesto como `SKIP/DO_NOT_PUBLISH`;
5. originais e derivados mantidos privados até revisão e aprovação por artefato.

## Fora de escopo

- criar `data/nutrition/` no repositório público;
- publicar ou transcrever refeições, quantidades, calorias ou macronutrientes;
- revisar a dieta ou criar um novo plano;
- criar schema, aplicação, banco, script ou workflow.
