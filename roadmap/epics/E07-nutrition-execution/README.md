# E07 — Execução de alimentação

## Resultado esperado

Plano alimentar do dia consultável, com escolha, cumprimento, alternativa e comentário registráveis no workspace fixo.

## Ordem

| Tarefa  | Depende de | Resultado                                         |
| ------- | ---------- | ------------------------------------------------- |
| E07-T01 | E06-T05    | Projeção do plano e da execução do workspace fixo |
| E07-T02 | E07-T01    | Página de dieta do dia                            |
| E07-T03 | E07-T02    | Escolhas, cumprimento e comentários               |
| E07-T04 | E07-T03    | Segurança e proveniência                          |
| E07-T05 | E07-T04    | Fluxo validado                                    |

## Fora de escopo

- Prescrição automática ou diagnóstico nutricional.
- Cálculo automático de consumo, calorias ou macronutrientes.
- Edição do plano canônico pela interface.

O épico começa após a validação final da tela de treino na E06-T05. Essa é uma
ordem de produto para limitar trabalho simultâneo; a implementação alimentar
continua reutilizando a fundação de banco concluída na E05.

## Critérios de encerramento

- [ ] O plano ativo é legível e rastreável.
- [ ] O usuário registra plano seguido, refeição diferente ou refeição pulada.
- [ ] Unknowns e ressalvas permanecem explícitos.
