# Guia de implementação do P0

## Objetivo

Este documento converte as decisões aprovadas em uma sequência executável da primeira linha de código até o MVP pessoal em produção. Ele preserva a fundação documental, mantém uma única aplicação Next.js e separa definições públicas de registros operacionais privados.

O proprietário aprovou o plano completo em 2026-09-02. E04-T01 pode começar após o merge de E03-T05.

## Escopo e limites

Incluído:

- scaffold e qualidade da aplicação;
- PostgreSQL, Prisma, migrations e importação;
- tela e registros de Treino;
- tela e registros de Dieta;
- pareamento pessoal, Vercel, Neon, backup e produção.

Excluído:

- cadastro, login convencional e múltiplos usuários no MVP;
- edição dos planos pela interface;
- backend separado, REST interna ou OpenAPI;
- sono, rotina genérica, tarefas, automações, IA e contador de calorias;
- domínio próprio.

## Fontes obrigatórias

Antes de cada tarefa, ler somente:

1. [`AGENTS.md`](../../AGENTS.md);
2. [`roadmap/ACTIVE.md`](../../roadmap/ACTIVE.md);
3. o arquivo da tarefa ativa;
4. os documentos abaixo diretamente relacionados.

| Tema | Fonte |
| --- | --- |
| Jornada e comportamento | [`docs/product/P0.md`](../product/P0.md) |
| Arquitetura | [`TARGET-ARCHITECTURE.md`](../architecture/TARGET-ARCHITECTURE.md) |
| Banco e ORM | [`DATABASE-AND-ORM.md`](../decisions/DATABASE-AND-ORM.md) |
| Ownership de dados | [`DATA-SOURCE-TRANSITION.md`](../decisions/DATA-SOURCE-TRANSITION.md) |
| Privacidade e operação | [`PRIVACY-AND-OPERATIONS.md`](../decisions/PRIVACY-AND-OPERATIONS.md) |
| CI/CD | [`CI-CD-GOVERNANCE.md`](../decisions/CI-CD-GOVERNANCE.md) |
| Treino | [`data/active.json`](../../data/active.json) e [`data/exercises.json`](../../data/exercises.json) |
| Alimentação | [`data/nutrition/active.json`](../../data/nutrition/active.json) |

## Versões pinadas para o início

As versões foram verificadas em 2026-09-02 no registry npm e nas fontes oficiais. E04-T01 deve usar exatamente esta base; qualquer atualização exige evidência de compatibilidade e segurança na própria PR.

| Pacote/runtime | Versão |
| --- | --- |
| Node.js | `24.20.0` |
| pnpm | `11.25.0` |
| Next.js | `16.3.4` |
| React / React DOM | `19.2.8` |
| TypeScript | `7.0.2` |
| tipos Node | `26.4.1` |
| tipos React | `19.2.18` |
| tipos React DOM | `19.2.5` |
| ESLint | `10.9.1` |
| eslint-config-next | `16.3.4` |
| Prettier | `3.9.6` |
| Vitest / coverage-v8 | `4.1.11` |
| Testing Library React | `16.3.3` |
| Testing Library jest-dom | `7.0.1` |
| jsdom | `30.0.1` |
| Zod | `4.5.4` |
| server-only | `0.0.1` |
| Prisma CLI/Client/adapter-pg | `7.10.0` |
| pg / tipos pg | `8.23.0` / `8.23.1` |
| jose | `6.2.10` |
| tsx | `4.23.13` |
| Ajv / ajv-formats | `8.20.0` / `3.0.1` |
| Playwright | `1.62.1` |
| axe-core Playwright | `4.13.0` |

Não instalar `prisma@latest`: o dist-tag observado aponta para Prisma 8 release candidate. O projeto usa `prisma@7.10.0` e `@prisma/client@7.10.0` até uma tarefa explícita aprovar outro major estável.

## Ordem imutável de entrega

Cada linha é uma PR própria para `developer`, mesclada por squash antes da próxima.

