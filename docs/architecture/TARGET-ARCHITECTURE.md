# Arquitetura alvo do Kaizen

## Status

- Data: 2026-09-02
- Decisão: aprovada
- Tarefa: `E03-T04`
- Escopo: MVP pessoal de Dieta e Treino

## Drivers

1. Publicar rápido uma aplicação pessoal com somente duas jornadas.
2. Preservar regras e versões de planos sem duplicar fontes editáveis.
3. Registrar execuções privadas em PostgreSQL.
4. Operar localmente, em preview e em produção na Vercel.
5. Permitir contas e múltiplos workspaces no futuro sem antecipar suas telas.
6. Manter segurança, migrations, testes e rollback proporcionais aos dados pessoais.

## Stack escolhida

| Área | Escolha | Regra de versão |
| --- | --- | --- |
| Runtime | Node.js 24 LTS | versão exata pinada no repositório e Vercel |
| Framework | Next.js 16 App Router | última versão estável corrigida da linha Active LTS; mínimo seguro 16.3.3 na data da decisão |
| UI | React 19 | versão compatível exigida pelo Next.js pinado |
| Linguagem | TypeScript em modo estrito | sem `any` implícito e sem emissão no typecheck |
| Pacotes | pnpm via Corepack | campo `packageManager` e lockfile obrigatórios |
| Estilos | CSS Modules + tokens globais | sem framework de componentes no P0 |
| Validação | Zod | schemas na fronteira de entrada; domínio mantém invariantes próprias |
| Banco | PostgreSQL | local em container; Neon em preview e produção |
| ORM | Prisma ORM 7 estável | Client gerado, driver adapter PostgreSQL e Prisma Migrate |
| Testes unitários | Vitest | domínio, aplicação, parsers e validação |
| Testes de UI | Testing Library | comportamento e acessibilidade de componentes interativos |
| Testes E2E | Playwright | jornadas críticas em PostgreSQL real |
| Hospedagem | Vercel | runtime Node.js, não Edge |

Versões exatas pertencem ao guia E03-T05 e ao lockfile de E04-T01. Dependências `latest`, beta, canary, release candidate ou intervalos sem lockfile não entram no projeto. Em 2026-09-02, Node 24 é LTS e Next.js 16.3 é Active LTS; a implementação deve usar o patch estável mais recente e corrigido disponível no início de E04.

## Forma do sistema

```text
Navegador
  ├─ leitura pública ───────────────┐
  ├─ leitura pessoal com sessão ───┤
  └─ Server Action autorizada ─────┤
                                    v
Next.js App Router no runtime Node.js
  ├─ UI: páginas, layouts e componentes
  ├─ Application: casos de uso e portas
  ├─ Domain: entidades, valores e invariantes
  └─ Data: repositórios e importadores server-only
                                    |
                                    v
Prisma Client + adapter PostgreSQL
                                    |
                                    v
PostgreSQL local / Neon por ambiente
```

É uma única aplicação full-stack e um único banco por ambiente. O navegador não acessa o banco, e o servidor não faz requisição HTTP para suas próprias rotas.

## Estrutura de diretórios alvo

```text
src/
  app/
    (public)/
    dieta/
    treino/
    ativar/
    api/health/
    layout.tsx
    page.tsx
  features/
    nutrition/
      domain/
      application/
      data/
      ui/
    training/
      domain/
      application/
      data/
      ui/
  lib/
    db/
    env/
    security/
    validation/
  generated/
    prisma/
prisma/
  migrations/
  schema.prisma
tests/
  integration/
  e2e/
```

Pastas são criadas apenas quando recebem um arquivo necessário. Não serão adicionados barrels globais, diretórios vazios ou camadas sem consumidor.

## Boundaries

### Domínio

Contém tipos e regras puras de Dieta e Treino:

- estados permitidos;
- valores de data civil e medidas;
- transições de cumprimento e execução;
- incompatibilidade entre opção e descrição alternativa;
- aplicabilidade de carga;
- conclusão com pendências;
- concorrência por revisão.

Não importa React, Next.js, Prisma, Zod, `process.env` ou APIs de rede.

### Aplicação

Implementa casos de uso, por exemplo:

- obter dieta do dia;
- atribuir tipo de dia;
- registrar refeição;
- obter treino do dia;
- atribuir treino, mobilidade ou descanso;
- registrar série;
- concluir sessão.

Depende do domínio e de interfaces pequenas de repositório, relógio, workspace e transação. Não conhece componentes nem modelos gerados do Prisma.

### Dados

Implementa as portas da aplicação com Prisma, importador e mapeadores. É `server-only` e responde por:

- queries com filtro de workspace;
- transações e optimistic concurrency;
- tradução entre registros e domínio;
- importação idempotente dos JSONs;
- ativação de versões;
- sanitização de erros de infraestrutura.

