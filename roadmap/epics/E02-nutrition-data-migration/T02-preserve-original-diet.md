---
id: E02-T02
epic: E02
depends_on: [E02-T01]
---

# Preservar dieta original

## Objetivo

Registrar a fonte alimentar original sem corrigir, completar ou promovê-la a plano vigente.

## Entradas

- Inventário corrigido de E02-T01.
- Commit privado `138531e4fbca6d744de73274fbb96da39c02bad3`.

## Entregáveis

- Snapshot e tag imutáveis no repositório privado.
- Blobs originais preservados somente na origem privada.
- Linhas de manifesto com referências seguras, hashes, tratamento e exposição.

## Subtarefas

- [ ] Criar snapshot privado sem reescrever os caminhos históricos.
- [ ] Usar nomes neutros em cópias privadas byte a byte quando necessário para a proveniência pública.
- [ ] Calcular integridade diretamente dos blobs do snapshot.
- [ ] Criar a tag privada `kaizen-nutrition-source-v1`.
- [ ] Registrar originais como `SKIP/DO_NOT_PUBLISH` no destino público.
- [ ] Marcar planos derivados como não vigentes até revisão.

## Validações

- Cópias privadas literais mantêm os hashes dos blobs históricos.
- A tag e o commit existem no remote privado.
- Nenhum conteúdo alimentar ou caminho pessoal entra no repositório público.
- Nenhuma recomendação é adicionada ao original.

## Critérios de aceite

- [ ] A revisão pode voltar à fonte exata por referência privada imutável.
- [ ] O destino público contém somente proveniência segura.

## Resultado

Ainda não concluída.
