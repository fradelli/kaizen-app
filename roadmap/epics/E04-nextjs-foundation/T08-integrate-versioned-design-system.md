---
id: E04-T08
epic: E04
depends_on: [E04-T07]
---

# Integrar Design System versionado

## Objetivo

Adotar exatamente `@fradelli/ui@0.1.0` pelo GitHub Packages com instalação, build e rollback reproduzíveis.

## Contexto

A integração só começa após o GO de prontidão de E04-T07. O package publicado é privado e versionado; credenciais de leitura permanecem fora do repositório.

## Entradas

- `docs/implementation/tasks/E04-T08.md`
- `docs/implementation/evidence/E04-T07-DESIGN-SYSTEM-READINESS.md`
- `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md`
- `.npmrc`
- `package.json`
- `pnpm-lock.yaml`
- `postcss.config.mjs`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/page.module.css`
- `src/app/foundations/page.tsx`
- `src/app/foundations/page.test.tsx`
- `.github/workflows/ci.yml`
- `CHANGELOG.md`
- `https://github.com/fradelli/design-system/blob/3e0c23f591ff458ab9e3e74dc44bb0cdba068a03/package.json`

## Escopo

- Configurar o scope público do registry sem versionar autenticação.
- Instalar versões exatas do package e da toolchain CSS compatível.
- Configurar Tailwind CSS 4 e PostCSS.
- Carregar Inter variável e expor `--font-inter` no elemento raiz.
- Ativar dark explicitamente, importar uma vez o CSS público e registrar o `dist` em `@source`.
- Criar `/foundations` como smoke test sem domínio.
- Remover somente tokens e estados locais substituídos pelo package.
- Estender CI para instalar o package privado com acesso mínimo.

## Fora do escopo

- Construir shell definitivo, páginas de dieta/treino ou calendário compartilhado.
- Copiar código do package para o Kaizen.
- Adicionar flags ou variantes específicas de produto ao Design System.

## Entregáveis

- Dependências e lockfile reproduzíveis.
- Configuração Tailwind/PostCSS e integração raiz de fonte, tema e CSS.
- Página foundations e testes de smoke.
- CI autorizado a ler somente o package necessário.

## Subtarefas

- [ ] Fixar `@fradelli/ui@0.1.0` sem range ou caminho local.
- [ ] Aplicar o contrato público reconfirmado em E04-T07.
- [ ] Criar foundations sem conceito de dieta, treino, hábito ou tarefa.
- [ ] Validar instalação limpa, acessibilidade, responsividade e build.
- [ ] Registrar a versão anterior ou o commit pré-adoção para rollback.

## Validações

- Executar `pnpm install --frozen-lockfile` em checkout limpo.
- Executar format check, lint, typecheck, testes, cobertura e build localmente e no CI.
- Inspecionar CSS gerado, foco, teclado, contraste, 320 px e zoom de 200%.
- Confirmar um único React, ausência de credencial e importação única do CSS público.

## Critérios de aceite

- [ ] `@fradelli/ui` usa versão exata do GitHub Packages.
- [ ] Inter, `--font-inter`, dark, CSS público e `@source` estão ativos no root.
- [ ] Foundations prova tokens e primitives disponíveis sem domínio.
- [ ] Instalação congelada e build passam em ambiente limpo e no CI.
- [ ] O rollback por versão ou commit está documentado e testável.

## Riscos

- Falha de autenticação ou permissão do package privado.
- CSS duplicado, ordem incorreta de imports ou classes omitidas.
- Duas cópias de React ou incompatibilidade durante a linha `0.x`.

## Rollback

Reverter a PR na primeira adoção. Em upgrades posteriores, restaurar a versão exata e o lockfile do último release conhecido como bom; nunca copiar código nem republicar o mesmo número de versão.

## Resultado

Ainda não concluída.
