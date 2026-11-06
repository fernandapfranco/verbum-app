/**
 * Motor do plano de leitura.
 *
 * Princípio: o plano NUNCA guarda "dívida". Todo dia, a leitura de hoje é
 * recalculada a partir do que falta e do tempo que resta. Se a pessoa atrasar,
 * o plano se ajusta sozinho (redistribui o que falta ou estende o prazo), sem
 * marcar nada como "atrasado".
 *
 * A unidade é o capítulo, mas o peso é o tempo de leitura (o Salmo 117 é
 * bem mais curto que o 119), estimado a partir do número de palavras.
 */
import { BOOKS } from '../bible/books';
import { addDays, diffDays, type ISODate, weekday } from '../dates';

export type PlanScope =
  | { kind: 'biblia' }
  | { kind: 'at' }
  | { kind: 'nt' }
  | { kind: 'evangelhos' }
  | { kind: 'salmos-proverbios' }
  | { kind: 'livro'; bookId: string };

export type PlanMode = 'prazo' | 'ritmo';

export interface PlanConfig {
  id: string;
  scope: PlanScope;
  mode: PlanMode;
  startDate: ISODate;
  /** Modo prazo: data final desejada. */
  endDate?: ISODate;
  /** Modo ritmo: minutos por dia. */
  minutesPerDay?: number;
  /** Dias da semana de leitura (0 = domingo). */
  weekdays: number[];
}

export interface ChapterUnit {
  bookId: string;
  chapter: number;
  minutes: number;
}

export const chapterKey = (u: { bookId: string; chapter: number }) => `${u.bookId}:${u.chapter}`;

const GOSPELS = new Set(['mateus', 'marcos', 'lucas', 'joao']);

export function scopeIncludes(scope: PlanScope, bookId: string): boolean {
  const book = BOOKS.find((b) => b.id === bookId);
  if (!book) return false;
  switch (scope.kind) {
    case 'biblia':
      return true;
    case 'at':
      return book.testament === 'AT';
    case 'nt':
      return book.testament === 'NT';
    case 'evangelhos':
      return GOSPELS.has(bookId);
    case 'salmos-proverbios':
      return bookId === 'salmos' || bookId === 'proverbios';
    case 'livro':
      return bookId === scope.bookId;
  }
}

export function scopeLabel(scope: PlanScope): string {
  switch (scope.kind) {
    case 'biblia':
      return 'Bíblia inteira';
    case 'at':
      return 'Antigo Testamento';
    case 'nt':
      return 'Novo Testamento';
    case 'evangelhos':
      return 'Os quatro Evangelhos';
    case 'salmos-proverbios':
      return 'Salmos e Provérbios';
    case 'livro':
      return BOOKS.find((b) => b.id === scope.bookId)?.shortName ?? scope.bookId;
  }
}

/**
 * Capítulos do escopo, na ordem canônica. Em "Salmos e Provérbios" os dois
 * livros são intercalados (um salmo, depois um capítulo de Provérbios…), como
 * nos planos tradicionais.
 */
export function unitsForScope(scope: PlanScope, all: ChapterUnit[]): ChapterUnit[] {
  const order = new Map(BOOKS.map((b) => [b.id, b.order]));
  const units = all
    .filter((u) => scopeIncludes(scope, u.bookId))
    .sort((a, b) => order.get(a.bookId)! - order.get(b.bookId)! || a.chapter - b.chapter);
  if (scope.kind !== 'salmos-proverbios') return units;
  const sl = units.filter((u) => u.bookId === 'salmos');
  const pr = units.filter((u) => u.bookId === 'proverbios');
  const out: ChapterUnit[] = [];
  const ratio = sl.length / Math.max(1, pr.length); // ~5 salmos por capítulo de Provérbios
  let p = 0;
  sl.forEach((u, i) => {
    out.push(u);
    while (p < pr.length && (i + 1) / ratio >= p + 1) out.push(pr[p++]);
  });
  while (p < pr.length) out.push(pr[p++]);
  return out;
}

