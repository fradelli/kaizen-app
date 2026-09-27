---
id: E09-T02
epic: E09
depends_on: [E09-T01]
---

# Implementar controle de sono

## Objetivo

Permitir registrar e consultar sono conforme o contrato aprovado na E09-T01,
sem produzir diagnóstico ou recomendação médica.

## Entradas

- `roadmap/epics/E09-future-evolution/T01-design-sleep-and-general-activities.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `prisma/models/platform.prisma`
- `src/lib/security/workspace.ts`

## Entregáveis

- Persistência versionada e protegida pelo workspace fixo.
- Leitura e registro server-side com validação de entrada e concorrência.
- Tela acessível e responsiva para consulta e edição dos dados aprovados.
- Testes de domínio, integração PostgreSQL, componentes e fluxo crítico.

## Subtarefas

- [ ] Detalhar a tarefa com os contratos aprovados antes de torná-la `READY`.
- [ ] Atualizar dependências e implementar autenticação antes desta tarefa se a
      E09-T01 classificar os dados como sensíveis.
- [ ] Preservar datas civis em `America/Sao_Paulo` e timestamps em UTC.
- [ ] Tratar ausência, edição, conflito e falha sem inventar métricas.
- [ ] Manter componentes em pastas próprias e o menor limite Client.

## Validações

- Testar ownership, constraints, timezone, concorrência, acessibilidade e build.

## Critérios de aceite

- [ ] O usuário registra e consulta sono sem que o aplicativo faça inferência clínica.

## Fora de escopo

- Recomendações médicas, detecção de distúrbios ou integração não aprovada na E09-T01.

## Resultado

Ainda não concluída.
