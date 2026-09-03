---
id: E05-T04
epic: E05
depends_on: [E05-T03]
---

# Testar integridade persistida

## Objetivo

Provar joins, constraints, versão ativa e proveniência contra banco real de teste.

## Entradas

- `docs/implementation/E05.md`
- `docs/architecture/DATA-MODEL.md`
- `prisma/schema.prisma`
- `prisma/migrations/`
- `src/features/import/`
- `tests/integration/import-canonical-data.test.ts`

## Entregáveis

- Testes de integração e relatório de paridade.

## Subtarefas

- [ ] Testar plano ativo e referências.
- [ ] Testar duplicação e ausência de pai.
- [ ] Comparar contagens e campos relevantes.
- [ ] Testar rollback da importação.

## Validações

- Testes rodam em ambiente descartável e falham para dados inválidos.

## Critérios de aceite

- [ ] Banco preserva as invariantes do repositório.

## Resultado

Ainda não concluída.