export function isReadingDay(config: Pick<PlanConfig, 'weekdays'>, date: ISODate): boolean {
  return config.weekdays.includes(weekday(date));
}

/** Quantos dias de leitura existem entre `from` e `to` (inclusive). */
export function readingDaysBetween(weekdays: number[], from: ISODate, to: ISODate): number {
  const total = diffDays(from, to) + 1;
  if (total <= 0 || weekdays.length === 0) return 0;
  const full = Math.floor(total / 7);
  let count = full * weekdays.length;
  const startWd = weekday(from);
  for (let i = 0; i < total % 7; i++) if (weekdays.includes((startWd + i) % 7)) count++;
  return count;
}

/** A data do n-ésimo dia de leitura a partir de `from` (n = 1 é o primeiro). */
export function nthReadingDay(weekdays: number[], from: ISODate, n: number): ISODate {
  if (weekdays.length === 0) throw new Error('Plano sem dias de leitura');
  let d = from;
  let seen = 0;
  for (;;) {
    if (weekdays.includes(weekday(d))) {
      seen++;
      if (seen >= n) return d;
    }
    d = addDays(d, 1);
  }
}

/** Pega capítulos em ordem até chegar o mais perto possível de `target` minutos (ao menos 1). */
export function takeForTarget(units: ChapterUnit[], target: number): ChapterUnit[] {
  const out: ChapterUnit[] = [];
  let sum = 0;
  for (const u of units) {
    if (out.length === 0) {
      out.push(u);
      sum += u.minutes;
      continue;
    }
    if (Math.abs(sum + u.minutes - target) < Math.abs(sum - target)) {
      out.push(u);
      sum += u.minutes;
    } else break;
  }
  return out;
}

const totalMinutes = (us: ChapterUnit[]) => us.reduce((s, u) => s + u.minutes, 0);

/** Ritmo original do plano (minutos por dia de leitura). */
export function originalPace(config: PlanConfig, units: ChapterUnit[]): number {
  if (config.mode === 'ritmo') return config.minutesPerDay ?? 10;
  const days = readingDaysBetween(config.weekdays, config.startDate, config.endDate ?? config.startDate);
  return totalMinutes(units) / Math.max(1, days);
}

export type DayStatus =
  | 'em-dia' // tudo certo
  | 'ajustado' // a pessoa atrasou e o plano se reorganizou
  | 'adiantado' // leu mais do que o previsto
  | 'dia-livre' // hoje não é dia de leitura
  | 'concluido';

export interface TodayPlan {
  status: DayStatus;
  /** Leitura sugerida para hoje (inclui o que já foi lido hoje). */
  chapters: ChapterUnit[];
  /** Capítulos de hoje já lidos. */
  doneToday: number;
  minutes: number;
  totalChapters: number;
  readChapters: number;
  remainingMinutes: number;
  /** Minutos por dia de leitura daqui para frente. */
  pace: number;
  originalPace: number;
  /** Quando o plano deve terminar, no ritmo atual. */
  projectedEnd: ISODate;
  /** Prazo já passou e ainda falta leitura. */
  pastDeadline: boolean;
}

/**
 * Leitura de hoje.
 * @param readBeforeToday capítulos (chapterKey) lidos antes de hoje
 * @param readToday capítulos (chapterKey) lidos hoje
 */