Tipos do Prisma não atravessam a fronteira para UI ou domínio.

### UI

Server Components carregam DTOs pelos casos de uso. Client Components existem somente para interação local: formulários, estados de envio, confirmação e foco. Eles recebem DTOs serializáveis e não importam repositórios, Prisma ou segredos.

### Dependências permitidas

| Origem | Pode depender de |
| --- | --- |
| `domain` | biblioteca padrão e código do próprio domínio |
| `application` | `domain` e portas definidas em `application` |
| `data` | `application`, `domain`, Prisma e adapters server-only |
| `ui` | DTOs/casos de uso públicos da feature e React |
| `app` | `ui`, composition root e funções server-only em entrypoints do servidor |

Importação inversa falha no lint/validação arquitetural.

## Next.js

### Server Components

- São o padrão para páginas e leituras iniciais.
- Leem conteúdo público versionado ou DTOs do banco pelo application layer.
- Dados pessoais dependentes de cookie são dinâmicos e não usam cache público.
- Conteúdo público imutável pode usar cache por versão do plano.
- Segredos e objetos do Prisma nunca são serializados para o cliente.

### Client Components

- Começam no menor limite que precisa de estado/interação.
- Mantêm rascunho enquanto a mutação está em andamento ou falha.
- Não confirmam persistência de forma otimista antes da resposta do servidor.
- Não fazem fetch para Route Handler interno quando uma Server Action resolve o caso.

### Server Actions

Cada mutação segue esta ordem:

1. validar origem da requisição;
2. resolver e verificar sessão do proprietário;
3. derivar `workspace_id` no servidor;
4. validar input com Zod;
5. converter para comando da aplicação;
6. executar caso de uso em transação quando necessário;
7. mapear conflito ou erro esperado para resultado tipado;
8. revalidar somente a leitura afetada;
9. retornar DTO mínimo sem dado sensível desnecessário.

Server Actions são tratadas como endpoints públicos. Não se confia em componente oculto, campo hidden ou TypeScript do cliente.

### Route Handlers

No P0, existem somente quando há consumidor HTTP real:

- health check sanitizado;
- callbacks futuros de provedor, inexistentes no MVP;
- automação operacional que não possa chamar código interno diretamente.

Não existe REST interna, OpenAPI ou BFF separado para a própria UI.

## Rotas do P0

| Rota | Renderização | Acesso |
| --- | --- | --- |
| `/` | redirect para `/dieta` | público |
| `/dieta` | Server Component + ilhas de formulário | plano público; execução somente proprietário |
| `/treino` | Server Component + ilhas de formulário | plano público; execução somente proprietário |
| `/ativar` | formulário mínimo | público com rate limit; cria sessão em sucesso |
| `/api/health` | Route Handler Node.js | público, sem dados pessoais |

A data selecionada usa query string ISO `YYYY-MM-DD`. O servidor interpreta em `America/Sao_Paulo` e rejeita formato inválido.

## Definições importadas

Os JSONs versionados são validados e importados conforme [`DATA-SOURCE-TRANSITION.md`](../decisions/DATA-SOURCE-TRANSITION.md). As versões do banco são insert-only e preservam:

- ID e versão da fonte;
- caminho relativo;
- SHA-256;
- schema version;
- commit da aplicação/importação;
- documento-fonte imutável para auditoria;
- relações normalizadas necessárias às jornadas.

O documento-fonte em JSONB é uma cópia de auditoria dentro da mesma projeção imutável, não uma segunda fonte editável.

### Metadados de execução de treino

Os arquivos atuais usam strings como `4-6`, `8_contacts`, `3_each_side` e `2_minutes`; eles não declaram de forma completa se carga externa é aplicável. A UI não pode inferir isso por categoria ou nome.

Antes da importação E05, deve existir um contrato nativo e revisado para cada exercício utilizado contendo:

- `measurement_type`: `repetitions`, `seconds`, `contacts` ou `per_side`;
- `load_applicable`: booleano;
- unidade de carga permitida, inicialmente `kg` quando aplicável;
- regra de normalização do texto prescrito.

Esse contrato pertence aos dados versionados e complementa, sem sobrescrever, a biblioteca migrada. Ausência de classificação é erro de importação, nunca default silencioso.

## Modelo conceitual

### Plataforma mínima

- `Workspace`: boundary de ownership; existe um workspace fixo no MVP.
- `ImportBatch`: proveniência e resultado de uma importação.
- `PlanActivation`: versão ativa por domínio e ambiente lógico.

### Treino

