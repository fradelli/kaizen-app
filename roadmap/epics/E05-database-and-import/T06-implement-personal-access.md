---
id: E05-T06
epic: E05
depends_on: [E05-T05]
---

# Implementar acesso pessoal

## Objetivo

Criar sessão, autorização e pareamento antes de qualquer leitura ou mutação operacional de treino e alimentação.

## Entradas

- `docs/implementation/E05.md`
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `src/lib/security/workspace.ts`
- `prisma/schema.prisma`

## Entregáveis

- Sessão autenticada server-only.
- Pareamento por chave de alta entropia.
- Autorização e resolução de workspace reutilizáveis.
- Validação de origem e limite de tentativas.
- Testes de sucesso, ausência, expiração, rotação e fraude.

## Subtarefas

- [ ] Implementar cookie seguro e sessão assinada.
- [ ] Derivar ator e workspace exclusivamente no servidor.
- [ ] Implementar pareamento sem registrar chave ou hash.
- [ ] Validar origem em mutações e limitar tentativas.
- [ ] Impedir importação das fronteiras server-only pelo cliente.

## Validações

- Testar sessão ausente, inválida, expirada e rotacionada.
- Testar origem inválida e `workspace_id` fornecido pelo cliente.
- Confirmar ausência de segredo, cookie ou payload em logs.

## Critérios de aceite

- [ ] E06 e E07 recebem uma API de autorização testada e não precisam criar segurança ad hoc.
- [ ] Conteúdo público permanece acessível sem expor dado operacional.

## Resultado

Ainda não concluída.
