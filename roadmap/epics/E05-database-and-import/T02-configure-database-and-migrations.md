---
id: E05-T02
epic: E05
depends_on: [E04-T03, E05-T01]
---

# Configurar banco e migrations

## Objetivo

Configurar o banco e o ORM aprovados com migrations reproduzíveis.

## Entradas

- `docs/implementation/E05.md`
- `docs/architecture/DATA-MODEL.md`
- `docs/decisions/DATABASE-AND-ORM.md`
- `data/training-execution-metadata.json`
- `.env.example`

## Entregáveis

- Configuração, schema e migration inicial definidos no guia.

## Subtarefas

- [ ] Isolar URLs por ambiente.
- [ ] Versionar migration inicial.
- [ ] Impedir acesso do cliente ao banco.
- [ ] Definir processo de deploy e rollback.

## Validações

- Banco vazio converge pela migration.
- Segredos não entram no Git ou bundle.

## Critérios de aceite

- [ ] Local e teste usam configuração reproduzível.

## Resultado

Ainda não concluída.
