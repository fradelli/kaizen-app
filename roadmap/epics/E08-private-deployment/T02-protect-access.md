---
id: E08-T02
epic: E08
depends_on: [E08-T01]
---

# Proteger mutações e dados pessoais

## Objetivo

Manter leitura pública somente para conteúdo aprovado e impedir leitura ou alteração não autorizada dos dados pessoais no preview e na produção.

## Entradas

- Estratégia de privacidade aprovada e preview publicado.

## Entregáveis

- Controle de acesso implementado e testado.

## Subtarefas

- [ ] Implementar pareamento do dispositivo e sessão de proprietário aprovados no E03.
- [ ] Proteger rotas, dados e recursos derivados.
- [ ] Evitar indexação e vazamento em logs ou erros.
- [ ] Testar sessão ausente, inválida, expirada e rotacionada.

## Validações

- Tentar leitura e mutação anônimas em todas as rotas sensíveis.

## Critérios de aceite

- [ ] Dados pessoais não são acessíveis sem autorização e o conteúdo público continua legível.

## Resultado

Ainda não concluída.
