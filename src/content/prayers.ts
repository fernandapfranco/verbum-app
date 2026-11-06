import type { Reviewable } from './types';

/**
 * Orações. Textos tradicionais (domínio público), nas versões populares no
 * Brasil. Antes e depois da leitura: oração para se pôr na presença de Deus e oração
 * final, tradicionais — conferidas pela dona do projeto com o site do Pe. Paulo Ricardo.
 * Linhas que começam com "V." e "R." são versículo e resposta (o app destaca o "R.").
 */
export type PrayerGroup = 'leitura' | 'do-dia' | 'basicas' | 'marianas' | 'perdao';

export const PRAYER_GROUPS: { id: PrayerGroup; titulo: string; descricao: string }[] = [
  { id: 'leitura', titulo: 'Para ler a Bíblia', descricao: 'Para abrir o coração antes e agradecer depois.' },
  { id: 'do-dia', titulo: 'Ao longo do dia', descricao: 'O Angelus (ou o Regina Caeli, no tempo pascal).' },
  { id: 'basicas', titulo: 'Orações básicas', descricao: 'As que todo católico reza.' },
  { id: 'marianas', titulo: 'Com Maria', descricao: 'Orações à Mãe de Jesus.' },
  { id: 'perdao', titulo: 'Perdão e recomeço', descricao: 'Para pedir perdão a Deus.' },
];

export interface Prayer extends Reviewable {
  id: string;
  titulo: string;
  grupo: PrayerGroup;
  texto: string;
  /** Explicação curta para quem está aprendendo. */
  sobre: string;
  /** Oração própria do Verbum (não tradicional). */
  propria?: boolean;
}

const p = (
  id: string,
  grupo: PrayerGroup,
  titulo: string,
  texto: string,
  sobre: string,
  fontes: string[] = [],
  propria = false,
): Prayer => ({ id, grupo, titulo, texto, sobre, fontes, propria, status: 'rascunho' });

