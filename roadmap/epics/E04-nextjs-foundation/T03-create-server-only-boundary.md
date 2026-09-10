---
id: E04-T03
epic: E04
depends_on: [E04-T02]
---

# Criar fronteira server-only

## Objetivo

Impedir que acesso a dados, segredos e regras privilegiadas vaze para o cliente.

## Entradas

- `.env.example`
- `.gitignore`
- `CHANGELOG.md`
- `docs/implementation/tasks/E04-T03.md`
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`
- `package.json`
- `pnpm-lock.yaml`
- `roadmap/ACTIVE.md`
- `roadmap/README.md`
- `roadmap/epics/E04-nextjs-foundation/T05-configure-minimal-ci.md`
- `src/lib/env/server.test.ts`
- `src/lib/env/server.ts`
- `src/lib/security/workspace.test.ts`
- `src/lib/security/workspace.ts`
- `tsconfig.json`

## Entregáveis

- Boundary server-only e validação mínima de ambiente definidos no guia.

## Subtarefas

- [x] Isolar acesso a ambiente e dados.
- [x] Retornar projeções mínimas para renderização.
- [x] Impedir import por Client Components.
- [x] Definir erros discriminados mínimos.

## Validações

- Build falha para import indevido no cliente.
- Nenhum segredo aparece no bundle.

## Critérios de aceite

- [x] Entrada de dados possui um único boundary.

## Resultado

Concluída em 2026-09-10 com uma fronteira server-only única para configuração e resolução do workspace pessoal fixo.

- `APP_ENV` e `PERSONAL_WORKSPACE_ID` são validados no servidor com Zod, sem antecipar banco, sessão ou autenticação.
- Erros de configuração usam código discriminado e informam somente nomes de variáveis inválidas.
- O contexto mínimo de workspace é derivado sem entrada controlada pelo cliente e retornado como objeto imutável.
- Testes unitários cobrem validação, ausência, cache, sanitização e resolução do workspace.
- Um Client Component temporário confirmou que imports dessa árvore fazem o build falhar; removido o probe, o build de produção voltou a passar.
- Instalação congelada, formato, lint, tipos, testes, cobertura, build, auditoria de dependências, diff e busca por segredos foram validados localmente.
