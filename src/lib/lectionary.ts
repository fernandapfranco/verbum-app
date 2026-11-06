/**
 * Evangelho do dia: descobre o dia litúrgico (com as regras do Brasil) e
 * devolve a referência do Evangelho segundo o Lecionário (src/content/lectionary.ts).
 *
 * Regras do Brasil consideradas: Epifania no domingo entre 2 e 8/1; Ascensão no
 * 7º Domingo da Páscoa; São Pedro e São Paulo, Assunção e Todos os Santos no
 * domingo seguinte; Nossa Senhora Aparecida (12/10) é solenidade.
 * Memórias de santos usam o Evangelho do dia de semana (como no Lecionário).
 */
import { GOSPELS } from '../content/lectionary';

import { addDays, diffDays, type ISODate, parseISODate, weekday } from './dates';
import { adventStart, baptismOfTheLord, epiphany, yearDates } from './liturgy';

export type Cycle = 'A' | 'B' | 'C';

export interface GospelOfDay {
  key: string;
  /** Nome do dia litúrgico. */
  title: string;
  ref: string;
  cycle: Cycle;
}

const DAY_KEY = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const DAY_NAME = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const ord = (n: number) => `${n}º`;
const ordF = (n: number) => `${n}ª`;

/** Ciclo dominical: o ano litúrgico que termina em `y` é A se y%3==1, B se 2, C se 0. */
export function sundayCycle(date: ISODate): Cycle {
  const y = parseISODate(date).getFullYear();
  const endYear = date >= adventStart(y) ? y + 1 : y;
  return (['C', 'A', 'B'] as const)[endYear % 3];
}

/** Domingo seguinte (ou o próprio dia, se já for domingo). */
const sundayOnOrAfter = (d: ISODate) => addDays(d, (7 - weekday(d)) % 7);

interface Fixed {
  title: string;
  /** solenidade/festa do Senhor vence domingo do Tempo Comum; festa de santo, não. */
  rank: 'solenidade' | 'festa-senhor' | 'festa';
}

const FIXED: Record<string, Fixed> = {
  '01-01': { title: 'Santa Maria, Mãe de Deus', rank: 'solenidade' },
  '01-25': { title: 'Conversão de São Paulo', rank: 'festa' },
  '02-02': { title: 'Apresentação do Senhor', rank: 'festa-senhor' },
  '02-22': { title: 'Cátedra de São Pedro', rank: 'festa' },
  '03-19': { title: 'São José, esposo de Maria', rank: 'solenidade' },
  '03-25': { title: 'Anunciação do Senhor', rank: 'solenidade' },
  '04-25': { title: 'São Marcos, evangelista', rank: 'festa' },
  '05-03': { title: 'São Filipe e São Tiago, apóstolos', rank: 'festa' },
  '05-14': { title: 'São Matias, apóstolo', rank: 'festa' },
  '05-31': { title: 'Visitação de Nossa Senhora', rank: 'festa' },
  '06-24': { title: 'Nascimento de São João Batista', rank: 'solenidade' },
  '07-03': { title: 'São Tomé, apóstolo', rank: 'festa' },
  '07-22': { title: 'Santa Maria Madalena', rank: 'festa' },
  '07-25': { title: 'São Tiago, apóstolo', rank: 'festa' },
  '08-06': { title: 'Transfiguração do Senhor', rank: 'festa-senhor' },
  '08-10': { title: 'São Lourenço', rank: 'festa' },
  '08-24': { title: 'São Bartolomeu, apóstolo', rank: 'festa' },
  '09-08': { title: 'Natividade de Nossa Senhora', rank: 'festa' },
  '09-14': { title: 'Exaltação da Santa Cruz', rank: 'festa-senhor' },
  '09-21': { title: 'São Mateus, apóstolo e evangelista', rank: 'festa' },
  '09-29': { title: 'São Miguel, São Gabriel e São Rafael, arcanjos', rank: 'festa' },
  '10-12': { title: 'Nossa Senhora da Conceição Aparecida', rank: 'solenidade' },
  '10-18': { title: 'São Lucas, evangelista', rank: 'festa' },
  '10-28': { title: 'São Simão e São Judas, apóstolos', rank: 'festa' },
  '11-02': { title: 'Comemoração de todos os fiéis defuntos', rank: 'solenidade' },
  '11-09': { title: 'Dedicação da Basílica do Latrão', rank: 'festa-senhor' },
  '11-30': { title: 'Santo André, apóstolo', rank: 'festa' },
  '12-08': { title: 'Imaculada Conceição de Nossa Senhora', rank: 'solenidade' },
  '12-25': { title: 'Natal do Senhor', rank: 'solenidade' },
  '12-26': { title: 'Santo Estêvão, primeiro mártir', rank: 'festa' },
  '12-27': { title: 'São João, apóstolo e evangelista', rank: 'festa' },
  '12-28': { title: 'Santos Inocentes, mártires', rank: 'festa' },
};

