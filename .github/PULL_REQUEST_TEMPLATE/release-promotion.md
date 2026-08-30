<!--
Títulos obrigatórios:
- [E00-T01] chore(release): promover developer para staging
- [E00-T01] chore(release): promover staging para master
Substitua todos os valores SUBSTITUIR_ANTES_DA_PR.
-->

## Resumo

Promove a versão aprovada de `SUBSTITUIR_ANTES_DA_PR_ORIGEM` para `SUBSTITUIR_ANTES_DA_PR_DESTINO`.

## Problema

O próximo ambiente deve receber um intervalo imutável de commits somente após a validação completa da origem.

## Causa raiz

A branch de origem contém a versão aprovada que ainda não existe no ambiente de destino.

## Alterações

- Tipo da release: `SUBSTITUIR_ANTES_DA_PR`
- Caminho da promoção: `SUBSTITUIR_ANTES_DA_PR`
- Commit de origem: `SUBSTITUIR_ANTES_DA_PR_SHA_COMPLETO`
- Ambiente de destino: `SUBSTITUIR_ANTES_DA_PR`
- Tarefas incluídas: `SUBSTITUIR_ANTES_DA_PR`

## Arquivos adicionados ou atualizados

- Intervalo comparado: `SUBSTITUIR_ANTES_DA_PR`
- Nenhum arquivo é alterado exclusivamente pela promoção; o estado exato da origem é promovido.

## Impacto

### Corrigido

- Entrega o commit aprovado ao próximo ambiente.
- Preserva a ordem `developer -> staging -> master`.

### Não alterado

- Não existe commit direto na branch de destino.
- O deploy só inicia depois do merge e do CI pós-merge.

## Validação

- [ ] governança (`Governance`)
- [ ] qualidade (`Quality`)
- [ ] testes (`Test`)
- [ ] integridade dos dados (`Data integrity`)
- [ ] build (`Build`)
- [ ] auditoria de dependências (`Dependency audit`)
- [ ] validação manual concluída

## Observações

- Tarefa principal: `E00-T01`
- Tarefas relacionadas: `SUBSTITUIR_ANTES_DA_PR_OU_NENHUMA`
- Rollback: `SUBSTITUIR_ANTES_DA_PR`
- Deployment de preview: `SUBSTITUIR_ANTES_DA_PR_OU_NAO_APLICAVEL`
- Evidência do preview: `SUBSTITUIR_ANTES_DA_PR_OU_NAO_APLICAVEL`
- Método de merge: merge commit; nunca squash em promoção
- Limitações ou checks não aplicáveis: `SUBSTITUIR_ANTES_DA_PR_OU_NENHUMA`
- Limpeza da branch após merge: não aplicável às branches protegidas
