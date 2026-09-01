# Guia de consulta do treino

Este guia é uma projeção humana compacta. A prescrição canônica está no arquivo indicado por [`data/active.json`](../../data/active.json); doses e exercícios devem ser lidos no plano, não copiados deste documento.

## Objetivos

- Melhorar desempenho no futevôlei e potência de salto.
- Desenvolver força, aterrissagem e estabilidade.
- Controlar o volume adicional de saltos considerando a carga esportiva.
- Manter ganho estético como objetivo secundário.

## Como consultar

1. Abra [`data/active.json`](../../data/active.json).
2. Siga `active_plan_path` e confirme que `active_plan_id` coincide com `plan_id`.
3. Escolha a sessão usando a agenda privada e as regras públicas de [`data/schedule.json`](../../data/schedule.json).
4. Consulte descrições, execução e riscos pelo `exercise_id` em [`data/exercises.json`](../../data/exercises.json).
5. Use o [resumo diário](DAILY-TRAINING-SUMMARY.md) somente como navegação rápida.

## Sessões do plano ativo

| ID | Finalidade | Uso |
| --- | --- | --- |
| `lower_a` | Força de inferiores e potência vertical | Sessão principal, executada quando houver recuperação suficiente |
| `upper_a` | Força de puxada e empurrada | Sessão de superiores com versão curta |
| `lower_b` | Unilateral, adutores e estabilidade | Volume moderado e baixa fadiga relativa |
| `lower_b_microdose` | Estímulo neural de baixo volume | Alternativa próxima ao jogo quando prevista pelo plano |
| `upper_b` | Hipertrofia, ombros e controle cervical | Sessão de superiores com versão curta |
| `pre_upper_warmup` | Aquecimento de superiores | Progressivo e não fatigante |
| `pre_lower_warmup` | Aquecimento de inferiores | Prepara mobilidade, aterrissagem e saltos |
| `pre_footvolley_warmup` | Aquecimento do futevôlei | Progressão específica sem duplicar aquecimento equivalente |

## Distribuição sem agenda pública

- Contabilize cada treino de areia e jogo como carga.
- Posicione força e potência de inferiores quando houver recuperação suficiente.
- Evite sessão completa de inferiores imediatamente antes da areia.
- Superiores podem ocorrer depois da areia quando a recuperação não for prejudicada.
- Use a microdose somente quando o plano e a proximidade do jogo justificarem.
- Dias e horários exatos permanecem fora deste repositório.

## Regras de execução

- Preserve as repetições em reserva definidas no plano.
- Interrompa saltos quando altura, velocidade, coordenação ou aterrissagem piorarem claramente.
- Não aumente carga, séries e dificuldade na mesma semana.
- Use as versões curtas em vez de comprimir descanso ou acumular complementares.
- Aquecimento termina com prontidão, não fadiga.
- Mobilidade prolongada fica depois do treino ou em sessão separada.

## Segurança

Adapte ou interrompa a sessão diante de dor aguda, piora progressiva, perda de controle ou sinal neurológico. Dor persistente, trauma, retorno pós-cirúrgico ou sintomas neurológicos exigem avaliação profissional presencial. Consulte [Evidências e limites](../evidence/TRAINING-EVIDENCE-AND-LIMITS.md).
