---
id: E04-T05
epic: E04
depends_on: [E04-T02, E04-T03, E04-T04]
---

# Configurar CI mínimo

## Objetivo

Implementar os gates estáveis aprovados na governança de CI para pull requests e promoções.

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

## Resultado

Ainda não concluída.
