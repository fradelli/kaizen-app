# Kaizen

Fonte de verdade versionada para regras, planos e evolução incremental de um aplicativo pessoal de treino, alimentação e rotina.

A fundação documental está concluída. Dados, regras, histórico, produto e arquitetura foram aprovados; a aplicação Next.js e o banco serão introduzidos incrementalmente pelo guia de implementação.

## Estado atual

- Repositório inicializado.
- Branches `developer`, `staging` e `master` publicadas.
- Roadmap documental criado e centralizado em `roadmap/README.md`.
- Repositório público por decisão do proprietário, com publicação controlada por allowlist no manifesto.
- Fundação de treino validada; dados, histórico, documentação e schemas possuem proveniência, integridade e exposição revisadas.
- Fundação alimentar validada; plano, ponteiro, schema, guia e relatório possuem proveniência e limites explícitos.
- Produto, arquitetura, privacidade, operação e sequência de implementação do P0 aprovados.
- E04-T01 está pronta para criar a aplicação Next.js.
- Nenhuma aplicação, dependência ou banco criado.

## Acesso rápido

- [Status completo do roadmap](roadmap/README.md)
- [Tarefa ativa](roadmap/ACTIVE.md)
- [Branches e ambientes](docs/decisions/BRANCHING-AND-ENVIRONMENTS.md)
- [Padrão de pull request](docs/delivery/PULL-REQUEST-STANDARD.md)
- [Governança de CI/CD](docs/decisions/CI-CD-GOVERNANCE.md)
- [Guia de implementação do P0](docs/implementation/P0-IMPLEMENTATION-GUIDE.md)
- [Política do repositório público](docs/decisions/PUBLIC-REPOSITORY-AND-DATA-POLICY.md)
- [Regras da migração](docs/migration/README.md)
- [Repositórios de origem](docs/migration/SOURCE-REPOSITORIES.md)
- [Manifesto de migração](docs/migration/MIGRATION-MANIFEST.md)
- [Relatório de validação do treino](docs/migration/TRAINING-VALIDATION-REPORT.md)
- [Guia de consulta do treino](docs/guides/TRAINING-GUIDE.md)
- [Resumo diário](docs/guides/DAILY-TRAINING-SUMMARY.md)
- [Como atualizar os dados](docs/guides/UPDATING-TRAINING-DATA.md)
- [Evidências e limites](docs/evidence/TRAINING-EVIDENCE-AND-LIMITS.md)
- [Schemas de treino](schemas/README.md)

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
