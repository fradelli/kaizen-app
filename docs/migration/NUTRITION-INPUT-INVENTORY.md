# Inventário de entradas alimentares

## Resultado

- Data da verificação: `2026-09-01`.
- Dieta prescrita disponível: `false`.
- Registro da alimentação praticada disponível: `false`.
- Artefatos alimentares autorizados para migração: `0`.
- Próxima tarefa: `E02-T02`, bloqueada até o fornecimento e a classificação de uma fonte original.

Este documento registra disponibilidade, proveniência e lacunas. Ele não é uma dieta, uma prescrição ou uma avaliação nutricional.

## Escopo verificado

| input_id | Entrada | Disponibilidade | Papel | Exposição atual | Evidência e tratamento |
| --- | --- | --- | --- | --- | --- |
| `nutrition-input-prescribed-diet` | Dieta prescrita original | `NOT_PROVIDED` | Fonte primária futura | `DO_NOT_PUBLISH` | Nenhum arquivo foi fornecido; não criar linha no manifesto antes de existir uma fonte verificável |
| `nutrition-input-practiced-food` | Alimentação efetivamente praticada | `NOT_PROVIDED` | Contexto futuro, separado da prescrição | `DO_NOT_PUBLISH` | Nenhum diário, relato ou registro foi fornecido |
| `nutrition-input-legacy-snapshot` | Snapshot privado usado em E01 | `INSPECTED_NO_ARTIFACT` | Evidência negativa | `DO_NOT_PUBLISH` | A árvore do commit registrado não contém caminho candidato por termos alimentares; não é uma fonte nutricional |
| `nutrition-input-legacy-worktree` | Worktree privado observado | `INSPECTED_NO_ARTIFACT` | Descoberta apenas, nunca fonte imutável | `DO_NOT_PUBLISH` | Nenhum caminho candidato foi localizado; qualquer entrada futura ainda exigirá snapshot remoto imutável |
| `nutrition-input-known-attachment` | Anexo textual conhecido | `CONTEXT_ONLY` | Contexto de arquitetura | `DO_NOT_PUBLISH` | Menciona dieta somente como escopo futuro e não contém um plano alimentar |
| `nutrition-context-profile` | `data/profile.json` | `AVAILABLE` | Contexto público sanitizado | `PUBLIC` | Pode orientar perguntas futuras; não prova necessidade, restrição ou prescrição alimentar |
| `nutrition-context-schedule` | `data/schedule.json` | `AVAILABLE` | Contexto público sanitizado | `PUBLIC` | Informa regras agregadas de carga; dias e horários pessoais permanecem nulos |
| `nutrition-context-active-training` | `data/active.json` e plano apontado | `AVAILABLE` | Contexto de carga de treino | `PUBLIC` | Identifica o plano de treino vigente; não contém fatos alimentares |

Os `input_id` acima pertencem somente a este inventário. Eles não autorizam migração e não substituem os `artifact_id` do manifesto.

## Separação epistemológica

### Fatos confirmados

- Não há dieta prescrita disponível nas entradas fornecidas.
- Não há registro da alimentação praticada.
- O snapshot privado registrado e o worktree observado não apresentam arquivo candidato por nome.
- Perfil, agenda e treino migrados estão disponíveis apenas como contexto sanitizado.
- Nenhum valor alimentar ou nutricional foi confirmado.

### Estimativas

Nenhuma estimativa foi produzida.

### Hipóteses

Nenhuma hipótese foi promovida a dado. A possível existência de uma dieta fora das fontes verificadas permanece desconhecida.

### Decisões profissionais

Nenhuma decisão de nutricionista ou outro profissional foi fornecida. Objetivos gerais do projeto não substituem uma fonte profissional identificável.

## Unknowns

- existência e localização da dieta original;
- formato do documento original;
- autoria e relação profissional da fonte;
- data de emissão, versão e vigência;
- direito de preservar ou publicar conteúdo de terceiro;
- refeições, itens, quantidades, unidades, alternativas e observações exatamente como recebidos;
- alimentação praticada e eventuais diferenças em relação ao original;
- decisão explícita de exposição por artefato;
- restrições ou orientações profissionais relevantes, que devem ser tratadas em canal privado e minimizadas antes de qualquer publicação.

Nenhum desses campos pode ser preenchido por inferência.

## Gate para E02-T02

`E02-T02` somente pode iniciar quando:

1. uma fonte alimentar original for fornecida por meio apropriado;
2. autoria, data e formato forem registrados quando conhecidos, mantendo ausências como `null`;
3. o direito de preservação e a exposição forem decididos por artefato;
4. a origem for fixada em commit remoto imutável ou outro mecanismo de proveniência aprovado;
5. uma linha correspondente puder ser criada no manifesto sem publicar o conteúdo antes da autorização.

O recebimento de um arquivo não autoriza sua inclusão no repositório público. A classificação continua `DO_NOT_PUBLISH` até decisão explícita; E02-T02 deverá decidir se o destino público recebe somente metadados auditáveis, uma transformação aprovada ou nenhuma cópia.

## Fora de escopo

- criar `data/nutrition/`;
- sugerir alimentos, quantidades, calorias ou macronutrientes;
- revisar segurança, adequação ou eficácia de uma dieta inexistente;
- criar plano vigente, schema, aplicação, banco, script ou workflow;
- registrar no manifesto um artefato que ainda não existe.
