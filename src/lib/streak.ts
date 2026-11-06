/**
 * Check-in diário, ofensiva (sequência de dias) e velas de proteção.
 *
 * - O check-in do dia acontece na PRIMEIRA atividade concluída (ler um
 *   capítulo ou concluir uma lição) e rende talentos.
 * - A ofensiva conta dias seguidos com check-in ou protegidos por uma vela.
 * - Se a pessoa perder dias, as velas que ela tem são usadas automaticamente
 *   para cobrir a lacuna (uma por dia). Se não houver velas suficientes, a
 *   ofensiva recomeça — sem bronca: o anjo só diz "que bom te ver de novo".
 */
import { addDays, diffDays, type ISODate } from './dates';

export const REWARDS = {
  checkin: 10,
  /** Bônus a cada 7 dias seguidos. */
  weekBonus: 30,
  /** Presente de boas-vindas. */
  welcomeCandles: 1,
} as const;

export const CANDLE_PRICE = 50;
export const MAX_CANDLES = 2;

export interface StreakInput {
  /** Dias com check-in. */
  checkins: ReadonlySet<ISODate>;
  /** Dias cobertos por vela. */
  protectedDays: ReadonlySet<ISODate>;
}

const covered = (s: StreakInput, d: ISODate) => s.checkins.has(d) || s.protectedDays.has(d);

/**
 * Ofensiva atual. Se hoje ainda não teve check-in, a sequência que terminou
 * ontem continua valendo (a pessoa ainda pode fazer o check-in hoje).
 */
export function currentStreak(s: StreakInput, today: ISODate): number {
  let d = covered(s, today) ? today : addDays(today, -1);
  let n = 0;
  while (covered(s, d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export interface Reconciliation {
  /** Dias perdidos que devem ser protegidos agora (consomem uma vela cada). */
  protect: ISODate[];
  /** A ofensiva quebrou (lacuna maior que as velas disponíveis). */
  broken: boolean;
  /** Quantos dias ficaram sem check-in. */
  missed: number;
}

/**
 * Verifica a lacuna entre o último dia coberto e hoje. Idempotente: dias já
 * protegidos não são protegidos de novo.
 */
export function reconcile(s: StreakInput, candles: number, today: ISODate): Reconciliation {
  const all = [...s.checkins, ...s.protectedDays].filter((d) => d < today).sort();
  const last = all[all.length - 1];
  if (!last) return { protect: [], broken: false, missed: 0 };
  const gap = diffDays(last, today) - 1; // dias entre o último coberto e hoje (exclusive)
  if (gap <= 0) return { protect: [], broken: false, missed: 0 };
  if (gap <= candles) {
    const protect = Array.from({ length: gap }, (_, i) => addDays(last, i + 1));
    return { protect, broken: false, missed: gap };
  }
  return { protect: [], broken: true, missed: gap };
}

/** Talentos ganhos no check-in, considerando a ofensiva que ele completa. */
export function checkinReward(streakAfter: number): { base: number; bonus: number } {
  return { base: REWARDS.checkin, bonus: streakAfter > 0 && streakAfter % 7 === 0 ? REWARDS.weekBonus : 0 };
}

export type WeekDayState = 'checkin' | 'protegido' | 'vazio' | 'hoje' | 'futuro';

/** Situação de cada dia da semana atual (domingo a sábado). */
export function weekView(s: StreakInput, today: ISODate, weekdayOfToday: number): { date: ISODate; state: WeekDayState }[] {
  const start = addDays(today, -weekdayOfToday);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    let state: WeekDayState;
    if (s.checkins.has(date)) state = 'checkin';
    else if (s.protectedDays.has(date)) state = 'protegido';
    else if (date === today) state = 'hoje';
    else if (date > today) state = 'futuro';
    else state = 'vazio';
    return { date, state };
  });
}
