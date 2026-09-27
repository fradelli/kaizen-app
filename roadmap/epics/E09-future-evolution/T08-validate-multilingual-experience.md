---
id: E09-T08
epic: E09
depends_on: [E09-T06, E09-T07]
---

# Validar experiência multilíngue

## Objetivo

Comprovar que produto, conteúdo e operação do repositório funcionam em inglês e
nos locales adicionais aprovados, com fallback seguro e sem perda histórica.

## Entradas

- `roadmap/epics/E09-future-evolution/T06-internationalize-product-content.md`
- `roadmap/epics/E09-future-evolution/T07-migrate-documentation-to-english.md`
- `docs/architecture/TARGET-ARCHITECTURE.md`
- `.github/workflows/ci.yml`
- `package.json`
- `scripts/validate-data.mjs`

## Entregáveis

- Matriz automatizada de locales e fallbacks suportados.
- Validação manual das quatro jornadas em mobile e desktop.
- Evidência de integridade, acessibilidade, SEO/noindex, rotas e persistência do locale.
- Runbook para adicionar e revisar um novo idioma.

## Subtarefas

- [ ] Testar locale válido, ausente, desconhecido e catálogo incompleto.
- [ ] Testar treino, alimentação, sono e atividades gerais em cada locale suportado.
- [ ] Confirmar formatação de data, número, unidade e conteúdo versionado.
- [ ] Confirmar que a CI bloqueia regressões de idioma sem bloquear IDs preservados.
- [ ] Revisar bundle, renderização server-side e limites Client.

## Validações

- Executar gates completos, matriz E2E por locale e auditoria manual de conteúdo.

## Critérios de aceite

- [ ] Inglês é completo e funciona como fallback determinístico.
- [ ] Cada locale declarado cobre as quatro jornadas sem chaves ou textos indevidos.
- [ ] O processo de adicionar idioma é documentado e reproduzível.

## Fora de escopo

- Publicar locale sem revisão humana do conteúdo de treino ou alimentação.

## Resultado

Ainda não concluída.
