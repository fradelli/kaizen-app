---
id: E09-T10
epic: E09
depends_on: [E09-T09]
---

# Projetar contas e experiência de treinador

## Objetivo

Definir autenticação, ownership e colaboração treinador–aluno somente depois que
o domínio de catálogo, template e sessão estiver estável no MVP pessoal.

## Entradas

- `docs/architecture/TARGET-ARCHITECTURE.md`
- `docs/decisions/PUBLIC-SINGLE-WORKSPACE-MODE.md`
- `prisma/models/platform.prisma`
- `src/lib/security/workspace.ts`
- `roadmap/epics/E09-future-evolution/T09-design-exercise-catalog-and-authoring.md`

## Entregáveis

- Modelo de identidade e ownership com estratégia de migração do workspace fixo.
- Decisão entre papéis de usuário e entidades separadas de treinador e atleta.
- Jornada mínima de treinador selecionar aluno, montar template e atribuir plano.
- Matriz de autorização para catálogo, templates, sessões e histórico.
- Plano incremental de autenticação antes de armazenar dados de múltiplas pessoas.

## Fora de escopo

- Implementar login, cadastro, cobrança, convite ou painel de treinador.
- Generalizar todo registro com `userId` antes de existir uma jornada aprovada.

## Critérios de aceite

- [ ] O workspace pessoal existente possui caminho de migração sem perder histórico.
- [ ] Papéis, relacionamentos e ownership derivam de jornadas reais, não de nomes hipotéticos.
- [ ] Nenhuma operação de outro usuário depende de identificador fornecido sem autorização no servidor.

## Resultado

Ainda não iniciada. Depende das decisões de catálogo e autoria e não participa do
caminho crítico do MVP pessoal.
