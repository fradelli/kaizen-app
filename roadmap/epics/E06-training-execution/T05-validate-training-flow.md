---
id: E06-T05
epic: E06
depends_on: [E06-T07]
---

# Validar fluxo de treino

## Objetivo

Concluir proveniência mínima e validar o fluxo completo de consulta, agenda,
execução guiada e registro retrospectivo antes de iniciar a tela de dieta.

## Entradas

- `docs/implementation/E06.md`
- `docs/product/P0.md`
- `src/features/training/`
- `src/lib/security/`
- `tests/`

## Entregáveis

- Origem, versão e data de atualização visíveis sem expor dados pessoais.
- Evidências automatizadas e checklist manual do fluxo.

## Subtarefas

- [ ] Exibir e conferir origem, versão e data contra a definição importada.
- [ ] Testar atribuição, preparação, séries livres, estado parcial, histórico e estados vazios.
- [ ] Testar atividade externa retrospectiva sem cronômetro nem horário real.
- [ ] Validar acessibilidade básica e navegação móvel.
- [ ] Confirmar datas, horários, IDs e proveniência.
- [ ] Confirmar acesso público no workspace fixo, erro de gravação e concorrência.
- [ ] Registrar limitações conhecidas.

## Validações

- Executar todos os gates do repositório.

## Critérios de aceite

- [ ] O fluxo principal está íntegro, rastreável e pronto para encerrar o épico.

## Resultado

Ainda não concluída.
