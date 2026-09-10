---
id: E04-T05
epic: E04
depends_on: [E04-T02, E04-T03, E04-T06]
---

# Configurar CI mínimo

## Objetivo

Implementar os gates estáveis aprovados na governança de CI para pull requests e promoções.

## Contexto

O CI deve proteger a validação de prontidão e a integração do Design System antes do shell. E04-T08 complementará o workflow com acesso mínimo ao package privado já publicado.

## Entradas

- `docs/implementation/tasks/E04-T05.md`
- `docs/decisions/CI-CD-GOVERNANCE.md`
- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/release-promotion.md`
- `package.json`

## Entregáveis

- Workflow reutilizável de PR.
- Validação mecânica de branches, títulos, descrições e direção.
- Rulesets das branches protegidas.

## Fora do escopo

- Configurar credencial ou acesso ao GitHub Packages antes de E04-T08.
- Instalar `@fradelli/ui`, Tailwind ou fontes.

## Subtarefas

- [ ] Executar instalação reproduzível.
- [ ] Criar jobs estáveis `Governance`, `Quality`, `Test`, `Data integrity`, `Build` e `Dependency audit`.
- [ ] Executar lint, tipos, formato, testes, validações documentais, build e audit `moderate`.
- [ ] Validar ID da tarefa, template e matriz `developer -> staging -> master`.
- [ ] Configurar rulesets sem permitir push direto.
- [ ] Configurar cache somente se trouxer benefício medido.

## Validações

- Workflow passa e falha deliberadamente em regressão controlada.

## Critérios de aceite

- [ ] As três branches protegidas recebem apenas mudanças que passam nos gates aplicáveis.

## Riscos

- Workflow local e remoto executarem matrizes diferentes.
- Antecipar autenticação de package sem consumidor real.

## Rollback

Reverter o workflow defeituoso sem remover ou relaxar os gates locais.

## Resultado

Ainda não concluída.
