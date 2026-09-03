# AGENTS.md

## Finalidade

O Kaizen é a fonte de verdade versionada de um aplicativo pessoal de treino e alimentação. O P0 combina planos públicos aprovados com registros operacionais privados do proprietário.

## Rota mínima de contexto

Para executar uma tarefa:

1. Leia este arquivo.
2. Leia `roadmap/ACTIVE.md`.
3. Leia o arquivo da tarefa apontada.
4. Leia somente os caminhos exatos listados em `Entradas`.

Não leia recursivamente `docs/`, `roadmap/` ou `data/`. Não abra `roadmap/README.md`, `CHANGELOG.md`, outros épicos ou tarefas concluídas salvo quando a tarefa exigir atualização ou auditoria. Localize primeiro títulos e referências com `rg` e carregue apenas a seção necessária.

Instruções específicas existem em `roadmap/AGENTS.md`, `data/AGENTS.md` e `docs/AGENTS.md` e se aplicam somente quando o trabalho alcança essas árvores.

## Regras globais

- Documentação humana usa português do Brasil e linguagem direta.
- Separe fatos, decisões, inferências e dados ausentes; use `null` ou `unknowns` em vez de inventar.
- Não diagnostique lesões nem apresente conteúdo alimentar não validado como prescrição profissional.
- O repositório é público. Nunca versione identidade desnecessária, credenciais, tokens, chaves, strings de conexão, comentários pessoais ou URLs com segredo.
- Preserve histórico e IDs estáveis. Mudanças destrutivas exigem migração explícita e rollback.
- Não crie abstração, dependência, endpoint ou serviço sem consumidor na tarefa atual.

## Arquitetura do P0

- Uma aplicação Next.js full-stack; não criar backend separado ou cliente HTTP interno.
- PostgreSQL com Prisma; JSON versionado define planos e o banco guarda atribuições e execuções.
- Definições aprovadas podem ser públicas. Dados operacionais exigem sessão e autorização server-side.
- `America/Sao_Paulo` governa datas civis; timestamps persistidos usam UTC.
- Server Actions são endpoints públicos: valide sessão, origem, entrada e ownership no servidor.

As decisões completas só devem ser lidas quando listadas pela tarefa em `docs/architecture/` ou `docs/decisions/`.

## Git e entrega

- Trabalho novo parte de `developer` em `codex/<ID>-descricao-curta` para branches do agente.
- PR de tarefa aponta para `developer` e usa squash; promoções `developer -> staging -> master` usam merge commit.
- Título: `[<ID>] tipo(escopo): resumo curto`.
- Corpo: `.github/pull_request_template.md`; marque apenas checks realmente executados.
- Não use force push nem reescreva histórico compartilhado.

## Validação proporcional

Sempre execute `git diff --check` e verifique ausência de segredos. Documentação exige links, IDs, dependências e estados coerentes. Dados exigem parse, schema, ponteiros e referências. Código acrescenta formato, lint, tipos, testes e build conforme os scripts existentes.
