import type { Reviewable } from './types';

/**
 * Orações básicas (Fase 1: as usadas na trilha Primeiros Passos).
 * Textos tradicionais de domínio público, nas versões populares no Brasil.
 */
export interface Prayer extends Reviewable {
  id: string;
  titulo: string;
  texto: string;
  /** Explicação curta para quem está aprendendo. */
  sobre: string;
}

const p = (id: string, titulo: string, texto: string, sobre: string, fontes: string[] = []): Prayer => ({
  id,
  titulo,
  texto,
  sobre,
  fontes,
  status: 'rascunho',
});

export const PRAYERS: readonly Prayer[] = [
  p(
    'sinal-da-cruz',
    'Sinal da Cruz',
    'Em nome do Pai, e do Filho, e do Espírito Santo. Amém.',
    'É o jeito de começar e terminar toda oração. Com a mão direita, toque a testa (Pai), o peito (Filho), o ombro esquerdo e o direito (Espírito Santo).',
    ['CIC 2157'],
  ),
  p(
    'pai-nosso',
    'Pai-Nosso',
    'Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu.\n\nO pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.',
    'A oração que o próprio Jesus ensinou (Mt 6,9-13). Ela resume todo o Evangelho.',
    ['CIC 2759–2865'],
  ),
  p(
    'ave-maria',
    'Ave-Maria',
    'Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus.\n\nSanta Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.',
    'A primeira parte vem do Evangelho: a saudação do anjo Gabriel e de Isabel a Maria (Lc 1,28.42). A segunda é um pedido: que Maria reze por nós.',
    ['CIC 2676–2679'],
  ),
  p(
    'gloria',
    'Glória ao Pai',
    'Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.',
    'Uma oração curtinha de louvor à Santíssima Trindade.',
    ['CIC 2639–2643'],
  ),
  p(
    'santo-anjo',
    'Santo Anjo',
    'Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém.',
    'Oração ao anjo da guarda, que Deus dá a cada pessoa para protegê-la e guiá-la.',
    ['CIC 336'],
  ),
];

export function getPrayer(id: string) {
  return PRAYERS.find((x) => x.id === id);
}