| Ordem | Tarefa | Gate de saída |
| ---: | --- | --- |
| 1 | E04-T01 | instalação, execução local e build |
| 2 | E04-T02 | formato, lint, tipos e testes |
| 3 | E04-T03 | boundary server-only e env testados |
| 4 | E04-T04 | shell acessível com Dieta/Treino |
| 5 | E04-T05 | checks estáveis no GitHub Actions |
| 6 | E05-T01 | modelo e metadados de execução aprovados |
| 7 | E05-T02 | migrations reproduzíveis em PostgreSQL limpo |
| 8 | E05-T03 | importação idempotente |
| 9 | E05-T04 | constraints, transações e histórico testados |
| 10 | E05-T05 | backup e restore isolado medidos |
| 11–15 | E06-T01…T05 | fluxo de Treino íntegro |
| 16–20 | E07-T01…T05 | fluxo de Dieta íntegro |
| 21–25 | E08-T01…T05 | preview, proteção, produção e rollback |

E06 e E07 podem compartilhar componentes genéricos somente depois que duas ocorrências reais justificarem a extração. Elas continuam em ordem sequencial neste plano.

# Parte I — Fundação copiável

Os arquivos desta parte possuem conteúdo completo e podem ser aplicados nas tarefas indicadas. Não usar `create-next-app` na raiz: o repositório já contém dados e documentação que precisam ser preservados.

## E04-T01 — Scaffold Next.js

### 1. `.nvmrc`

Ação: **CREATE**.

```text
24.20.0
```

### 2. `.node-version`

Ação: **CREATE**.

```text
24.20.0
```

### 3. `.npmrc`

Ação: **CREATE**.

```ini
engine-strict=true
save-exact=true
strict-peer-dependencies=true
```

### 4. `.gitignore`

Ação: **CREATE**. Não incluir `data/`, `docs/`, `roadmap/` ou `schemas/`.

```gitignore
node_modules/
.next/
out/
coverage/
playwright-report/
test-results/
*.tsbuildinfo

.env
.env.*
!.env.example

.vercel/
.DS_Store
Thumbs.db
pnpm-debug.log*
```

### 5. `package.json`

Ação: **CREATE**.

```json
{
  "name": "kaizen-app",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=24.20.0 <25"
  },
  "packageManager": "pnpm@11.25.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "26.4.1",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.5",
    "typescript": "7.0.2"
  }
}
```

### 6. `tsconfig.json`

Ação: **CREATE**.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 7. `next-env.d.ts`

Ação: **CREATE**. Depois disso, o Next.js pode atualizar referências geradas; não editar manualmente sem necessidade.

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

### 8. `next.config.ts`

Ação: **CREATE**.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
```

### 9. `src/app/layout.tsx`

Ação: **CREATE**.

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kaizen",
  description: "Dieta e treino pessoal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

### 10. `src/app/page.tsx`

Ação: **CREATE**.

```tsx
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.card} aria-labelledby="kaizen-title">
        <p className={styles.eyebrow}>Fundação</p>
        <h1 id="kaizen-title">Kaizen</h1>
        <p>A nova aplicação de dieta e treino está pronta para evoluir por incrementos.</p>
      </section>
    </main>
  );
}
```

### 11. `src/app/page.module.css`

Ação: **CREATE**.

```css
.main {
  display: grid;
  min-height: 100svh;
  place-items: center;
  padding: 1.5rem;
}

.card {
  width: min(100%, 36rem);
  padding: clamp(1.5rem, 5vw, 3rem);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  background: var(--surface);
  box-shadow: 0 1rem 3rem rgb(15 23 42 / 8%);
}

.card h1 {
  margin: 0;
  font-size: clamp(2rem, 8vw, 4rem);
  letter-spacing: -0.04em;
}

