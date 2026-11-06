import type { LiturgicalColor } from '@/lib/liturgy';

import type { Reviewable } from './types';

/**
 * Explicações dos tempos litúrgicos, mostradas em Orar › Tempos litúrgicos.
 * As datas de cada ano são calculadas em `src/lib/liturgy.ts`; aqui ficam só a
 * regra ("quando começa e termina") e a explicação.
 */
export type SeasonPart = 'advento' | 'natal' | 'comum-1' | 'quaresma' | 'triduo' | 'pascoa' | 'comum-2';

export interface SeasonInfo extends Reviewable {
  id: SeasonPart;
  nome: string;
  cor: LiturgicalColor;
  /** Outras cores usadas em dias especiais do tempo. */
  outrasCores?: string;
  comeca: string;
  termina: string;
  /** O que a Igreja celebra e vive neste tempo. */
  sentido: string;
  /** Dias marcantes do tempo. */
  destaques: string[];
  /** Uma sugestão simples para viver o tempo. */
  comoViver: string;
}

const FONTES = [
  'Normas Universais sobre o Ano Litúrgico e o Calendário (1969)',
  'CIC 1163–1173 (o ano litúrgico)',
  'Sacrosanctum Concilium 102–111',
];

export const YEAR_INTRO =
  'A Igreja vive o ano em torno da vida de Jesus: espera o seu nascimento, celebra o Natal, caminha com Ele para a Páscoa e vive o tempo do Espírito Santo. Esse ciclo é o ano litúrgico. Ele começa no 1º Domingo do Advento e termina na festa de Cristo Rei. Cada tempo tem uma cor, que você vê nas vestes do padre e na faixa do altar.';