export function planForDay(
  config: PlanConfig,
  units: ChapterUnit[],
  readBeforeToday: ReadonlySet<string>,
  readToday: ReadonlySet<string>,
  date: ISODate,
): TodayPlan {
  const orig = originalPace(config, units);
  const remaining = units.filter((u) => !readBeforeToday.has(chapterKey(u)));
  const readCount = units.length - remaining.length + remaining.filter((u) => readToday.has(chapterKey(u))).length;
  const remainingMinutes = totalMinutes(remaining);
  const base = {
    totalChapters: units.length,
    readChapters: readCount,
    originalPace: orig,
  };

  if (remaining.length === 0 || remaining.every((u) => readToday.has(chapterKey(u)))) {
    return {
      ...base,
      status: 'concluido',
      chapters: remaining,
      doneToday: remaining.length,
      minutes: totalMinutes(remaining),
      remainingMinutes: 0,
      pace: orig,
      projectedEnd: date,
      pastDeadline: false,
    };
  }

  const start = date < config.startDate ? config.startDate : date;
  let pace: number;
  let pastDeadline = false;
  if (config.mode === 'prazo' && config.endDate) {
    const daysLeft = readingDaysBetween(config.weekdays, start, config.endDate);
    if (daysLeft <= 0) {
      pastDeadline = true;
      pace = orig;
    } else {
      pace = remainingMinutes / daysLeft;
    }
  } else {
    pace = orig;
  }

  const readingDay = isReadingDay(config, date) && date >= config.startDate;
  const chapters = readingDay ? takeForTarget(remaining, pace) : [];
  // Se hoje já leu além do sugerido, mostra tudo o que leu.
  const readTodayUnits = remaining.filter((u) => readToday.has(chapterKey(u)));
  const shown = [...chapters];
  for (const u of readTodayUnits) if (!shown.some((c) => chapterKey(c) === chapterKey(u))) shown.push(u);
  const doneToday = shown.filter((u) => readToday.has(chapterKey(u))).length;

  const daysNeeded = Math.max(1, Math.ceil(remainingMinutes / Math.max(pace, 0.1) - 0.05));
  const firstDay = readingDay ? date : addDays(date, 1);
  const projectedEnd =
    config.mode === 'prazo' && config.endDate && !pastDeadline
      ? config.endDate
      : nthReadingDay(config.weekdays, firstDay < config.startDate ? config.startDate : firstDay, daysNeeded);

  let status: DayStatus = 'em-dia';
  if (!readingDay) status = 'dia-livre';
  else if (pastDeadline || pace > orig * 1.15) status = 'ajustado';
  else if (pace < orig * 0.85) status = 'adiantado';

  return {
    ...base,
    status,
    chapters: shown,
    doneToday,
    minutes: totalMinutes(shown),
    remainingMinutes,
    pace,
    projectedEnd,
    pastDeadline,
  };
}

/**
 * Nova data final mantendo o ritmo original: usada quando a pessoa prefere
 * "seguir no meu ritmo" em vez de ler mais por dia.
 */
export function extendedEndDate(
  config: PlanConfig,
  units: ChapterUnit[],
  read: ReadonlySet<string>,
  date: ISODate,
): ISODate {
  const remaining = units.filter((u) => !read.has(chapterKey(u)));
  const pace = originalPace(config, units);
  const days = Math.max(1, Math.ceil(totalMinutes(remaining) / pace - 0.05));
  return nthReadingDay(config.weekdays, date, days);
}

export interface PlanPreview {
  totalChapters: number;
  totalMinutes: number;
  /** Minutos por dia de leitura. */
  dailyMinutes: number;
  endDate: ISODate;
  readingDays: number;
}

export function previewPlan(config: Omit<PlanConfig, 'id'>, all: ChapterUnit[]): PlanPreview {
  const units = unitsForScope(config.scope, all);
  const total = totalMinutes(units);
  if (config.mode === 'prazo') {
    const endDate = config.endDate ?? config.startDate;
    const days = Math.max(1, readingDaysBetween(config.weekdays, config.startDate, endDate));
    return { totalChapters: units.length, totalMinutes: total, dailyMinutes: total / days, endDate, readingDays: days };
  }
  const pace = config.minutesPerDay ?? 10;
  const days = Math.max(1, Math.ceil(total / pace - 0.05));
  return {
    totalChapters: units.length,
    totalMinutes: total,
    dailyMinutes: pace,
    endDate: nthReadingDay(config.weekdays, config.startDate, days),
    readingDays: days,
  };
}