.card p:last-child {
  margin: 1rem 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

### 12. `src/app/globals.css`

Ação: **CREATE**.

```css
:root {
  color-scheme: light;
  --background: #f8fafc;
  --surface: #ffffff;
  --text: #172033;
  --muted: #586174;
  --border: #d9dee8;
  --accent: #176b55;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--background);
}

body {
  min-width: 20rem;
  margin: 0;
  color: var(--text);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
  text-rendering: optimizeLegibility;
}

button,
input,
select,
textarea {
  font: inherit;
}

:focus-visible {
  outline: 0.2rem solid var(--accent);
  outline-offset: 0.2rem;
}
```

### 13. `pnpm-lock.yaml`

Ação: **GENERATE**, nunca escrever manualmente.

Executar na raiz:

```powershell
corepack enable
pnpm install
pnpm build
pnpm dev
```

Confirmar `http://localhost:3000`, interromper o servidor e executar `git diff --check`. O lockfile gerado deve entrar na mesma PR.

### 14. `README.md`

Ação: **EDIT**.

- Trocar “O projeto começa sem código” por “A fundação documental está concluída e a aplicação evolui incrementalmente”.
- Em Estado atual, registrar Node, pnpm, Next.js e o comando `pnpm dev`.
- Remover “Nenhuma aplicação, dependência ou banco criado”.
- Não remover links de migração ou privacidade.

O texto final deve refletir somente comandos que passaram na própria PR.

## E04-T02 — Qualidade estática e testes

### Dependências

Ação: **EDIT** em `package.json` e **GENERATE** em `pnpm-lock.yaml` por comandos exatos:

```powershell
pnpm add -D -E eslint@10.9.1 eslint-config-next@16.3.4 prettier@3.9.6 vitest@4.1.11 @vitest/coverage-v8@4.1.11 @testing-library/react@16.3.3 @testing-library/jest-dom@7.0.1 jsdom@30.0.1
pnpm pkg set scripts.format="prettier --write src *.json *.ts *.mjs"
pnpm pkg set scripts.format:check="prettier --check src *.json *.ts *.mjs"
pnpm pkg set scripts.lint="eslint src tests scripts next.config.ts vitest.config.ts --max-warnings=0"
pnpm pkg set scripts.typecheck="tsc --noEmit"
pnpm pkg set scripts.test="vitest run"
pnpm pkg set scripts.test:coverage="vitest run --coverage"
```

### `eslint.config.mjs`

Ação: **CREATE**.

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error"
    }
  },
  globalIgnores([".next/**", "coverage/**", "playwright-report/**", "test-results/**"])
]);
```

### `.prettierignore`

Ação: **CREATE**.

```text
.next
coverage
node_modules
playwright-report
test-results
pnpm-lock.yaml
data
docs
roadmap
schemas
```

### `.prettierrc.json`

Ação: **CREATE**.

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

### `vitest.config.ts`

Ação: **CREATE**.

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": path.join(rootDirectory, "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### `vitest.setup.ts`

Ação: **CREATE**.

```ts
import "@testing-library/jest-dom/vitest";
```

### `src/app/page.test.tsx`

Ação: **CREATE**.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("identifica a fundação do Kaizen", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Kaizen" })).toBeInTheDocument();
    expect(screen.getByText(/dieta e treino/i)).toBeInTheDocument();
  });
});
```

### Validação E04-T02

```powershell
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
git diff --check
```

O formatador não deve reescrever a documentação e os dados históricos em massa.

## E04-T03 — Boundary server-only

### Dependências

Ação: **EDIT/GENERATE**.

```powershell
pnpm add -E server-only@0.0.1 zod@4.5.4
```

### `.env.example`

Ação: **CREATE**. Valores vazios são intencionais para segredos; o arquivo não funciona como ambiente real.

```dotenv
APP_ENV=local
APP_ORIGIN=http://localhost:3000
PERSONAL_WORKSPACE_ID=00000000-0000-4000-8000-000000000001
DATABASE_URL=postgresql://kaizen:kaizen@localhost:5432/kaizen
DIRECT_URL=postgresql://kaizen:kaizen@localhost:5432/kaizen
OWNER_EDIT_TOKEN_HASH=
SESSION_SECRET=
```

### `src/lib/env/server.ts`

Ação: **CREATE**.