- `ExerciseDefinition`: versão importada da biblioteca e metadados de execução.
- `TrainingPlanVersion`: versão imutável do plano.
- `TrainingSessionDefinition`: sessão pertencente à versão.
- `TrainingExerciseDefinition`: ordem, dose, descanso, prioridade e referência de exercício.
- `DailyTrainingAssignment`: data + `training`, `mobility`, `rest` ou `unassigned` por workspace.
- `TrainingExecution`: estado e comentário geral associados à atribuição e à versão.
- `TrainingExerciseExecution`: resultado/comentário por exercício prescrito.
- `TrainingSetExecution`: série, status, medida, lados e carga aplicável.

### Alimentação

- `NutritionPlanVersion`: versão imutável do plano.
- `NutritionDayTypeDefinition`: tipo, faixa e módulos da versão.
- `MealDefinition`: refeição ordenada da versão.
- `MealOptionDefinition`: opção ou referência resolvida.
- `DailyNutritionAssignment`: data + tipo de dia por workspace.
- `MealExecution`: estado, opção, descrição alternativa e comentário.

Não existem `User` ou `WorkspaceMembership` no MVP. As tabelas pessoais já contêm `workspace_id`; as entidades de conta entram somente no cutover futuro.

## Regras relacionais obrigatórias

- Chaves primárias internas usam UUID gerado no servidor/banco.
- IDs de domínio e versões da fonte permanecem colunas explícitas.
- Unicidade de plano: domínio + `plan_id` + `version`.
- Unicidade de importação: caminho da fonte + SHA-256.
- Unicidade diária inclui `workspace_id` + data civil.
- Uma execução referencia exatamente uma atribuição e a versão apresentada.
- Número de série é único dentro da execução do exercício.
- Carga é `null` quando `load_applicable=false`.
- Campos incompatíveis com o estado alimentar são `null` por constraint/regra transacional.
- `revision` inteiro suporta concorrência otimista.
- Exclusões em cascata não alcançam versões ou execuções históricas.
- Datas de domínio usam `date`; timestamps usam UTC; apresentação usa `America/Sao_Paulo`.

O Prisma Schema expressa o que for suportado. Constraints SQL adicionais são incluídas na migration e testadas, não omitidas por limitação do ORM.

## Fluxos

### Importação

```text
JSON do commit -> parse/schema -> referências -> SHA-256
  -> transação -> lote -> versões ausentes -> ativações -> commit
```

- Importar duas vezes produz `no-op`.
- Mesmo ID/versão com hash diferente falha.
- Ponteiro inválido preserva ativação anterior.
- Importação não altera atribuições nem execuções.

### Leitura pessoal

```text
cookie -> sessão -> workspace -> caso de uso -> repository
  -> plano ativado + execução da data -> DTO mínimo -> Server Component
```

### Mutação

```text
form -> Server Action -> auth + Zod -> comando + revisão esperada
  -> transação -> constraint/revision -> resultado tipado -> revalidação
```

## Transações e concorrência

- Atribuir um dia e criar seu registro inicial ocorre atomicamente.
- Mudar status limpa campos incompatíveis na mesma transação.
- Atualização inclui a revisão esperada; zero linhas alteradas retorna conflito.
- Concluir sessão não marca séries pendentes como realizadas.
- Erro conhecido retorna código de domínio; erro inesperado recebe request ID e log sanitizado.
- Retry automático só ocorre em operação idempotente e erro transitório conhecido.

## Segurança

A arquitetura implementa [`PRIVACY-AND-OPERATIONS.md`](../decisions/PRIVACY-AND-OPERATIONS.md):

- sessão de proprietário em cookie `__Host-`, `HttpOnly`, `Secure`, `SameSite=Lax`;
- secrets validados no boot e acessíveis apenas no servidor;
- `WorkspaceResolver` server-only;
- autorização na Data Access Layer e em toda mutação;
- validação de origem e entrada;
- queries sempre filtradas por workspace para dado pessoal;
- conteúdo pessoal sem cache público;
- headers de segurança e `noindex`;
- logs sem payload, cookie ou segredo;
- runtime role separada da migration role;
- conexão TLS pooled no runtime e direta no CI de migration.

O token de pareamento tem alta entropia; seu hash é comparado em tempo constante. A sessão é assinada/autenticada por biblioteca criptográfica consolidada, sem algoritmo caseiro.

## Migrations

### Desenvolvimento

- Alterar `prisma/schema.prisma` e criar migration com `prisma migrate dev` somente contra banco local descartável.
- Revisar o SQL gerado e adicionar constraints/índices explícitos necessários.
- Commitar schema e diretório completo da migration juntos.
- Validar do zero, não apenas sobre o banco do autor.

### CI, staging e produção

