# AGENTS.md

## Finalidade

Este repositório é a nova fonte de verdade do Kaizen, um aplicativo pessoal que começará pela migração versionada das regras e dos planos de treino e alimentação. Código de aplicação será introduzido somente após a fundação documental, os dados e as decisões de produto e arquitetura serem aprovados.

## Idioma e evidência

- Escreva documentação humana em português do Brasil.
- Separe fatos, inferências, decisões, recomendações e dados desconhecidos.
- Use `null` ou uma seção `unknowns` para fatos ausentes; não invente valores.
- Não diagnostique lesões nem transforme conteúdo alimentar pendente em prescrição.
- Não versione credenciais, tokens, chaves, URLs com segredo ou dados pessoais desnecessários.

## Leitura mínima para uma tarefa

1. Leia este `AGENTS.md`.
2. Leia `roadmap/ACTIVE.md`.
3. Leia somente o arquivo da tarefa ativa.
4. Leia o `README.md` do épico apenas quando a tarefa exigir contexto adicional.
5. Leia somente os arquivos de entrada listados na tarefa.

Não carregue todo o roadmap nem todos os épicos sem necessidade.

## Fonte de verdade do trabalho

1. `roadmap/README.md`: status canônico de todos os épicos e tarefas.
2. `roadmap/ACTIVE.md`: ponteiro para a tarefa ativa e seu bloqueio ou próximo passo.
3. Arquivo individual da tarefa: escopo, entradas, entregáveis, subtarefas e aceite.
4. `docs/decisions/`: decisões aprovadas e seus motivos.
5. `docs/migration/`: proveniência e evidências da migração.
6. `CHANGELOG.md`: entregas materiais concluídas.

O status não deve ser duplicado no arquivo individual da tarefa. Ao alterar um status, atualize `roadmap/README.md` e, se a tarefa ativa mudar, `roadmap/ACTIVE.md`.

## Estados permitidos

- `PLANNED`: existe, mas depende de outras tarefas ou decisões.
- `READY`: pode ser iniciada.
- `IN_PROGRESS`: tarefa ativa; deve existir no máximo uma.
- `BLOCKED`: não pode avançar sem ação externa ou nova evidência.
- `DONE`: critérios de aceite e validações concluídos.
- `CANCELLED`: removida por decisão documentada.

## Regras das tarefas

- Use IDs estáveis no formato `E00-T01`.
- Um arquivo representa uma tarefa; subtarefas são checklists dentro dele.
- Não crie arquivo separado para subtarefa.
- Registre dependências por ID e não repita contexto compartilhado.
- Ao concluir, preencha somente a seção `Resultado` com evidências concisas.
- Toda mudança material atualiza `CHANGELOG.md`.
- Não iniciar tarefa cujo status não seja `READY` ou `IN_PROGRESS`.

## Migração sem código

- Preserve artefatos históricos originais byte a byte quando a tarefa exigir cópia literal.
- Registre repositório, caminho, commit, tratamento e integridade no manifesto de migração.
- Não migre código, scripts, dependências, workflows, aplicação ou banco durante os épicos E00–E03.
- Não mantenha duas fontes editáveis para a mesma regra ou plano.
- O repositório legado permanece preservado como evidência; não o apague.
- Dados pessoais de treino e alimentação não podem ser migrados enquanto este repositório estiver público.

## Branches e ambientes

- `developer`: integração das tarefas concluídas.
- `staging`: candidata a preview estável e homologação na Vercel.
- `master`: candidata a produção.
- Trabalho novo parte de `developer` em branch curta, preferencialmente com prefixo `codex/` quando criado pelo Codex.
- Promoção prevista: feature -> `developer` -> `staging` -> `master`, sempre por pull request.

As branches não configuram a Vercel sozinhas. A associação real com preview e produção pertence ao épico E08.

## Validação documental

Antes de concluir tarefas sem código:

- verificar links relativos;
- verificar IDs únicos de épicos e tarefas;
- verificar dependências existentes e sem ciclos;
- confirmar no máximo uma tarefa `IN_PROGRESS`;
- confirmar que o status pai corresponde ao trabalho realizado;
- verificar ausência de caminhos, credenciais e dados pessoais indevidos;
- executar `git diff --check`.

Quando código for autorizado, as tarefas deverão acrescentar validações proporcionais de lint, tipos, testes, build, integração e rollback.