const md = (d: ISODate) => d.slice(5);

/** Solenidades transferidas para o domingo no Brasil. */
function brazilSundaySolemnity(date: ISODate): { key: string; title: string } | null {
  const y = parseISODate(date).getFullYear();
  const moved: [string, string, string][] = [
    ['06-29', 'fixo:06-29', 'São Pedro e São Paulo, apóstolos'],
    ['08-15', 'fixo:08-15', 'Assunção de Nossa Senhora'],
    ['11-01', 'fixo:11-01', 'Todos os Santos'],
  ];
  for (const [mmdd, key, title] of moved) if (sundayOnOrAfter(`${y}-${mmdd}`) === date) return { key, title };
  return null;
}

/** Dia litúrgico "de tempo" (sem considerar santos e festas de data fixa). */
function temporal(date: ISODate, cycle: Cycle): { key: string; title: string } | null {
  const year = parseISODate(date).getFullYear();
  const wd = weekday(date);
  const y = yearDates(year);
  const advent = adventStart(year);
  const baptism = baptismOfTheLord(year);
  const ep = epiphany(year);
  const day = DAY_KEY[wd];
  const dayName = DAY_NAME[wd];

  // Natal até o Batismo (início do ano)
  if (date <= baptism) {
    if (date === baptism) return { key: `festa:batismo:${cycle}`, title: 'Batismo do Senhor' };
    if (date === ep) return { key: 'festa:epifania', title: 'Epifania do Senhor' };
    if (date === `${year}-01-01`) return { key: 'fixo:01-01', title: FIXED['01-01'].title };
    if (date < ep) return { key: `sem:natal-jan-${parseISODate(date).getDate()}`, title: `${dayName} do Tempo do Natal` };
    return { key: `sem:apos-epifania-${day}`, title: `${dayName} depois da Epifania` };
  }
  // Natal (fim do ano)
  if (date >= `${year}-12-25`) {
    if (date === `${year}-12-25`) return { key: 'fixo:12-25', title: 'Natal do Senhor' };
    const sundayInOctave = [26, 27, 28, 29, 30, 31].map((d) => `${year}-12-${d}`).find((d) => weekday(d) === 0);
    const holyFamily = sundayInOctave ?? `${year}-12-30`;
    if (date === holyFamily) return { key: `festa:sagrada-familia:${cycle}`, title: 'Sagrada Família' };
    return { key: `sem:natal-dez-${parseISODate(date).getDate()}`, title: `${parseISODate(date).getDate()} de dezembro, Oitava do Natal` };
  }
  // Advento
  if (date >= advent) {
    const week = Math.floor(diffDays(advent, date) / 7) + 1;
    if (wd === 0) return { key: `dom:advento-${week}:${cycle}`, title: `${ord(week)} Domingo do Advento` };
    const dd = parseISODate(date).getDate();
    if (date.slice(5, 7) === '12' && dd >= 17) return { key: `sem:advento-dez-${dd}`, title: `${dd} de dezembro, Advento` };
    return { key: `sem:advento-${week}-${day}`, title: `${dayName} da ${ordF(week)} Semana do Advento` };
  }
  // Quaresma e Semana Santa
  if (date >= y.ashWednesday && date < y.easter) {
    if (date === y.ashWednesday) return { key: 'festa:cinzas', title: 'Quarta-feira de Cinzas' };
    if (date === y.palmSunday) return { key: `festa:ramos:${cycle}`, title: 'Domingo de Ramos e da Paixão' };
    if (date === y.holyThursday) return { key: 'festa:quinta-santa', title: 'Quinta-feira Santa (Ceia do Senhor)' };
    if (date === y.goodFriday) return { key: 'festa:sexta-santa', title: 'Sexta-feira da Paixão' };
    if (date === addDays(y.easter, -1)) return null; // Sábado Santo: não há Missa durante o dia
    if (date > y.palmSunday) return { key: `sem:santa-${day}`, title: `${dayName} Santa` };
    const firstSunday = addDays(y.ashWednesday, 4);
    if (date < firstSunday) return { key: `sem:quaresma-0-${day}`, title: `${dayName} depois das Cinzas` };
    const week = Math.floor(diffDays(firstSunday, date) / 7) + 1;
    if (wd === 0) return { key: `dom:quaresma-${week}:${cycle}`, title: `${ord(week)} Domingo da Quaresma` };
    return { key: `sem:quaresma-${week}-${day}`, title: `${dayName} da ${ordF(week)} Semana da Quaresma` };
  }
  // Tempo Pascal
  if (date >= y.easter && date <= y.pentecost) {
    if (date === y.easter) return { key: 'festa:pascoa', title: 'Domingo de Páscoa' };
    if (date === y.pentecost) return { key: 'festa:pentecostes', title: 'Pentecostes' };
    const week = Math.floor(diffDays(y.easter, date) / 7) + 1;
    if (wd === 0) {
      if (week === 7) return { key: `festa:ascensao:${cycle}`, title: 'Ascensão do Senhor' };
      return { key: `dom:pascoa-${week}:${cycle}`, title: `${ord(week)} Domingo da Páscoa` };
    }
    if (week === 1) return { key: `sem:pascoa-1-${day}`, title: `${dayName} da Oitava da Páscoa` };
    return { key: `sem:pascoa-${week}-${day}`, title: `${dayName} da ${ordF(week)} Semana da Páscoa` };
  }
  // Tempo Comum
  const trinity = addDays(y.pentecost, 7);
  if (date === addDays(y.pentecost, 1)) return { key: 'festa:maria-mae-da-igreja', title: 'Maria, Mãe da Igreja' };
  if (date === trinity) return { key: `festa:trindade:${cycle}`, title: 'Santíssima Trindade' };
  if (date === addDays(trinity, 4)) return { key: `festa:corpus-christi:${cycle}`, title: 'Corpus Christi' };
  if (date === addDays(trinity, 12)) return { key: `festa:sagrado-coracao:${cycle}`, title: 'Sagrado Coração de Jesus' };
  let week: number;
  if (date < y.ashWednesday) {
    const baptismSunday = addDays(baptism, -weekday(baptism));
    week = Math.floor(diffDays(baptismSunday, date) / 7) + 1;
  } else {
    const sunday = addDays(date, -wd);
    week = 34 - (diffDays(sunday, advent) / 7 - 1);
  }
  if (wd === 0) {
    if (week === 34) return { key: `festa:cristo-rei:${cycle}`, title: 'Nosso Senhor Jesus Cristo, Rei do Universo' };
    return { key: `dom:comum-${week}:${cycle}`, title: `${ord(week)} Domingo do Tempo Comum` };
  }
  return { key: `sem:comum-${week}-${day}`, title: `${dayName} da ${ordF(week)} Semana do Tempo Comum` };
}