- CI cria PostgreSQL limpo, executa `prisma migrate deploy`, importa dados e roda testes.
- Staging e produção executam `prisma migrate deploy` em job único, com conexão direta e ambiente protegido.
- `prisma db push`, `migrate dev` e reset são proibidos em preview estável e produção.
- Deploy falha antes de servir código incompatível se migration ou importação falhar.
- Migration destrutiva segue expand/contract em releases diferentes.
- Migration aplicada nunca é editada ou apagada.
- Rollback de aplicação usa código compatível; banco recebe correção adiante.

## Estratégia de testes

| Nível | Ferramenta | Cobertura mínima |
| --- | --- | --- |
| Dados documentais | validadores JSON + testes próprios | schemas, ponteiros, IDs, referências e metadados de execução |
| Domínio | Vitest | transições, medidas, carga, comentários, conclusão e datas |
| Aplicação | Vitest com fakes pequenos | autorização invocada, casos de uso, conflitos e erros |
| Integração | Vitest + PostgreSQL real | repositories, constraints, transações, migration e importador duas vezes |
| Componentes | Testing Library | formulários, erro associado, teclado e estados de envio |
| E2E | Playwright + PostgreSQL isolado | Dieta, Treino, descanso, pareamento, anônimo e histórico |
| Build/operação | Next build + smoke | env, headers, health, migration, importação e rollback |

SQLite, mocks do Prisma e snapshots visuais não substituem testes relacionais. Cada bug de domínio recebe teste no nível mais baixo capaz de reproduzi-lo.

### Casos obrigatórios

- dia sem tipo não inventa faixa alimentar;
- `followed_different` exige descrição;
- mudança de status limpa campos incompatíveis;
- exercício sem carga não aceita nem persiste carga;
- medidas por lado preservam os dois valores;
- conclusão com pendências não fabrica execução;
- importação repetida não duplica;
- versão com hash conflitante falha;
- sessão ausente não lê registros nem executa mutação;
- gravações concorrentes retornam conflito;
- nova ativação não reescreve histórico;
- timezone permanece correto na virada do dia.

## Observabilidade e falhas

- Toda resposta e log de erro possuem request ID.
- Health check informa somente status, versão e dependências agregadas.
- Erros são categorizados em validação, autorização, conflito, indisponibilidade e interno.
- Métricas não usam IDs pessoais, comentários ou descrições como labels.
- Falha do banco mostra conteúdo público disponível quando seguro e bloqueia operações pessoais.
- Backup/restore e deploy registram evidências separadas dos logs da aplicação.

## Incrementos

1. E04 cria scaffold, qualidade, boundary server-only, shell e CI sem regra de negócio.
2. E05 modela PostgreSQL, cria metadados de execução, migrations, importador e restore.
3. E06 implementa projeção e registros de Treino.
4. E07 implementa projeção e registros de Dieta.
5. E08 configura Vercel/Neon, pareamento, proteção, backup e produção.

Cada incremento deve manter lint, tipos, testes, integridade e build verdes. Não se cria abstração para fase futura sem consumidor no incremento atual.

## Alternativas rejeitadas no P0

- NestJS, backend separado ou microserviços: duplicam deploy e contratos sem consumidor externo.
- REST/OpenAPI interna: adiciona serialização e manutenção entre partes do mesmo Next.js.
- Monorepo: existe uma aplicação e nenhum pacote reutilizado.
- Edge Runtime: Prisma/PostgreSQL, criptografia e ferramentas operacionais usam Node com menos restrições.
- SQLite em produção ou testes de integração: não representa constraints e concorrência do PostgreSQL alvo.
- Supabase como plataforma completa: autenticação, storage e realtime não são necessários.
- Drizzle como ORM principal: Prisma oferece migrations e modelo tipado suficientes para o time/projeto atual.
- Prisma Accelerate: Neon já oferece pooling; outra camada não resolve requisito confirmado.
- Redux ou TanStack Query: Server Components e estado local de formulário cobrem o P0.
- Tailwind ou biblioteca de componentes: CSS Modules e tokens atendem duas telas sem nova taxonomia.
- autenticação completa: pareamento pessoal atende o MVP; boundaries já aceitam evolução futura.

## Fontes oficiais

- [Node.js — Releases](https://nodejs.org/en/about/previous-releases)
- [Next.js — Blog e releases](https://nextjs.org/blog)
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js — Authentication](https://nextjs.org/docs/app/guides/authentication)
- [Prisma — Next.js](https://www.prisma.io/docs/guides/v7/frameworks/nextjs)
- [Prisma — Neon](https://docs.prisma.io/docs/orm/v6/overview/databases/neon)
- [Prisma — Migrate deploy](https://docs.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)
- [Neon — Connection pooling](https://neon.com/docs/connect/connection-pooling)

## Critério de conclusão

A arquitetura permite entregar cada jornada em incrementos pequenos, preserva uma fonte editável por classe de dado, protege operações pessoais e não introduz backend ou protocolo interno sem consumidor.