```ts
import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  APP_ENV: z.enum(["local", "preview", "production"]).default("local"),
  APP_ORIGIN: z.url(),
  PERSONAL_WORKSPACE_ID: z.uuid(),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  OWNER_EDIT_TOKEN_HASH: z.string().min(64),
  SESSION_SECRET: z.string().min(43),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment(): ServerEnvironment {
  cachedEnvironment ??= serverEnvironmentSchema.parse(process.env);
  return cachedEnvironment;
}
```

### `src/lib/security/workspace.ts`

Ação: **CREATE**.

```ts
import "server-only";

import { getServerEnvironment } from "@/lib/env/server";

export type WorkspaceContext = Readonly<{
  workspaceId: string;
  mode: "fixed-owner";
}>;

export function resolveFixedWorkspace(): WorkspaceContext {
  return {
    workspaceId: getServerEnvironment().PERSONAL_WORKSPACE_ID,
    mode: "fixed-owner",
  };
}
```

### `src/lib/security/workspace.test.ts`

Ação: **CREATE**. O teste deve configurar todas as variáveis antes de importar o módulo, resetar módulos entre casos e confirmar que nenhuma API client-side importa essa árvore. Não copiar segredo real; gerar valores de teste no próprio processo.

### Regras

- Nenhum arquivo com `"use client"` importa `@/lib/env`, `@/lib/db` ou `@/lib/security` server-only.
- O lint deve aplicar `no-restricted-imports` aos módulos client-side quando o primeiro Client Component existir.
- Erro de ambiente encerra o boot/build do servidor; não usa fallback de produção.

## E04-T04 — Shell acessível

### Ações de arquivo

| Ação | Caminho | Responsabilidade |
| --- | --- | --- |
| CREATE | `src/app/_components/app-shell.tsx` | título, navegação e conteúdo |
| CREATE | `src/app/_components/app-shell.module.css` | layout responsivo |
| CREATE | `src/app/dieta/page.tsx` | placeholder sem leitura de negócio |
| CREATE | `src/app/treino/page.tsx` | placeholder sem leitura de negócio |
| EDIT | `src/app/layout.tsx` | envolver conteúdo com shell |
| EDIT | `src/app/page.tsx` | executar `redirect("/dieta")` |
| DELETE | `src/app/page.module.css` | deixa de ter consumidor |
| MOVE | `src/app/page.test.tsx` para `src/app/_components/app-shell.test.tsx` | testar navegação real |

O shell final contém somente links `Dieta` e `Treino`, usa `aria-current` na rota ativa, mantém foco visível, não depende de hover e funciona a 320 px e com zoom de 200%. Os placeholders dizem claramente que os dados entram em E06/E07; não simulam refeições ou exercícios.

### Validação E04-T04

- rota `/` redireciona para `/dieta`;
- links funcionam por teclado;
- headings são hierárquicos;
- viewport estreito não produz rolagem horizontal;
- nenhuma página importa JSON, Prisma ou regra de feature ainda.

## E04-T05 — CI mínimo

### Ações de arquivo

| Ação | Caminho | Conteúdo obrigatório |
| --- | --- | --- |
| CREATE | `scripts/validate-governance.mjs` | direção da PR, ID, título, seções e placeholders |
| CREATE | `scripts/validate-data.mjs` | parse, schemas, IDs, ponteiros e links |
| CREATE | `.github/workflows/ci.yml` | jobs `Governance`, `Quality`, `Test`, `Data integrity`, `Build`, `Dependency audit` |
| CREATE | `.github/dependabot.yml` | pnpm e GitHub Actions semanais |
| EDIT | `package.json` | scripts `governance`, `data:check` e `ci` |
| EDIT | `AGENTS.md` | registrar comandos que realmente existem |

Adicionar versões exatas `ajv@8.20.0` e `ajv-formats@3.0.1`. Actions externas devem ser pinadas por SHA imutável verificado na data da tarefa; como esses SHAs mudam fora do repositório e ainda não foram auditados, este guia não declara um YAML copiável para E04-T05. A tarefa deve registrar os SHAs e a origem no corpo da PR antes do merge.

