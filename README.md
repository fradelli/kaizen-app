# Kaizen

Fonte de verdade versionada e aplicação incremental para treino e alimentação pessoal.

A fundação documental está concluída. A aplicação Next.js começa mínima e evolui por tarefas pequenas, preservando dados, decisões e histórico aprovados.

## Estado atual

- Branches `developer`, `staging` e `master` publicadas.
- Fundações de treino e alimentação validadas.
- Produto, arquitetura, privacidade e operação do P0 aprovados.
- Node.js 24.20.0, pnpm 11.25.0 e Next.js 16.3.4 fixados.
- Aplicação mínima disponível localmente com `pnpm dev`.
- Nenhuma feature de negócio ou banco implementado ainda.
- E04-T02 é o próximo incremento após o merge de E04-T01.

## Acesso rápido

- [Tarefa ativa](roadmap/ACTIVE.md)
- [Status completo do roadmap](roadmap/README.md)
- [Produto P0](docs/product/P0.md)
- [Arquitetura alvo](docs/architecture/TARGET-ARCHITECTURE.md)
- [Privacidade e operação](docs/decisions/PRIVACY-AND-OPERATIONS.md)
- [Guia modular de implementação](docs/implementation/P0-IMPLEMENTATION-GUIDE.md)
- [Plano ativo de treino](data/active.json)
- [Plano ativo de alimentação](data/nutrition/active.json)
- [Política do repositório público](docs/decisions/PUBLIC-REPOSITORY-AND-DATA-POLICY.md)
- [Manifesto de migração](docs/migration/MIGRATION-MANIFEST.md)
- [Schemas](schemas/README.md)

## Desenvolvimento local

```powershell
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

A aplicação fica disponível em `http://localhost:3000`. Os comandos de qualidade entram em E04-T02.

## Fluxo de branches

```text
branch de tarefa -> developer -> staging -> master
```

Tarefas entram em `developer` por squash. Promoções para `staging` e `master` usam merge commit.

## Privacidade

O repositório e as definições aprovadas são públicos. Bancos, segredos e registros operacionais permanecem privados e são protegidos no servidor.
