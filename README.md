# Kaizen

Fonte de verdade versionada para regras, planos e evolução incremental de um aplicativo pessoal de treino, alimentação e rotina.

O projeto começa sem código. Primeiro serão migrados e validados dados, regras, histórico e decisões. A aplicação Next.js e o banco serão introduzidos apenas depois da aprovação do produto e da arquitetura.

## Estado atual

- Repositório inicializado.
- Branches `developer`, `staging` e `master` publicadas.
- Roadmap documental criado e centralizado em `roadmap/README.md`.
- Repositório público por decisão do proprietário, com publicação controlada por allowlist no manifesto.
- Dados canônicos, plano vigente e histórico autorizado migrados; perfil, agenda e derivados foram sanitizados e o original do coach permanece privado.
- Nenhuma aplicação, dependência ou banco criado.

## Acesso rápido

- [Status completo do roadmap](roadmap/README.md)
- [Tarefa ativa](roadmap/ACTIVE.md)
- [Branches e ambientes](docs/decisions/BRANCHING-AND-ENVIRONMENTS.md)
- [Padrão de pull request](docs/delivery/PULL-REQUEST-STANDARD.md)
- [Governança de CI/CD](docs/decisions/CI-CD-GOVERNANCE.md)
- [Política do repositório público](docs/decisions/PUBLIC-REPOSITORY-AND-DATA-POLICY.md)
- [Regras da migração](docs/migration/README.md)
- [Repositórios de origem](docs/migration/SOURCE-REPOSITORIES.md)
- [Manifesto de migração](docs/migration/MIGRATION-MANIFEST.md)

## Fluxo de branches

```text
feature branch
      ↓ PR
developer
      ↓ promoção
staging
      ↓ promoção
master
```

`developer` é a branch de integração, `staging` será associada ao preview estável e `master` à produção quando a Vercel for configurada no épico E08.

## Privacidade

O código e a documentação deste repositório são públicos. Isso não torna públicos bancos, ambientes ou dados de execução futuros. Somente artefatos classificados e aprovados no manifesto podem ser versionados; credenciais, identidade, detalhes médicos e dados pessoais desnecessários permanecem fora do Git.