Matriz do workflow:

- eventos `pull_request` para `developer`, `staging`, `master` em opened, synchronize, reopened e edited;
- `permissions: contents: read`;
- cancelamento por PR para CI, nunca para deploy iniciado;
- Node/pnpm idênticos ao manifesto;
- instalação `pnpm install --frozen-lockfile`;
- nenhum segredo em PR comum;
- audit falha a partir de `moderate`;
- cada nome de job permanece estável.

# Parte II — Banco e importação

Os itens desta parte são especificações exatas de arquivos e gates. O código será produzido na tarefa correspondente após examinar os dados exigidos; nenhum bloco abaixo finge conter a classificação ainda não realizada dos exercícios.

## E05-T01 — Modelo e metadados

| Ação | Caminho | Resultado |
| --- | --- | --- |
| CREATE | `docs/architecture/DATA-MODEL.md` | tabelas, colunas, FKs, uniques, checks e índices |
| CREATE | `data/training-execution-metadata.json` | um item para cada exercício usado nos planos |
| CREATE | `schemas/training-execution-metadata.schema.json` | contrato Draft 2020-12 |
| EDIT | `schemas/README.md` | cobertura e limites |
| EDIT | tarefa, roadmap e changelog | evidência e próximo gate |

Cada item de metadado precisa ter `exercise_id`, `measurement_type`, `load_applicable`, `load_unit` e `normalization_rule`. `load_unit` é `kg` quando aplicável e `null` quando não. A classificação precisa ser revisada exercício por exercício contra plano e biblioteca; categoria, nome e regex não podem definir carga silenciosamente.

O modelo deve conter as 17 entidades conceituais da arquitetura, sem `User`/`Membership`. Toda tabela pessoal inclui `workspace_id`; versões importadas são imutáveis; execuções preservam a versão apresentada.

## E05-T02 — PostgreSQL, Prisma e migrations

### Dependências exatas

```powershell
pnpm add -E @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0 pg@8.23.0
pnpm add -D -E prisma@7.10.0 @types/pg@8.23.1 tsx@4.23.13
```

### Ações

| Ação | Caminho | Responsabilidade |
| --- | --- | --- |
| CREATE | `compose.yaml` | PostgreSQL local com volume nomeado e healthcheck |
| CREATE | `prisma.config.ts` | schema/migrations e `DIRECT_URL` |
| CREATE | `prisma/schema.prisma` | modelos e enums aprovados |
| GENERATE | `prisma/migrations/*/migration.sql` | primeira migration revisada |
| CREATE | `src/lib/db/client.ts` | singleton server-only com adapter pg e URL pooled |
| CREATE | `tests/integration/database.test.ts` | conexão e constraints básicas |
| EDIT | `.env.example` | manter URLs locais e segredos vazios |
| EDIT | `package.json` | scripts `db:generate`, `db:migrate`, `db:deploy`, `db:status` |

O container usa credenciais locais não reutilizadas fora da máquina. CI cria banco limpo. Preview e produção recebem conexões apenas pela plataforma.

## E05-T03 — Importador idempotente

| Ação | Caminho | Responsabilidade |
| --- | --- | --- |
| CREATE | `src/features/import/application/import-canonical-data.ts` | caso de uso transacional |
| CREATE | `src/features/import/data/read-versioned-json.ts` | bytes, SHA-256 e parse server-only |
| CREATE | `src/features/import/data/prisma-import-repository.ts` | lotes, versões e ativações |
| CREATE | `src/features/import/domain/import-contract.ts` | identidades e erros tipados |
| CREATE | `scripts/import-canonical-data.ts` | composition root de CLI |
| CREATE | `tests/integration/import-canonical-data.test.ts` | primeira importação, segunda `no-op`, conflito e rollback |
| EDIT | `package.json` | script `data:import` |

O teste executa a importação duas vezes no mesmo PostgreSQL e compara contagens. Depois altera apenas em memória o hash de uma versão e confirma falha sem ativação parcial.

