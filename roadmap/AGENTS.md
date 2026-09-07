# Instruções do roadmap

## Fontes de verdade

- `roadmap/README.md` guarda o status canônico de épicos e tarefas.
- `roadmap/ACTIVE.md` aponta a única tarefa selecionada e sua próxima ação.
- O arquivo individual guarda escopo, entradas, entregáveis, passos, aceite e resultado; não repete status.

Estados permitidos: `PLANNED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `DONE` e `CANCELLED`. Deve existir no máximo uma tarefa `IN_PROGRESS`.

## Edição

- IDs `E00-T01` são estáveis e dependências usam somente IDs existentes, sem ciclos.
- Uma tarefa possui um arquivo; subtarefas permanecem nele.
- `Entradas` lista caminhos exatos. Não use expressões vagas como “todos os documentos” ou “resultado anterior”.
- Ao concluir, marque os passos e critérios comprovados, preencha `Resultado`, atualize `roadmap/README.md`, `roadmap/ACTIVE.md` e `CHANGELOG.md`.
- O status do épico deve corresponder às suas tarefas; um épico pode estar `READY` quando sua primeira tarefa está `READY`.
- Não iniciar tarefa que não esteja `READY` ou `IN_PROGRESS`.

## Leitura

Leia apenas a tarefa ativa. O README do épico e o índice global são necessários somente para alterar ordem, dependências ou status. Tarefas concluídas são evidência histórica, não contexto padrão.

## Validação

Confirme IDs únicos, dependências existentes, ausência de ciclos, links válidos, no máximo uma tarefa `IN_PROGRESS`, alinhamento do ponteiro ativo e checklists coerentes com tarefas concluídas.
