# E00 — Governança do repositório

## Resultado esperado

Repositório privado, com branches e documentação governadas, roadmap operacional e origem do legado rastreável, ainda sem código.

## Escopo

- Visibilidade e clone local.
- Branches de integração, homologação e produção.
- Contrato raiz e sistema de tarefas.
- Proveniência do repositório legado.

## Fora de escopo

- Migração de dados pessoais.
- Aplicação, dependências, Vercel ou banco.

## Ordem

| Tarefa | Depende de | Resultado |
| --- | --- | --- |
| E00-T01 | — | Repositório e branches inicializados |
| E00-T02 | Ação do proprietário | Repositório privado |
| E00-T03 | E00-T01 | Contrato raiz criado |
| E00-T04 | E00-T03 | Roadmap operacional criado |
| E00-T05 | E00-T02, E00-T04 | Origem do legado registrada |

Os status ficam exclusivamente em `roadmap/README.md`.

## Critérios de encerramento

- [ ] Todas as tarefas estão `DONE`.
- [ ] O repositório está privado.
- [ ] A proveniência aponta para um commit imutável do legado.
- [ ] E01-T01 está elegível para iniciar.
