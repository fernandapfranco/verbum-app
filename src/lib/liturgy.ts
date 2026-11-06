/**
 * Calendário litúrgico calculado por algoritmo (sem depender de API).
 *
 * Fase atual: tempos litúrgicos, cores, datas móveis principais e o período
 * do Regina Caeli. Regras do Brasil: Epifania no domingo entre 2 e 8 de
 * janeiro; o Batismo do Senhor é no domingo seguinte, ou na segunda-feira
 * quando a Epifania cai em 7 ou 8 de janeiro.
 */
import { addDays, diffDays, type ISODate, parseISODate, toISODate, weekday } from './dates';

export type Season = 'advento' | 'natal' | 'comum' | 'quaresma' | 'triduo' | 'pascoa';
export type LiturgicalColor = 'roxo' | 'branco' | 'verde' | 'vermelho' | 'rosa';

export const SEASON_NAME: Record<Season, string> = {
  advento: 'Advento',
  natal: 'Tempo do Natal',
  comum: 'Tempo Comum',
  quaresma: 'Quaresma',
  triduo: 'Tríduo Pascal',
  pascoa: 'Tempo Pascal',
};

export const COLOR_HEX: Record<LiturgicalColor, string> = {
  roxo: '#6B3FA0',
  branco: '#E8C766',
  verde: '#2E8B57',
  vermelho: '#C0392B',
  rosa: '#D9779B',
};

/** Domingo de Páscoa (algoritmo gregoriano de Meeus/Jones/Butcher). */
export function easter(year: number): ISODate {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return toISODate(new Date(year, month - 1, day, 12));
}

/** 1º Domingo do Advento: o quarto domingo antes do Natal. */
export function adventStart(year: number): ISODate {
  const christmas = `${year}-12-25`;
  const wd = weekday(christmas); // 0 = domingo
  const lastSundayBefore = addDays(christmas, wd === 0 ? -7 : -wd);
  return addDays(lastSundayBefore, -21);
}

/** Epifania no Brasil: domingo entre 2 e 8 de janeiro. */
export function epiphany(year: number): ISODate {
  for (let d = 2; d <= 8; d++) {
    const date = `${year}-01-0${d}`;
    if (weekday(date) === 0) return date;
  }
  throw new Error('Epifania não encontrada');
}

/** Batismo do Senhor (fim do Tempo do Natal). */
export function baptismOfTheLord(year: number): ISODate {
  const ep = epiphany(year);
  const day = parseISODate(ep).getDate();
  return day >= 7 ? addDays(ep, 1) : addDays(ep, 7);
}

export interface YearDates {
  ashWednesday: ISODate;
  palmSunday: ISODate;
  holyThursday: ISODate;
  goodFriday: ISODate;
  easter: ISODate;
  pentecost: ISODate;
  adventStart: ISODate;
  christmas: ISODate;
}

export function yearDates(year: number): YearDates {
  const e = easter(year);
  return {
    ashWednesday: addDays(e, -46),
    palmSunday: addDays(e, -7),
    holyThursday: addDays(e, -3),
    goodFriday: addDays(e, -2),
    easter: e,
    pentecost: addDays(e, 49),
    adventStart: adventStart(year),
    christmas: `${year}-12-25`,
  };
}

export interface LiturgicalDay {
  season: Season;
  color: LiturgicalColor;
  /** Nome do dia, quando é especial ("Domingo de Páscoa", "Quarta-feira de Cinzas"…). */
  special?: string;
}

