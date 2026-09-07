---
id: E08-T02
epic: E08
depends_on: [E08-T01, E05-T06]
---

# Validar e reforçar proteção

## Objetivo

Comprovar e endurecer no preview a sessão, autorização e proteção implementadas antes das features operacionais.

## Entradas

- `docs/implementation/E08.md`
- `docs/decisions/PRIVACY-AND-OPERATIONS.md`
- `src/lib/security/`
- `src/app/ativar/`
- `next.config.ts`
- Ambiente de preview publicado em E08-T01.

## Entregáveis

- Proteção validada em HTTPS e configuração endurecida para produção.

## Subtarefas

- [ ] Configurar segredos exclusivos de preview sem expor valores.
- [ ] Confirmar cookie `__Host-`, expiração, rotação e invalidação em HTTPS.
- [ ] Testar leitura e mutação anônimas em todas as rotas sensíveis.
- [ ] Verificar cache privado, indexação, headers, logs e erros.
- [ ] Validar limite de tentativas no ambiente publicado.

## Validações

- Reexecutar os testes de acesso de E05-T06 contra a URL de preview.

## Critérios de aceite

- [ ] Dados pessoais não são acessíveis sem autorização, o conteúdo público continua legível e a proteção funciona em HTTPS real.

## Resultado

Ainda não concluída.
