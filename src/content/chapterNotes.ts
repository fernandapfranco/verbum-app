import type { Reviewable } from './types';

/** Nota curta "antes de ler" para um capítulo específico. */
export interface ChapterNote extends Reviewable {
  bookId: string;
  chapter: number;
  texto: string;
}

const n = (bookId: string, chapter: number, texto: string, fontes: string[] = []): ChapterNote => ({
  bookId,
  chapter,
  texto,
  fontes,
  status: 'rascunho',
});

export const CHAPTER_NOTES: readonly ChapterNote[] = [
  // Evangelho segundo Marcos
  n('marcos', 1, 'Marcos não perde tempo: em poucas linhas aparecem João Batista, o batismo de Jesus, o deserto e os primeiros discípulos. Repare como Jesus chama pessoas comuns, no meio do trabalho delas — e elas deixam tudo para segui-lo.'),
  n('marcos', 2, 'Jesus perdoa pecados, come com pecadores e diz que veio "chamar os pecadores". Os religiosos se escandalizam. Pergunte-se: com quem Jesus faria questão de sentar à mesa hoje?'),
  n('marcos', 3, 'Cresce a oposição a Jesus, e ele escolhe os Doze apóstolos. No fim, uma frase bonita: quem faz a vontade de Deus é da família de Jesus.'),
  n('marcos', 4, 'Capítulo das parábolas: a semente, o grão de mostarda. Depois, a tempestade acalmada. A pergunta de Jesus aos discípulos com medo também é para nós: "Ainda não tendes fé?"'),
  n('marcos', 5, 'Três encontros com Jesus: um homem atormentado, uma mulher doente há doze anos e uma menina que morreu. Nenhuma situação está perdida para ele.'),
  n('marcos', 6, 'Jesus é rejeitado em sua terra, envia os Doze em missão e alimenta uma multidão com cinco pães. Também é narrada a morte de João Batista.'),
  n('marcos', 7, 'Jesus mostra que o que torna alguém "impuro" não é a comida, mas o que sai do coração. E se deixa tocar pela fé de uma mulher estrangeira.'),
  n('marcos', 8, 'Ponto de virada do Evangelho: Pedro reconhece que Jesus é o Cristo. E Jesus anuncia que vai sofrer, morrer e ressuscitar — e que segui-lo é carregar a cruz.'),
  n('marcos', 9, 'A Transfiguração: por um instante, os discípulos veem a glória de Jesus. Depois, ele ensina que o maior é aquele que serve.'),
  n('marcos', 10, 'Jesus abençoa as crianças, conversa com um jovem rico que se afasta triste e cura o cego Bartimeu, que passa a segui-lo pelo caminho.'),
  n('marcos', 11, 'Começa a última semana: Jesus entra em Jerusalém aclamado e purifica o Templo. Fala também da força da oração feita com fé.'),
  n('marcos', 12, 'Discussões no Templo. No meio delas, o resumo de tudo: amar a Deus com todo o coração e o próximo como a si mesmo. E o elogio à viúva pobre.'),
  n('marcos', 13, 'Discurso sobre o fim dos tempos, com imagens fortes. A mensagem principal é simples: não tenham medo e estejam vigilantes.'),
  n('marcos', 14, 'Uma mulher unge Jesus, a Última Ceia (onde Jesus institui a Eucaristia), a oração no Getsêmani, a prisão e as negações de Pedro. Leia com calma.', ['CIC 1337–1340']),
  n('marcos', 15, 'A Paixão e a morte de Jesus na cruz. É um texto para ler em silêncio. Note quem reconhece Jesus como Filho de Deus: um soldado romano.'),
  n('marcos', 16, 'O túmulo vazio: Jesus ressuscitou! As mulheres são as primeiras a receber a notícia. E os discípulos são enviados a anunciar o Evangelho a toda criatura.'),
  // Trechos das trilhas
  n('lucas', 15, 'Três parábolas da misericórdia: a ovelha perdida, a moeda perdida e o filho que volta para casa. Em todas, quem procura e faz festa é Deus. Se você está voltando, este capítulo é para você.', ['CIC 1439', 'CIC 545–546']),
  n('lucas', 19, 'Zaqueu era chefe dos cobradores de impostos, rico e malvisto. Curioso, sobe numa árvore para ver Jesus — e é Jesus quem o chama pelo nome.'),
  n('joao', 21, 'Depois da ressurreição, Jesus encontra Pedro, que o havia negado três vezes. Em vez de cobrança, três perguntas: "Tu me amas?". O amor recomeça a história.', ['CIC 553', 'CIC 881']),
  n('salmos', 22, 'Na numeração moderna, este é o Salmo 23: "O Senhor é meu pastor". Uma oração de confiança para rezar devagar, frase por frase.'),
  n('salmos', 50, 'Na numeração moderna, Salmo 51. É o "Miserere", a oração de Davi pedindo perdão depois de pecar gravemente. A Igreja reza este salmo há séculos.', ['CIC 1430–1431']),
  n('salmos', 102, 'Na numeração moderna, Salmo 103. Um hino à bondade de Deus, que "perdoa todas as tuas maldades" e "não nos trata segundo os nossos pecados".'),
];

export function getChapterNote(bookId: string, chapter: number): ChapterNote | undefined {
  return CHAPTER_NOTES.find((x) => x.bookId === bookId && x.chapter === chapter);
}