/** Solenidades de data fixa que caem em dias "fortes" mudam de dia. */
function movedSolemnity(date: ISODate): string | null {
  const year = parseISODate(date).getFullYear();
  const y = yearDates(year);
  const imm = `${year}-12-08`;
  if (date === (weekday(imm) === 0 ? addDays(imm, 1) : imm)) return '12-08';
  const joseph = `${year}-03-19`;
  let josephDay = joseph;
  if (joseph >= y.palmSunday && joseph <= addDays(y.easter, 7)) josephDay = addDays(y.palmSunday, -1);
  else if (weekday(joseph) === 0 && joseph >= y.ashWednesday) josephDay = addDays(joseph, 1);
  if (date === josephDay) return '03-19';
  const ann = `${year}-03-25`;
  let annDay = ann;
  if (ann >= y.palmSunday && ann <= addDays(y.easter, 7)) annDay = addDays(y.easter, 8);
  else if (weekday(ann) === 0 && ann >= y.ashWednesday) annDay = addDays(ann, 1);
  if (date === annDay) return '03-25';
  return null;
}

export function gospelOfDay(date: ISODate): GospelOfDay | null {
  const cycle = sundayCycle(date);
  const wd = weekday(date);
  const year = parseISODate(date).getFullYear();
  const y = yearDates(year);
  // Semana Santa, Oitava da Páscoa e as férias maiores do Advento (17 a 24/12) não cedem a festas.
  const strong = (date >= y.palmSunday && date <= addDays(y.easter, 7)) || (date >= `${year}-12-17` && date <= `${year}-12-24`);
  const t = temporal(date, cycle);
  const isTemporalFeast = t?.key.startsWith('festa:') || t?.key.startsWith('fixo:');
  const isStrongSunday = wd === 0 && t && /dom:(advento|quaresma|pascoa)/.test(t.key);

  let chosen: { key: string; title: string } | null = t;

  const br = brazilSundaySolemnity(date);
  if (br && !isStrongSunday && !isTemporalFeast) chosen = br;

  const moved = movedSolemnity(date);
  const mmdd = moved ?? md(date);
  const fx = FIXED[mmdd];
  // Solenidades/festas de data fixa (exceto as transferidas acima, tratadas por data)
  if (fx && !['03-19', '03-25', '12-08'].includes(md(date)) || (fx && moved)) {
    const canReplace =
      fx.rank === 'solenidade'
        ? !isStrongSunday && !(isTemporalFeast && t?.key !== `fixo:${mmdd}`)
        : fx.rank === 'festa-senhor'
          ? !isStrongSunday && !isTemporalFeast && !strong
          : wd !== 0 && !isTemporalFeast && !strong;
    if (canReplace && GOSPELS[`fixo:${mmdd}`]) chosen = { key: `fixo:${mmdd}`, title: fx.title };
  }

  if (!chosen) return null;
  const ref = GOSPELS[chosen.key] ?? GOSPELS[chosen.key.replace(/:[ABC]$/, '')];
  if (!ref) return null;
  return { key: chosen.key, title: chosen.title, ref, cycle };
}
