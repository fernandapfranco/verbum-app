/**
 * Terço e Rosário: mistérios do dia e a sequência de orações conta por conta.
 *
 * Mistérios por dia (São João Paulo II, Rosarium Virginis Mariae, 38):
 * segunda e sábado gozosos, terça e sexta dolorosos, quarta e domingo
 * gloriosos, quinta luminosos. Costume indicado no mesmo texto: nos domingos
 * do Advento e do Natal, gozosos; nos domingos da Quaresma, dolorosos.
 */
import { type ISODate, weekday } from './dates';
import { liturgicalDay } from './liturgy';

export type MysterySet = 'gozosos' | 'luminosos' | 'dolorosos' | 'gloriosos';

export const SET_NAME: Record<MysterySet, string> = {
  gozosos: 'Mistérios Gozosos',
  luminosos: 'Mistérios Luminosos',
  dolorosos: 'Mistérios Dolorosos',
  gloriosos: 'Mistérios Gloriosos',
};

export const SET_ORDER: MysterySet[] = ['gozosos', 'luminosos', 'dolorosos', 'gloriosos'];

const BY_WEEKDAY: MysterySet[] = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos'];

export function mysteriesForDate(date: ISODate): MysterySet {
  const wd = weekday(date);
  if (wd === 0) {
    const s = liturgicalDay(date).season;
    if (s === 'advento' || s === 'natal') return 'gozosos';
    if (s === 'quaresma') return 'dolorosos';
  }
  return BY_WEEKDAY[wd];
}

export type RosaryStep =
  | { kind: 'oracao'; prayerId: string; title: string }
  | { kind: 'misterio'; set: MysterySet; index: number }
  | { kind: 'ave'; bead: number; total: number; decade?: { set: MysterySet; index: number }; intention?: string };

const INTRO_AVE = ['Pela fé', 'Pela esperança', 'Pela caridade'];

/** Sequência completa: abertura, cada mistério com sua dezena e o encerramento. */
export function buildRosary(sets: MysterySet[]): RosaryStep[] {
  const steps: RosaryStep[] = [
    { kind: 'oracao', prayerId: 'sinal-da-cruz', title: 'Sinal da Cruz' },
    { kind: 'oracao', prayerId: 'credo', title: 'Creio' },
    { kind: 'oracao', prayerId: 'pai-nosso', title: 'Pai-Nosso' },
    ...INTRO_AVE.map((intention, i): RosaryStep => ({ kind: 'ave', bead: i + 1, total: 3, intention })),
    { kind: 'oracao', prayerId: 'gloria', title: 'Glória' },
  ];
  for (const set of sets) {
    for (let index = 0; index < 5; index++) {
      steps.push({ kind: 'misterio', set, index });
      steps.push({ kind: 'oracao', prayerId: 'pai-nosso', title: 'Pai-Nosso' });
      for (let b = 1; b <= 10; b++) steps.push({ kind: 'ave', bead: b, total: 10, decade: { set, index } });
      steps.push({ kind: 'oracao', prayerId: 'gloria', title: 'Glória' });
      steps.push({ kind: 'oracao', prayerId: 'fatima', title: 'Ó meu Jesus' });
    }
  }
  steps.push({ kind: 'oracao', prayerId: 'salve-rainha', title: 'Salve Rainha' });
  steps.push({ kind: 'oracao', prayerId: 'sinal-da-cruz', title: 'Sinal da Cruz' });
  return steps;
}

/** Quantas Ave-Marias tem a sequência (terço = 53, Rosário completo = 203). */
export function countAves(steps: RosaryStep[]): number {
  return steps.filter((s) => s.kind === 'ave').length;
}