export const SEASONS_INFO: readonly SeasonInfo[] = [
  {
    id: 'advento',
    nome: 'Advento',
    cor: 'roxo',
    outrasCores: 'rosa no 3º domingo (Gaudete)',
    comeca: 'No 4º domingo antes do Natal (entre 27 de novembro e 3 de dezembro).',
    termina: 'Na tarde de 24 de dezembro, com a Missa da vigília do Natal.',
    sentido:
      'Advento quer dizer "chegada". São cerca de quatro semanas de espera alegre: preparamos o coração para celebrar a primeira vinda de Jesus, em Belém, e lembramos que Ele virá de novo no fim dos tempos. Até 16 de dezembro, as leituras falam mais da volta de Cristo; de 17 a 24, da preparação próxima para o Natal.',
    destaques: ['1º Domingo do Advento: começa o novo ano litúrgico', '8 de dezembro: Imaculada Conceição', '3º Domingo (Gaudete): "Alegrai-vos"'],
    comoViver: 'Montar a coroa do Advento, acendendo uma vela a cada domingo, e reservar alguns minutos por dia para ler os Evangelhos da infância de Jesus.',
    fontes: FONTES,
    status: 'rascunho',
  },
  {
    id: 'natal',
    nome: 'Tempo do Natal',
    cor: 'branco',
    comeca: 'Na Missa da vigília do Natal, na tarde de 24 de dezembro.',
    termina: 'Na festa do Batismo do Senhor (em janeiro, no domingo depois da Epifania).',
    sentido:
      'Celebramos que Deus se fez um de nós: o Filho de Deus nasce como criança, pobre, em Belém. O Natal não é um dia só; a Igreja estende a festa por uma oitava (oito dias) e por algumas semanas, até o Batismo de Jesus, quando começa a sua vida pública.',
    destaques: [
      '25 de dezembro: Natal do Senhor',
      'Domingo depois do Natal: Sagrada Família',
      '1º de janeiro: Santa Maria, Mãe de Deus',
      'Epifania: no Brasil, no domingo entre 2 e 8 de janeiro',
    ],
    comoViver: 'Rezar diante do presépio em família e ler Lucas 2 e Mateus 2.',
    fontes: FONTES,
    status: 'rascunho',
  },
  {
    id: 'comum-1',
    nome: 'Tempo Comum (1ª parte)',
    cor: 'verde',
    comeca: 'No dia seguinte ao Batismo do Senhor.',
    termina: 'Na terça-feira antes da Quarta-feira de Cinzas.',
    sentido:
      '"Comum" não quer dizer sem importância: são as semanas contadas uma a uma (ordinais), em que acompanhamos Jesus no dia a dia da sua missão, pregando e curando. O verde lembra esperança e crescimento.',
    destaques: ['2 de fevereiro: Apresentação do Senhor'],
    comoViver: 'Ler um Evangelho inteiro, capítulo por capítulo, no ritmo do seu plano.',
    fontes: FONTES,
    status: 'rascunho',
  },
  {
    id: 'quaresma',
    nome: 'Quaresma',
    cor: 'roxo',
    outrasCores: 'rosa no 4º domingo (Laetare), vermelho no Domingo de Ramos',
    comeca: 'Na Quarta-feira de Cinzas.',
    termina: 'Na Quinta-feira Santa, antes da Missa da Ceia do Senhor.',
    sentido:
      'São quarenta dias de preparação para a Páscoa, lembrando os quarenta dias de Jesus no deserto. É tempo de conversão, com três práticas: oração, jejum e esmola. Não é um tempo triste, mas de voltar para Deus com o coração inteiro.',
    destaques: [
      'Quarta-feira de Cinzas: jejum e abstinência',
      'Sextas-feiras: abstinência de carne',
      '19 de março: São José',
      'Domingo de Ramos: entrada de Jesus em Jerusalém e início da Semana Santa',
    ],
    comoViver: 'Escolher um pequeno sacrifício, fazer uma boa confissão e rezar a Via-Sacra numa sexta-feira.',
    fontes: [...FONTES, 'Código de Direito Canônico, cân. 1249–1253 (penitência)'],
    status: 'rascunho',
  },
  {
    id: 'triduo',
    nome: 'Tríduo Pascal',
    cor: 'branco',
    outrasCores: 'vermelho na Sexta-feira Santa',
    comeca: 'Na Missa da Ceia do Senhor, na noite da Quinta-feira Santa.',
    termina: 'Nas Vésperas (oração da tarde) do Domingo da Páscoa.',
    sentido:
      'São os três dias mais importantes do ano: a Última Ceia e o lava-pés, a Paixão e morte de Jesus na Sexta-feira Santa, o silêncio do Sábado Santo e a Vigília Pascal, a "mãe de todas as vigílias", quando celebramos a Ressurreição.',
    destaques: [
      'Quinta-feira Santa: instituição da Eucaristia e do sacerdócio',
      'Sexta-feira Santa: única data do ano sem Missa; jejum e abstinência',
      'Sábado Santo à noite: Vigília Pascal',
    ],
    comoViver: 'Participar das celebrações dos três dias e ler a Paixão em João 18 e 19.',
    fontes: FONTES,
    status: 'rascunho',
  },
  {
    id: 'pascoa',
    nome: 'Tempo Pascal',
    cor: 'branco',
    outrasCores: 'vermelho em Pentecostes',
    comeca: 'No Domingo da Páscoa.',
    termina: 'No Domingo de Pentecostes, 50 dias depois.',
    sentido:
      'Cinquenta dias celebrados como "um grande domingo": Jesus ressuscitou e está vivo! A Igreja canta o Aleluia, reza o Regina Caeli no lugar do Angelus e se prepara para receber o Espírito Santo em Pentecostes.',
    destaques: [
      'Oitava da Páscoa: os oito primeiros dias, celebrados como solenidade',
      '2º Domingo: Domingo da Divina Misericórdia',
      'Ascensão do Senhor: no Brasil, no 7º Domingo da Páscoa',
      'Pentecostes: a vinda do Espírito Santo',
    ],
    comoViver: 'Ler os Atos dos Apóstolos e rezar o Regina Caeli às 6h, 12h e 18h.',
    fontes: FONTES,
    status: 'rascunho',
  },
  {
    id: 'comum-2',
    nome: 'Tempo Comum (2ª parte)',
    cor: 'verde',
    comeca: 'Na segunda-feira depois de Pentecostes.',
    termina: 'No sábado antes do 1º Domingo do Advento.',
    sentido:
      'A parte mais longa do ano. Seguimos Jesus nos seus ensinamentos e parábolas. Nos últimos domingos, as leituras falam do fim dos tempos, e o ano termina com a solenidade de Cristo Rei do Universo.',
    destaques: [
      'Santíssima Trindade: domingo depois de Pentecostes',
      'Corpus Christi: quinta-feira depois da Santíssima Trindade',
      '12 de outubro: Nossa Senhora Aparecida',
      'Todos os Santos: no Brasil, no domingo depois de 1º de novembro (ou no próprio dia, se cair num domingo)',
      '2 de novembro: Fiéis Defuntos',
      'Último domingo: Cristo Rei do Universo',
    ],
    comoViver: 'Manter a constância: um pouco de leitura e oração todos os dias.',
    fontes: FONTES,
    status: 'rascunho',
  },
];
