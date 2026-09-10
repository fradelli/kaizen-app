---
id: E04-T07
epic: E04
depends_on: [E04-T05, E04-T06]
---

# Validar prontidão técnica para o Design System

## Objetivo

Determinar, sem instalar o package, se a base técnica do Kaizen está pronta para receber `@fradelli/ui@0.1.0` de forma reproduzível.

## Contexto

`@fradelli/ui@0.1.0` já foi publicado de forma privada no GitHub Packages. Node 24.20.0 e React 19.2.8 atendem aos engines e peers do package. E04-T02 está integrada em `developer`, mas seus gates precisam ser reexecutados com o CI de E04-T05 antes deste gate; a estratégia segura de autenticação também precisa ser comprovada antes da instalação.

## Entradas

- `docs/implementation/tasks/E04-T07.md`
- `docs/decisions/SHARED-DESIGN-SYSTEM-ADOPTION.md`
- `package.json`
- `pnpm-lock.yaml`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `.github/workflows/ci.yml`
- `https://github.com/fradelli/design-system/blob/3e0c23f591ff458ab9e3e74dc44bb0cdba068a03/package.json`

## Escopo

- Confirmar versões de Node, pnpm, Next.js, React e React DOM.
- Confirmar o contrato publicado: versão, engines, peers, exports, CSS público, `dist` e primitives.
- Verificar que E04-T02 e E04-T05 entregaram gates e CI verdes antes da integração visual.
- Planejar registry e autenticação local/CI sem gravar credenciais.
- Registrar decisão GO/NO-GO e gaps remanescentes em relatório sanitizado.

## Fora do escopo

- Instalar `@fradelli/ui`, Tailwind CSS, PostCSS ou fontes.
- Alterar `package.json`, lockfile, CSS, root, componentes ou workflow.
- Implementar shell, calendário ou tela de domínio.

## Entregáveis

- `docs/implementation/evidence/E04-T07-DESIGN-SYSTEM-READINESS.md`
- Matriz de compatibilidade, checklist dos gates e decisão GO/NO-GO.

## Subtarefas

- [ ] Confirmar runtime, package manager e peer React sem instalar o package.
- [ ] Confirmar gates locais e CI existentes e verdes.
- [ ] Documentar autenticação segura local e no workflow.
- [ ] Registrar contrato público de `@fradelli/ui@0.1.0` e decisão de prontidão.

## Validações

- Executar format check, lint, typecheck, testes, cobertura e build já disponíveis.
- Confirmar React `>=19.2.7 <20` e Node `>=24.20.0 <25`.
- Confirmar que o workflow possui base para instalação congelada e permissão mínima futura.
- Confirmar que o diff não contém package, `.tgz`, token, credencial ou configuração autenticada.

## Critérios de aceite

- [ ] A matriz confirma compatibilidade de runtime e React com `@fradelli/ui@0.1.0`.
- [ ] Formato, lint, typecheck, testes, cobertura e build passam localmente e no CI.
- [ ] O relatório identifica autenticação local ainda ausente ou comprovada sem expor segredo.
- [ ] A decisão GO/NO-GO lista todos os gaps sem instalar ou alterar a aplicação.

## Riscos

- Confundir permissão Read concedida ao repositório com autenticação local configurada.
- Aprovar prontidão apesar de gates ou CI ausentes.
- Contrato `0.x` mudar sem nova versão exata e nova validação.

## Rollback

Reverter somente o relatório e a atualização de status. Como a tarefa não instala dependências nem altera a aplicação, não há rollback técnico de runtime.

## Resultado

Ainda não concluída.
