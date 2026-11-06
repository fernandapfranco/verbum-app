# Processo de revisão doutrinal

Todo conteúdo explicativo do Verbum (introduções dos livros, notas de capítulo,
glossário, trilhas, explicações das orações e, nas próximas fases, quizzes,
santos do dia e textos litúrgicos) precisa estar de acordo com o **Catecismo da
Igreja Católica (CIC)** e ser revisado por alguém qualificado (padre, diácono,
teólogo ou catequista com formação) antes da publicação nas lojas.

O texto bíblico em si **não** passa por esta revisão (é uma tradução histórica,
corrigida só quanto a erros de digitalização — ver `docs/texto-biblico.md`).

## Status de cada item
Cada item em `src/content/*.ts` tem:

| Campo | Valores |
|---|---|
| `status` | `rascunho` → `em-revisao` → `aprovado` |
| `fontes` | parágrafos do CIC, documentos (Dei Verbum, Verbum Domini…), passagens |

Enquanto não estiver `aprovado`, o app mostra a etiqueta **"em revisão"**.
Antes de publicar nas lojas: ou tudo aprovado, ou esconder o que não foi.

## Passo a passo
1. **Gerar a planilha**: `npm run content:review-sheet` →
   `content/revisao-doutrinal/planilha.csv` (abre no Excel ou Google Planilhas).
2. **Enviar ao revisor** e marcar os itens enviados como `em-revisao`.
3. O revisor preenche, para cada linha:
   - `parecer`: **aprovado**, **ajustar** ou **reprovar**
   - `comentario`: o que mudar e por quê (com referência ao CIC, se possível)
4. **Aplicar**: corrigir os textos em `src/content/`, mudar `status` para
   `aprovado` nos aprovados e reenviar os ajustados.
5. Registrar no fim deste arquivo quem revisou e quando.

## Critérios para o revisor
- Está de acordo com o CIC e o Magistério? Não apresenta opinião teológica
  discutível como se fosse doutrina?
- Afirmações sobre autoria e datas dos livros estão prudentes ("a tradição
  atribui…") e de acordo com a Dei Verbum?
- A linguagem é simples, acolhedora e sem "igrejês", mas sem perder precisão?
- Nada soa como culpa, ameaça ou julgamento?
- Explicações sacramentais (Confissão, Eucaristia) estão corretas e pastoralmente
  cuidadosas?

## Pontos que merecem atenção especial nesta fase
- Lição "O abraço da Confissão" (sigilo, passo a passo, ato de contrição).
- Lição "De volta à mesa" (condições para comungar, comunhão espiritual).
- Glossário: Messias/Cristo, Penitência/Conversão, Satanás, Anjo, Reino de Deus.
- Introduções de livros com questões de autoria (Pentateuco, Isaías, cartas
  "tradicionalmente atribuídas" a São Paulo, Hebreus, 2 Pedro).
- Versões das orações (Pai-Nosso, Glória, Credo nas próximas fases): conferir
  com o uso atual da CNBB.

## Ferramentas de apoio
Ferramentas como o Magisterium AI podem ajudar a localizar parágrafos do CIC e
documentos, mas **não substituem** o revisor humano.

## Histórico de revisões
| Data | Revisor | Itens | Observações |
|---|---|---|---|
| — | — | — | aguardando revisor |
