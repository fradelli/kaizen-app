---
id: E03-T03
epic: E03
depends_on: [E03-T01]
---

# Definir privacidade e operação

## Objetivo

Decidir acesso, hospedagem, ambientes, segredos, backup, restore e perda aceitável de dados.

## Entradas

- Jornada do P0.
- Decisão de branches e ambientes.

## Entregáveis

- `docs/decisions/PRIVACY-AND-OPERATIONS.md`

## Subtarefas

- [ ] Definir proteção da produção.
- [ ] Definir Vercel e provedor de banco candidatos.
- [ ] Definir ambientes e variáveis sensíveis.
- [ ] Definir backup, retenção e teste de restore.

## Validações

- Dados pessoais não ficam acessíveis sem decisão explícita.

## Critérios de aceite

- [ ] E08 possui requisitos operacionais verificáveis.

## Resultado

Definida publicação em URL pública da Vercel sem cadastro, com conteúdo canônico público separado dos dados operacionais privados. Pareamento por chave de edição, cookie seguro, autorização server-side, ambientes isolados, Neon PostgreSQL, segredos, RPO de 24 horas, RTO de 4 horas, backup externo cifrado, restore e evolução para contas foram documentados em `docs/decisions/PRIVACY-AND-OPERATIONS.md`.
