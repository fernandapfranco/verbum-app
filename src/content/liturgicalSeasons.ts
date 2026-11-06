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
  /** O que se vive neste tempo: atitudes e graças próprias. */
  vive: { titulo: string; texto: string }[];
  /** Sugestões simples e concretas. */
  praticas: string[];
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
    vive: [
      { titulo: 'Espera', texto: 'Esperamos Jesus de dois jeitos: lembramos a sua chegada em Belém e aguardamos a sua volta gloriosa. É uma espera ativa, de quem arruma a casa para receber alguém querido.' },
      { titulo: 'Vigilância', texto: '"Vigiai!" é a palavra do Advento (Mc 13,37). Ficar atento aos sinais de Deus no dia a dia, sem deixar o coração adormecer na correria.' },
      { titulo: 'Esperança alegre', texto: 'Não é um tempo de tristeza: é a alegria de quem sabe que o Senhor está perto (Fl 4,4-5). O roxo aqui fala de preparação, não de luto.' },
      { titulo: 'Com Isaías, João Batista e Maria', texto: 'São os grandes guias do Advento: o profeta anuncia, João prepara o caminho e Maria acolhe Jesus com um "sim".' },
    ],
    praticas: ['Montar a coroa do Advento e acender uma vela a cada domingo', 'Fazer uma boa confissão antes do Natal', 'Montar o presépio aos poucos, deixando o Menino para a noite de Natal', 'Ler o Evangelho do dia'],
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
    vive: [
      { titulo: 'Deus conosco', texto: 'Deus se fez pequeno e próximo: o Emanuel (Mt 1,23). O Natal convida a contemplar o Menino no presépio e a se deixar amar por um Deus que não fica distante.' },
      { titulo: 'Alegria e gratidão', texto: 'É tempo de festa, de família e de partilha. A alegria do Natal se completa quando chega também a quem está sozinho ou precisando.' },
      { titulo: 'Jesus se manifesta', texto: 'Na Epifania, os Magos representam todos os povos que encontram Jesus; no Batismo, o Pai o apresenta: "Este é o meu Filho amado". Nós também somos chamados a ser luz.' },
    ],
    praticas: ['Rezar diante do presépio em família', 'Ler Lucas 2 e Mateus 2', 'Visitar ou ligar para alguém que está sozinho', 'Na Epifania, pedir a bênção da casa (costume tradicional)'],
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
    vive: [
      { titulo: 'Seguir Jesus no dia a dia', texto: 'Acompanhamos Jesus no começo da sua missão: chamando os discípulos, pregando e curando. Somos convidados a caminhar com Ele no cotidiano.' },
      { titulo: 'Crescer devagar', texto: 'O verde fala de esperança e crescimento. Como a semente que cresce sem barulho (Mc 4,26-29), a fé amadurece com constância.' },
      { titulo: 'Santidade no comum', texto: 'Trabalho, estudo, família e amizades são lugar de encontro com Deus. Não é preciso esperar um momento especial para ser santo.' },
    ],
    praticas: ['Ler um Evangelho inteiro, capítulo por capítulo', 'Participar da Missa aos domingos', 'Escolher uma virtude para cultivar (paciência, gratidão, generosidade…)'],
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
    vive: [
      { titulo: 'Conversão', texto: '"Voltai para mim de todo o coração" (Jl 2,12). Converter-se é mudar a direção da vida e voltar para os braços do Pai, como o filho pródigo.' },
      { titulo: 'Oração, jejum e esmola', texto: 'São os três caminhos que Jesus ensina (Mt 6,1-18): mais tempo com Deus, domínio de si e partilha com quem precisa.' },
      { titulo: 'O deserto', texto: 'Com Jesus no deserto (Mt 4,1-11), aprendemos a fazer silêncio e a enfrentar as tentações confiando na Palavra de Deus.' },
      { titulo: 'Preparar o Batismo', texto: 'A Igreja prepara os catecúmenos para o Batismo na Páscoa, e todos nós nos preparamos para renovar as promessas do nosso Batismo na Vigília Pascal.' },
    ],
    praticas: ['Fazer uma boa confissão', 'Rezar a Via-Sacra numa sexta-feira', 'Jejum na Quarta-feira de Cinzas e na Sexta-feira Santa (dos 18 aos 59 anos) e abstinência de carne nas sextas (a partir dos 14 anos)', 'Participar da Campanha da Fraternidade com um gesto concreto de partilha'],
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
    vive: [
      { titulo: 'Amor até o fim', texto: 'Na Quinta-feira Santa, Jesus nos dá a Eucaristia e lava os pés dos discípulos: "Amou-os até o fim" (Jo 13,1). Amor que se faz serviço.' },
      { titulo: 'A Cruz', texto: 'Na Sexta-feira Santa contemplamos o amor que se entrega por nós. Adoramos a Cruz, porque nela está a nossa salvação.' },
      { titulo: 'Silêncio e espera', texto: 'O Sábado Santo é dia de silêncio junto ao sepulcro, com Maria, esperando a Ressurreição.' },
      { titulo: 'Da morte à vida', texto: 'Na Vigília Pascal, a luz do círio vence a escuridão e a Igreja canta de novo o Aleluia: Cristo ressuscitou!' },
    ],
    praticas: ['Participar das celebrações dos três dias', 'Ficar um tempo em adoração na noite da Quinta-feira Santa', 'Ler a Paixão em João 18 e 19', 'Guardar o jejum pascal na Sexta-feira Santa'],
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
    vive: [
      { titulo: 'Alegria da Ressurreição', texto: 'Cristo vive! A morte não tem a última palavra. Por cinquenta dias a Igreja canta o Aleluia e celebra como se fosse um único grande domingo.' },
      { titulo: 'Encontros com o Ressuscitado', texto: 'Madalena, os discípulos de Emaús, Tomé… Jesus se deixa encontrar, e nós o reconhecemos na Palavra e no partir do pão (Lc 24,30-32).' },
      { titulo: 'Esperar o Espírito Santo', texto: 'Como os apóstolos reunidos com Maria no cenáculo (At 1,14), a Igreja reza pedindo o Espírito Santo, que vem em Pentecostes.' },
      { titulo: 'Missão', texto: 'Quem encontrou o Ressuscitado não guarda a notícia para si: "Ide e fazei discípulos" (Mt 28,19).' },
    ],
    praticas: ['Ler os Atos dos Apóstolos', 'Rezar o Regina Caeli às 6h, 12h e 18h', 'Fazer a novena ao Espírito Santo entre a Ascensão e Pentecostes', 'Comungar no tempo pascal (preceito da Igreja)'],
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
    vive: [
      { titulo: 'Discipulado', texto: 'Domingo a domingo, ouvimos os ensinamentos e as parábolas de Jesus. É o tempo de aprender com o Mestre e colocar em prática.' },
      { titulo: 'Fé que dá frutos', texto: 'Depois de receber o Espírito em Pentecostes, a Igreja vive a missão no dia a dia. A fé se mostra na caridade e na constância.' },
      { titulo: 'O olhar para o fim', texto: 'Nos últimos domingos, as leituras falam da volta de Cristo e da vida eterna. Em novembro, rezamos pelos falecidos e lembramos os santos.' },
      { titulo: 'Cristo Rei', texto: 'O ano termina proclamando que Jesus é Rei do Universo: um Rei que serve e reina pelo amor.' },
    ],
    praticas: ['Manter a constância: um pouco de leitura e oração todos os dias', 'Participar da adoração em Corpus Christi', 'Rezar pelos falecidos em novembro', 'Ler as parábolas de Mateus 13 e Lucas 15'],
    fontes: FONTES,
    status: 'rascunho',
  },
];
