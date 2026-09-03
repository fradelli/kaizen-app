---
id: E06-T03
epic: E06
depends_on: [E06-T02]
---

# Registrar preparação, séries e comentários

## Objetivo

Permitir consultar a prescrição e salvar preparação, execução por série e comentários.

## Entradas

- `docs/implementation/E06.md`
- `docs/product/P0.md`
- `data/exercises.json`
- `data/training-execution-metadata.json`
- `src/lib/security/authorization.ts`
- `src/features/training/`

## Entregáveis

- Formulários acessíveis de preparação, séries e conclusão parcial.

## Subtarefas

- [ ] Exibir séries, repetições, descanso e observações disponíveis.
- [ ] Separar preparação do treino principal.
- [ ] Usar o tipo explícito de medição por série.
- [ ] Exibir e persistir carga somente com `load_applicable=true`.
- [ ] Salvar parcialmente, detectar conflito e preservar rascunho em erro.
- [ ] Confirmar conclusão com pendências sem fabricar resultados.

## Validações

- Testar transições, constraints, links entre sessão/exercício e autorização.

## Critérios de aceite

- [ ] A execução real pode ser registrada sem alterar a prescrição.

## Resultado

Ainda não concluída.
