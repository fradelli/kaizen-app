# E06 — Execução de treino

## Resultado esperado

Treino, preparação, mobilidade ou descanso do dia consultáveis e registráveis no workspace fixo, preservando plano e histórico.

## Ordem

| Tarefa  | Depende de | Resultado                                         |
| ------- | ---------- | ------------------------------------------------- |
| E06-T01 | E05-T05    | Projeção do plano e da execução do workspace fixo |
| E06-T02 | E06-T01    | Página de treino do dia                           |
| E06-T03 | E06-T02    | Preparação, séries e comentários                  |
| E06-T04 | E06-T03    | Cancelada; proveniência absorvida por E06-T05     |
| E06-T05 | E06-T07    | Proveniência mínima e fluxo final validados       |
| E06-T06 | E06-T03    | Carga alvo por exercício ou por série             |
| E06-T07 | E06-T24    | Última execução por série como referência         |
| E06-T08 | E06-T03    | Cancelada; validações absorvidas por E06-T24       |
| E06-T09 | E06-T03    | UX do contador de descanso aprovada               |
| E06-T10 | E06-T09    | Contador de descanso não modal                    |
| E06-T11 | E06-T03    | Ciclo de vida do plano diário decidido            |
| E06-T12 | E06-T11    | Edição diária refinada conforme lacunas           |
| E06-T13 | E06-T11    | Futuro reconciliado após troca de plano           |
| E06-T14 | E04-T04    | Navegação principal inferior no mobile            |
| E06-T15 | E06-T11    | Programação semanal sem esporte fixo              |
| E06-T16 | E06-T15         | Novo plano e aquecimentos validados      |
| E06-T17 | E06-T11    | Reinício operacional controlado e recuperável     |
| E06-T18 | E06-T16    | Cancelada; blocos absorvidos por E06-T24           |
| E06-T19 | E06-T12    | Fim planejado calculado pela duração da sessão    |
| E06-T20 | E06-T12    | Cancelada; regra absorvida por E06-T23             |
| E06-T21 | E06-T16    | Contrato de importação externa projetado          |
| E06-T22 | E06-T12    | Agenda futura editável sem execução antecipada    |
| E06-T23 | E06-T22    | Execução guiada separada do registro retrospectivo |
| E06-T24 | E06-T23    | Séries livres, estados parciais e blocos legíveis |

As tarefas E06-T06 a E06-T24 são uma rodada complementar. Nenhuma
começa automaticamente nem amplia o gate de E06-T05 sem nova priorização. Ao
selecionar qualquer uma, reanalisar a base já integrada, apresentar solução e
plano e aguardar aprovação antes de implementar.

## Caminho crítico para encerrar Treino e iniciar Dieta

Prioridade atual: integrar a E06-T22 pela PR #56 e executar **E06-T23 → E06-T24
→ E06-T07 → E06-T05**. Concluída a E06-T05, a próxima tarefa passa a ser E07-T01,
iniciando a tela de dieta. O limite futuro de quatro dias não é ampliado.

1. E06-T11 decide as regras do dia antes de ampliar a agenda.
2. Após a revisão das alterações do roadmap pelo usuário, E06-T17 só reinicia
   dados após escolha do ambiente, escopo, backup e autorização específica.
   O reinício local autorizado foi concluído com backup restaurável.
3. E06-T15 generaliza a semana; após receber o novo treino, E06-T16 o importa,
   sessões reserva ficam fora da versão atual até aprovação específica.
4. E06-T23 corrige a semântica das atividades externas e absorve E06-T20.
   E06-T24 remove o avanço sequencial, cria o estado parcial e absorve E06-T08 e
   E06-T18. E06-T07 adiciona a última execução sobre essa interface estável.
5. E06-T13 pode ser reavaliada caso o reinício controlado elimine a necessidade
   imediata de reconciliar atividades futuras antigas; não está cancelada.
6. E06-T21 começa após a importação manual validada da nova programação. Primeiro
   estabiliza o contrato JSON e a prévia; Excel reutiliza esse contrato em etapa
   posterior, sem criar outro caminho de persistência.
7. E06-T06, E06-T09, E06-T10, E06-T13, E06-T19 e E06-T21 não bloqueiam a tela de
   dieta. Permanecem melhorias posteriores, priorizadas por uso real.

O novo plano contém blocos combinados: E06-T16 preserva sua estrutura. A E06-T24
mantém os membros A/B agrupados na edição livre, sem criar um fluxo guiado
separado. A E06-T05 absorve a proveniência mínima da E06-T04 e encerra o épico.

## Fora de escopo

- Edição livre dos planos canônicos pelo aplicativo antes da E06-T21.
- Recomendação automática baseada em dor, fadiga ou diagnóstico.

## Critérios de encerramento

- [ ] O usuário encontra o treino correto para o dia.
- [ ] Carga aparece somente quando aplicável e séries podem ser salvas parcialmente.
- [ ] Mobilidade e descanso não criam exercícios artificiais.
- [ ] Dados ausentes são apresentados sem inferências.
- [ ] Origem e versão do plano são rastreáveis.