## E05-T04 — Integridade persistida

Adicionar testes de constraints para ownership, data, série, carga, campos alimentares incompatíveis, revisão concorrente e preservação histórica. Criar `scripts/validate-persisted-data.ts` para CI contra banco descartável. Não usar SQLite ou mock do Prisma.

## E05-T05 — Backup e restore

Criar `docs/operations/BACKUP-AND-RESTORE.md`, script de verificação que não contém credenciais e evidência de restore em branch Neon isolada. A tarefa só termina quando o dump restaurado passa migrations, importação, contagens por workspace e smoke de ambos os domínios dentro do RTO.

# Parte III — Treino

## E06-T01 — Projeções

Criar:

- `src/features/training/domain/` para estados, medidas e invariantes;
- `src/features/training/application/get-public-training-plan.ts`;
- `src/features/training/application/get-training-day.ts`;
- `src/features/training/application/training-repository.ts`;
- `src/features/training/data/prisma-training-repository.ts`;
- `src/features/training/application/training-dto.ts`;
- testes unitários e de integração correspondentes.

DTO anônimo nunca contém assignment, execution ou comentário. DTO pessoal exige sessão e resolve workspace no servidor.

## E06-T02 — Página do dia

Criar componentes server/client sob `src/features/training/ui/` e substituir o placeholder de `src/app/treino/page.tsx`. A query `date=YYYY-MM-DD` é validada em `America/Sao_Paulo`. Implementar anterior, Hoje, seguinte, loading, não atribuído, treino, mobilidade, descanso e erro.

## E06-T03 — Registros

Criar Server Actions separadas para atribuir o dia, salvar preparação, salvar série e concluir sessão. Cada action executa autorização, Zod, caso de uso, revisão otimista e revalidação. Carga não aparece nem é aceita quando o metadado for falso. O formulário preserva rascunho após erro.

## E06-T04 — Proveniência e histórico

Mostrar plano/versão da execução e permitir navegar datas anteriores sem trocar o ponteiro ativo. Não expor caminhos privados ou originais `DO_NOT_PUBLISH`.

## E06-T05 — Gate

Adicionar Playwright e axe nas versões pinadas. Cobrir anônimo, pareado, atribuição, preparação, carga aplicável/não aplicável, salvamento parcial, conflito, descanso, histórico, teclado e viewport móvel.

# Parte IV — Dieta

## E07-T01 — Projeções

Criar estrutura equivalente sob `src/features/nutrition/`, com casos de uso público e pessoal separados. Resolver `reference_option` no servidor e preservar a versão do plano.

## E07-T02 — Página do dia

Substituir `src/app/dieta/page.tsx` pelo Server Component real e criar componentes em `src/features/nutrition/ui/`. Sem tipo atribuído, não mostrar faixa ou módulos como recomendação; solicitar escolha explícita.

## E07-T03 — Registros

Criar actions para atribuir tipo e salvar refeição. Validar estados `pending`, `followed_plan`, `followed_different` e `skipped`; opção e descrição alternativa são mutuamente exclusivas; comentário tem 1.000 caracteres; descrição alternativa, 500.

## E07-T04 — Segurança e proveniência

Exibir versão, status profissional e unknowns de forma contextual. Não reproduzir conteúdo privado da revisão. Sem cálculo automático de calorias ou avaliação moral do dia.

## E07-T05 — Gate

Cobrir com Playwright/axe: anônimo, pareado, tipo ausente, escolha de opção, refeição diferente, pulada, comentário, erro, reload, conflito, histórico, teclado e celular.

# Parte V — Publicação

## E08-T01 — Preview

Vincular o repositório à Vercel com `master` como production branch. `staging` é preview estável. Configurar Neon sem dados pessoais para PR/staging, migrations/importação antes do deploy e smoke tests após a URL responder.

## E08-T02 — Proteção

Adicionar:

