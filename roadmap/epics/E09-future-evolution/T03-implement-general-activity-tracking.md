---
id: E09-T03
epic: E09
depends_on: [E09-T01]
---

# Implementar registro de atividades gerais

## Objetivo

Permitir registrar e consultar atividades gerais conforme o contrato aprovado na
E09-T01, sem duplicar sessões pertencentes ao domínio de treino.

## Entradas

- `roadmap/epics/E09-future-evolution/T01-design-sleep-and-general-activities.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `prisma/models/platform.prisma`
- `src/lib/security/workspace.ts`

## Entregáveis

- Persistência e casos de uso protegidos pelo workspace fixo.
- Tela acessível e responsiva para os tipos de atividade aprovados.
- Regras explícitas para data, duração, observações e possível sobreposição.
- Testes de domínio, integração PostgreSQL, componentes e fluxo crítico.

## Subtarefas

- [ ] Detalhar a tarefa com os contratos aprovados antes de torná-la `READY`.
- [ ] Atualizar dependências e implementar autenticação antes desta tarefa se a
      E09-T01 classificar os dados como sensíveis.
- [ ] Impedir duplicação conceitual com treino, mobilidade e descanso.
- [ ] Validar origem, entrada, ownership e concorrência no servidor.
- [ ] Preservar valores ausentes sem defaults inventados.

## Validações

- Testar limites entre domínios, ownership, constraints, acessibilidade e build.

## Critérios de aceite

- [ ] O usuário registra uma atividade aprovada sem alterar treino ou alimentação.

## Fora de escopo

- Agenda composta, notificações ou integração não aprovada na E09-T01.

## Resultado

Ainda não concluída.