export function liturgicalDay(date: ISODate): LiturgicalDay {
  const year = parseISODate(date).getFullYear();
  const y = yearDates(year);
  const baptism = baptismOfTheLord(year);

  const specials: Record<string, { name: string; color?: LiturgicalColor }> = {
    [y.ashWednesday]: { name: 'Quarta-feira de Cinzas' },
    [y.palmSunday]: { name: 'Domingo de Ramos', color: 'vermelho' },
    [y.holyThursday]: { name: 'Quinta-feira Santa' },
    [y.goodFriday]: { name: 'Sexta-feira Santa', color: 'vermelho' },
    [addDays(y.easter, -1)]: { name: 'Sábado Santo' },
    [y.easter]: { name: 'Domingo de Páscoa' },
    [y.pentecost]: { name: 'Pentecostes', color: 'vermelho' },
    [y.christmas]: { name: 'Natal do Senhor' },
    [addDays(y.adventStart, 14)]: { name: '3º Domingo do Advento (Gaudete)', color: 'rosa' },
    [addDays(y.easter, -21)]: { name: '4º Domingo da Quaresma (Laetare)', color: 'rosa' },
    [epiphany(year)]: { name: 'Epifania do Senhor' },
    [baptism]: { name: 'Batismo do Senhor' },
  };
  const sp = specials[date];

  let season: Season;
  let color: LiturgicalColor;
  if (date <= baptism) [season, color] = ['natal', 'branco'];
  else if (date < y.ashWednesday) [season, color] = ['comum', 'verde'];
  else if (date < y.holyThursday) [season, color] = ['quaresma', 'roxo'];
  else if (date < y.easter) [season, color] = ['triduo', 'branco'];
  else if (date <= y.pentecost) [season, color] = ['pascoa', 'branco'];
  else if (date < y.adventStart) [season, color] = ['comum', 'verde'];
  else if (date < y.christmas) [season, color] = ['advento', 'roxo'];
  else [season, color] = ['natal', 'branco'];

  if (season === 'triduo' && date === y.goodFriday) color = 'vermelho';
  return { season, color: sp?.color ?? color, special: sp?.name };
}

/** Do Domingo de Páscoa até Pentecostes, o Angelus dá lugar ao Regina Caeli. */
export function isReginaCaeliTime(date: ISODate): boolean {
  const y = yearDates(parseISODate(date).getFullYear());
  return date >= y.easter && date <= y.pentecost;
}

export interface UpcomingSeason {
  season: Season;
  start: ISODate;
  inDays: number;
}

/** Próximo início de Advento, Quaresma ou Páscoa a partir de `date`. */
export function nextSeasonStart(date: ISODate): UpcomingSeason {
  const year = parseISODate(date).getFullYear();
  const candidates: { season: Season; start: ISODate }[] = [];
  for (const yr of [year, year + 1]) {
    const y = yearDates(yr);
    candidates.push({ season: 'quaresma', start: y.ashWednesday });
    candidates.push({ season: 'pascoa', start: y.easter });
    candidates.push({ season: 'advento', start: y.adventStart });
  }
  const next = candidates.filter((c) => c.start > date).sort((a, b) => (a.start < b.start ? -1 : 1))[0];
  return { ...next, inDays: diffDays(date, next.start) };
}

export type SeasonPartId = 'advento' | 'natal' | 'comum-1' | 'quaresma' | 'triduo' | 'pascoa' | 'comum-2';

export interface SeasonPeriod {
  id: SeasonPartId;
  start: ISODate;
  /** Último dia do tempo (inclusive). */
  end: ISODate;
}

/**
 * Os tempos do ano litúrgico que contém `date`, do 1º Domingo do Advento ao
 * sábado antes do Advento seguinte. `label` = "2025–2026".
 */
export function liturgicalYear(date: ISODate): { label: string; periods: SeasonPeriod[]; nextAdvent: ISODate } {
  const year = parseISODate(date).getFullYear();
  const y = date >= adventStart(year) ? year + 1 : year;
  const prev = yearDates(y - 1);
  const cur = yearDates(y);
  const baptism = baptismOfTheLord(y);
  return {
    label: `${y - 1}–${y}`,
    nextAdvent: cur.adventStart,
    periods: [
      { id: 'advento', start: prev.adventStart, end: `${y - 1}-12-24` },
      { id: 'natal', start: `${y - 1}-12-25`, end: baptism },
      { id: 'comum-1', start: addDays(baptism, 1), end: addDays(cur.ashWednesday, -1) },
      { id: 'quaresma', start: cur.ashWednesday, end: addDays(cur.holyThursday, -1) },
      { id: 'triduo', start: cur.holyThursday, end: cur.easter },
      { id: 'pascoa', start: cur.easter, end: cur.pentecost },
      { id: 'comum-2', start: addDays(cur.pentecost, 1), end: addDays(cur.adventStart, -1) },
    ],
  };
}
