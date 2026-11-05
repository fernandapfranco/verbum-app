import type { MysterySet } from '@/lib/rosary';

import type { PassageRef, Reviewable } from './types';

/** Os 20 mistérios do Rosário, com a passagem bíblica e uma meditação curta (rascunho). */
export interface Mystery {
  titulo: string;
  ref: PassageRef;
  /** Citação curta para exibir ("Lc 1,26-38"). */
  citacao: string;
  meditacao: string;
  /** "Fruto" tradicional do mistério: a graça que pedimos. */
  fruto: string;
}

const m = (titulo: string, citacao: string, ref: PassageRef, meditacao: string, fruto: string): Mystery => ({
  titulo,
  citacao,
  ref,
  meditacao,
  fruto,
});

export const MYSTERIES: Record<MysterySet, Mystery[]> & Reviewable = {
  status: 'rascunho',
  fontes: ['Rosarium Virginis Mariae 19–21, 38', 'CIC 971', 'CIC 2708'],
  gozosos: [
    m('A Anunciação do anjo a Maria', 'Lc 1,26-38', { bookId: 'lucas', chapter: 1, from: 26, to: 38 }, 'Maria escuta o anjo, pergunta, e diz sim. Deus pede licença para entrar na nossa história.', 'Humildade'),
    m('A visita de Maria a Isabel', 'Lc 1,39-56', { bookId: 'lucas', chapter: 1, from: 39, to: 56 }, 'Grávida, Maria sai às pressas para ajudar a prima. Quem leva Jesus vai ao encontro dos outros.', 'Caridade com o próximo'),
    m('O nascimento de Jesus em Belém', 'Lc 2,1-14', { bookId: 'lucas', chapter: 2, from: 1, to: 14 }, 'Deus nasce pobre, numa manjedoura. Não há lugar pequeno demais para ele.', 'Desapego e simplicidade'),
    m('A apresentação de Jesus no Templo', 'Lc 2,22-38', { bookId: 'lucas', chapter: 2, from: 22, to: 38 }, 'Maria e José oferecem o menino a Deus. Simeão e Ana, que esperaram a vida toda, reconhecem o Salvador.', 'Obediência e pureza'),
    m('Jesus encontrado no Templo', 'Lc 2,41-52', { bookId: 'lucas', chapter: 2, from: 41, to: 52 }, 'Depois de três dias de angústia, Maria e José encontram Jesus na casa do Pai. Quando perdemos Jesus, vale procurá-lo até achar.', 'Buscar a Deus em tudo'),
  ],
  luminosos: [
    m('O batismo de Jesus no Jordão', 'Mt 3,13-17', { bookId: 'mateus', chapter: 3, from: 13, to: 17 }, 'O Pai diz: "Este é o meu Filho amado". No nosso Batismo, Deus disse o mesmo de nós.', 'Viver como filhos de Deus'),
    m('As bodas de Caná', 'Jo 2,1-12', { bookId: 'joao', chapter: 2, from: 1, to: 12 }, 'Maria percebe que falta vinho e diz: "Fazei tudo o que ele vos disser". Ela continua atenta ao que nos falta.', 'Confiar na intercessão de Maria'),
    m('O anúncio do Reino e o convite à conversão', 'Mc 1,14-15', { bookId: 'marcos', chapter: 1, from: 14, to: 15 }, 'Jesus anuncia que o Reino chegou e chama: "Convertei-vos". Todo dia é dia de recomeçar.', 'Conversão do coração'),
    m('A transfiguração de Jesus', 'Lc 9,28-36', { bookId: 'lucas', chapter: 9, from: 28, to: 36 }, 'No alto do monte, os discípulos veem a glória de Jesus. A luz dele sustenta nos dias difíceis.', 'Escutar Jesus'),
    m('A instituição da Eucaristia', 'Mt 26,26-29', { bookId: 'mateus', chapter: 26, from: 26, to: 29 }, '"Isto é o meu corpo." Jesus fica conosco no pão e no vinho, para sempre.', 'Amor à Eucaristia'),
  ],
  dolorosos: [
    m('A agonia de Jesus no Horto', 'Lc 22,39-46', { bookId: 'lucas', chapter: 22, from: 39, to: 46 }, 'Com medo e angústia, Jesus reza: "Não se faça a minha vontade, mas a tua". Ele entende a nossa dor.', 'Confiança na hora da prova'),
    m('A flagelação de Jesus', 'Jo 19,1', { bookId: 'joao', chapter: 19, from: 1, to: 1 }, 'Jesus é açoitado em silêncio. Ele carrega as feridas de todos os que sofrem violência.', 'Mortificação e paciência'),
    m('A coroação de espinhos', 'Mt 27,27-31', { bookId: 'mateus', chapter: 27, from: 27, to: 31 }, 'Zombam de Jesus como rei de mentira. Ele é rei de verdade — de um reino de amor e humildade.', 'Humildade diante das humilhações'),
    m('Jesus carrega a cruz', 'Lc 23,26-32', { bookId: 'lucas', chapter: 23, from: 26, to: 32 }, 'Simão de Cirene ajuda Jesus a carregar a cruz. Também podemos ajudar a carregar a cruz dos outros.', 'Paciência e generosidade'),
    m('A crucificação e morte de Jesus', 'Lc 23,33-46', { bookId: 'lucas', chapter: 23, from: 33, to: 46 }, 'Na cruz, Jesus perdoa e entrega tudo ao Pai. Não existe amor maior.', 'Amor a Jesus e perdão'),
  ],
  gloriosos: [
    m('A ressurreição de Jesus', 'Mc 16,1-7', { bookId: 'marcos', chapter: 16, from: 1, to: 7 }, 'O túmulo está vazio: Jesus vive! A última palavra não é da morte.', 'Fé e esperança'),
    m('A ascensão de Jesus ao céu', 'At 1,6-11', { bookId: 'atos', chapter: 1, from: 6, to: 11 }, 'Jesus volta ao Pai e nos envia como testemunhas. O céu é o nosso destino.', 'Desejo do céu'),
    m('A vinda do Espírito Santo', 'At 2,1-4', { bookId: 'atos', chapter: 2, from: 1, to: 4 }, 'Em Pentecostes, o Espírito Santo desce sobre Maria e os apóstolos. Ele dá coragem a quem tem medo.', 'Os dons do Espírito Santo'),
    m('A assunção de Maria ao céu', 'Ap 12,1', { bookId: 'apocalipse', chapter: 12, from: 1, to: 1 }, 'Maria é levada ao céu de corpo e alma. Onde ela está, esperamos estar um dia.', 'A graça de uma boa morte'),
    m('A coroação de Maria, rainha do céu e da terra', 'Ap 12,1', { bookId: 'apocalipse', chapter: 12, from: 1, to: 1 }, 'Maria é rainha porque foi a primeira a servir. Ela reina como mãe, cuidando de nós.', 'Confiança em Maria'),
  ],
};