- `src/lib/security/session.ts` com JOSE e cookie `__Host-`;
- `src/lib/security/authorization.ts`;
- `src/app/ativar/page.tsx` e action de pareamento;
- rate limit persistido/infraestrutural;
- headers no `next.config.ts`;
- testes de sessão ausente, inválida, expirada e rotacionada.

Gerar chave de edição com 32 bytes aleatórios e segredo de sessão com pelo menos 32 bytes. Somente hashes/segredos entram nas plataformas; nenhum valor vai ao guia, PR ou log.

## E08-T03 — Produção

Confirmar no momento da tarefa custos e limites da Vercel/Neon, cadastrar variáveis exclusivas, escolher armazenamento privado do backup cifrado, configurar RPO/RTO e executar snapshot/dump antes de migration material.

## E08-T04 — Operação e rollback

Executar restore isolado medido, smoke pareado/anônimo, inspeção de headers/cache/logs e rollback para deployment anterior compatível com o schema.

## E08-T05 — Release

Promover `developer -> staging -> master` por PRs de promoção e merge commit. Registrar SHA, migrations, import batch, URL gerada, backup, smoke, limitações e rollback. Não comprar domínio nem habilitar cadastro.

# Validação por camada

## Comandos locais após E04

```powershell
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
git diff --check
```

## Comandos após E05

```powershell
pnpm db:generate
pnpm db:deploy
pnpm data:check
pnpm data:import
pnpm test
pnpm build
```

Os nomes são contratos do guia; só devem ser adicionados ao `package.json` na tarefa que criar sua implementação real.

## Verificação manual

- Sem segredo, URL local absoluta ou dado operacional no Git.
- Uma única tarefa `IN_PROGRESS` no roadmap.
- Links relativos válidos.
- Rotas anônimas não recebem DTO pessoal.
- Carga ausente quando não aplicável.
- Comentários não aparecem em logs/erros.
- Data correta perto da meia-noite de São Paulo.
- Histórico mantém a versão apresentada.
- Preview não usa banco de produção.

# Rollback

| Falha | Ação |
| --- | --- |
| scaffold não instala/builda | reverter somente a PR E04-T01; dados/documentos permanecem |
| check de qualidade incompatível | corrigir configuração na branch; não desabilitar o check |
| migration falha | abortar deploy; corrigir adiante e testar banco limpo |
| importação falha | rollback transacional; ativação anterior permanece |
| feature falha | reverter deployment/código compatível; não apagar execuções |
| sessão comprometida | rotacionar chave/hash e `SESSION_SECRET`, redeploy e revisar logs sanitizados |
| perda/corrupção | interromper escrita, restaurar isolado, validar e só então promover |

Nunca usar `git reset --hard`, force push, `prisma migrate reset` fora de banco descartável ou edição manual de produção como procedimento normal.

# Decisões explícitas ainda pertencentes a tarefas futuras

Não bloqueiam E04-T01:

- E05-T01 classifica `measurement_type` e `load_applicable` para cada exercício; nenhum valor foi inventado neste guia.
- E04-T05 audita e registra os SHAs atuais das GitHub Actions antes de criar o workflow copiável.
- E08-T03 escolhe o armazenamento privado concreto do backup depois de reconfirmar custos e retenção.
- Valores reais de segredos e IDs de workspace são gerados fora do Git no ambiente correspondente.

Essas decisões possuem owner task e gate. Não há decisão arquitetural implícita necessária para iniciar o scaffold.

# Critérios de aceite deste guia

- O primeiro incremento possui caminhos, ações e conteúdo completos.
- Arquivos gerados automaticamente são identificados como `GENERATE`, não simulados.
- Nenhum bloco copiável contém segredo ou placeholder operacional.
- Tarefas E04–E08 possuem ordem, entradas, arquivos, validações e rollback.
- Lacunas dependentes de evidência possuem tarefa responsável e falham de modo seguro.
- A fundação `data/`, `docs/`, `roadmap/`, `schemas/` e `templates/` permanece intacta.
- E04-T01 pode começar sem criar código prematuro de E05–E08.
