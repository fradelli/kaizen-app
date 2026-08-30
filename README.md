# Kaizen

Fonte de verdade versionada para regras, planos e evolução incremental de um aplicativo pessoal de treino, alimentação e rotina.

O projeto começa sem código. Primeiro serão migrados e validados dados, regras, histórico e decisões. A aplicação Next.js e o banco serão introduzidos apenas depois da aprovação do produto e da arquitetura.

## Estado atual

- Repositório inicializado.
- Branches `developer`, `staging` e `master` publicadas.
- Roadmap documental criado e centralizado em `roadmap/README.md`.
- Migração de dados pessoais bloqueada enquanto o repositório estiver público.
- Nenhuma aplicação, dependência ou banco criado.

## Acesso rápido

- [Status completo do roadmap](roadmap/README.md)
- [Tarefa ativa](roadmap/ACTIVE.md)
- [Branches e ambientes](docs/decisions/BRANCHING-AND-ENVIRONMENTS.md)
- [Padrão de pull request](docs/delivery/PULL-REQUEST-STANDARD.md)
- [Governança de CI/CD](docs/decisions/CI-CD-GOVERNANCE.md)
- [Regras da migração](docs/migration/README.md)

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

Este projeto poderá armazenar dieta e contexto físico pessoal. Antes da migração desses dados, o repositório deve ser privado e não deve conter credenciais ou informações médicas desnecessárias.