export const PRAYERS: readonly Prayer[] = [
  // Para ler a Bíblia
  p(
    'antes-da-leitura',
    'leitura',
    'Oração para se pôr na presença de Deus',
    'Meu Senhor e meu Deus, creio firmemente que estás aqui, que me vês, que me ouves.\nAdoro-te com profunda reverência.\nPeço-te perdão dos meus pecados e graça para fazer com fruto este tempo de oração.\nMinha Mãe Imaculada, São José, meu pai e senhor, meu Anjo da Guarda, intercedei por mim.',
    'Oração tradicional para começar um tempo de oração ou de leitura: colocar-se na presença de Deus, adorá-lo, pedir perdão e pedir a ajuda de Maria, de São José e do Anjo da Guarda.',
    ['CIC 2700–2724 (a meditação e a oração mental)'],
  ),
  p(
    'vinde-espirito-santo',
    'leitura',
    'Vinde, Espírito Santo',
    'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.\n\nV. Enviai o vosso Espírito e tudo será criado.\nR. E renovareis a face da terra.\n\nOremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, concedei-nos que no mesmo Espírito saibamos o que é reto e gozemos sempre da sua consolação. Por Cristo, Senhor nosso.\nAmém.',
    'Oração tradicional ao Espírito Santo. Ótima para antes de ler, estudar ou tomar uma decisão.',
    ['CIC 2670–2672'],
  ),
  p(
    'depois-da-leitura',
    'leitura',
    'Oração final',
    'Dou-te graças, meu Deus, pelos bons propósitos, afetos e inspirações que me comunicaste neste tempo de oração.\nPeço-te ajuda para pô-los em prática.\nMinha Mãe Imaculada, São José, meu pai e senhor, meu Anjo da Guarda, intercedei por mim.',
    'A oração que costuma encerrar o tempo de oração: agradecer o que Deus falou ao coração e pedir ajuda para viver isso no dia a dia.',
    ['CIC 2700–2724', 'Tg 1,22'],
  ),

  // Ao longo do dia
  p(
    'angelus',
    'do-dia',
    'Angelus',
    'V. O Anjo do Senhor anunciou a Maria.\nR. E ela concebeu do Espírito Santo.\nAve Maria…\n\nV. Eis aqui a serva do Senhor.\nR. Faça-se em mim segundo a vossa palavra.\nAve Maria…\n\nV. E o Verbo se fez carne.\nR. E habitou entre nós.\nAve Maria…\n\nV. Rogai por nós, santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo.\n\nOremos: Infundi, Senhor, como vos pedimos, a vossa graça em nossas almas, para que nós, que pela anunciação do Anjo conhecemos a encarnação de Cristo, vosso Filho, por sua paixão e morte sejamos conduzidos à glória da ressurreição. Pelo mesmo Cristo, Senhor nosso.\nAmém.',
    'Rezado às 6h, 12h e 18h, lembra o momento em que o anjo Gabriel anunciou a Maria que ela seria a mãe de Jesus. "E o Verbo se fez carne" — é daí que vem o nome do app. Onde está "Ave Maria…", reze a Ave-Maria inteira.',
    ['Lc 1,26-38', 'Jo 1,14', 'CIC 2617', 'CIC 2673–2675'],
  ),
  p(
    'regina-caeli',
    'do-dia',
    'Regina Caeli',
    'Rainha do céu, alegrai-vos, aleluia!\nPorque aquele que merecestes trazer em vosso seio, aleluia!\nRessuscitou como disse, aleluia!\nRogai a Deus por nós, aleluia!\n\nV. Exultai e alegrai-vos, ó Virgem Maria, aleluia!\nR. Porque o Senhor ressuscitou verdadeiramente, aleluia!\n\nOremos: Ó Deus, que vos dignastes alegrar o mundo com a ressurreição do vosso Filho, Nosso Senhor Jesus Cristo, concedei-nos, vos suplicamos, que por sua Mãe, a Virgem Maria, alcancemos as alegrias da vida eterna. Pelo mesmo Cristo, Senhor nosso.\nAmém.',
    'No Tempo Pascal (do Domingo de Páscoa a Pentecostes), o Regina Caeli substitui o Angelus. É uma oração cheia de alegria pela ressurreição de Jesus.',
    ['CIC 2673–2675'],
  ),

  // Orações básicas
  p(
    'sinal-da-cruz',
    'basicas',
    'Sinal da Cruz',
    'Em nome do Pai, e do Filho, e do Espírito Santo.\nAmém.',
    'É o jeito de começar e terminar toda oração. Com a mão direita, toque a testa (Pai), o peito (Filho), o ombro esquerdo e o direito (Espírito Santo).',
    ['CIC 2157'],
  ),
  p(
    'pai-nosso',
    'basicas',
    'Pai-Nosso',
    'Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu.\n\nO pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal.\nAmém.',
    'A oração que o próprio Jesus ensinou (Mt 6,9-13). Ela resume todo o Evangelho.',
    ['CIC 2759–2865'],
  ),
  p(
    'gloria',
    'basicas',
    'Glória ao Pai',
    'Glória ao Pai, e ao Filho, e ao Espírito Santo.\nComo era no princípio, agora e sempre.\nAmém.',
    'Uma oração curtinha de louvor à Santíssima Trindade.',
    ['CIC 2639–2643'],
  ),
  p(
    'credo',
    'basicas',
    'Creio (Símbolo dos Apóstolos)',
    'Creio em Deus Pai todo-poderoso, criador do céu e da terra.\nE em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos.\nCreio no Espírito Santo, na santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna.\nAmém.',
    'O resumo da fé cristã, transmitido desde os primeiros séculos. É rezado no início do terço.',
    ['CIC 185–197'],
  ),
  p(
    'santo-anjo',
    'basicas',
    'Santo Anjo',
    'Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina.\nAmém.',
    'Oração ao anjo da guarda, que Deus dá a cada pessoa para protegê-la e guiá-la.',
    ['CIC 336'],
  ),

  // Com Maria
  p(
    'ave-maria',
    'marianas',
    'Ave-Maria',
    'Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus.\n\nSanta Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte.\nAmém.',
    'A primeira parte vem do Evangelho: a saudação do anjo Gabriel e de Isabel a Maria (Lc 1,28.42). A segunda é um pedido: que Maria reze por nós.',
    ['CIC 2676–2679'],
  ),
  p(
    'salve-rainha',
    'marianas',
    'Salve Rainha',
    'Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve!\nA vós bradamos, os degredados filhos de Eva.\nA vós suspiramos, gemendo e chorando neste vale de lágrimas.\nEia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei;\ne depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre,\nó clemente, ó piedosa, ó doce sempre Virgem Maria.\n\nV. Rogai por nós, santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo.\nAmém.',
    'Uma oração antiga e muito amada, que pede a Maria que nos mostre Jesus. Costuma encerrar o terço.',
    ['CIC 2677', 'CIC 969'],
  ),

  p(
    'fatima',
    'marianas',
    'Ó meu Jesus',
    'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem da vossa misericórdia.',
    'Rezada no terço depois de cada Glória. Foi ensinada por Nossa Senhora aos pastorinhos em Fátima (1917).',
    ['CIC 67 (revelações privadas)'],
  ),

  // Perdão
  p(
    'ato-de-contricao',
    'perdao',
    'Ato de contrição',
    'Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois infinitamente bom e amável e porque o pecado vos desagrada.\nProponho firmemente, com a ajuda da vossa graça, não mais pecar e fugir das ocasiões de pecado.\nAmém.',
    'Para pedir perdão a qualquer momento, e também ao final da Confissão. Rezar com sinceridade já é um passo de volta para casa.',
    ['CIC 1451–1454'],
  ),
];

export function getPrayer(id: string) {
  return PRAYERS.find((x) => x.id === id);
}
