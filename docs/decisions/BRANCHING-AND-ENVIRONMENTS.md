# Branches e ambientes

## Status

- Data: 2026-08-30
- Decisão: aprovada
- Escopo: fluxo Git e associação futura com ambientes

## Decisão

| Branch | Papel | Ambiente esperado |
| --- | --- | --- |
| `developer` | Integração contínua das tarefas | Desenvolvimento e previews por branch/PR |
| `staging` | Candidata estável para homologação | Preview estável na Vercel |
| `master` | Código aprovado para publicação | Produção na Vercel |

Toda mudança parte de `developer` em uma branch curta e retorna por pull request. As promoções seguintes também ocorrem por pull request: `developer` para `staging` e `staging` para `master`.

## Limite atual

As branches estão criadas, mas não existe aplicação nem projeto Vercel configurado. Portanto, local, preview e produção são papéis planejados, não ambientes operacionais. A configuração e a verificação reais pertencem ao épico E08.

## Motivo

O fluxo separa integração, homologação e produção sem criar repositórios ou backends adicionais. Ele também permite validar cada promoção e manter `master` estável.

## Rollback

Uma promoção com problema deve ser revertida por novo commit ou pull request. Não reescrever histórico compartilhado nem usar force push como procedimento normal.
