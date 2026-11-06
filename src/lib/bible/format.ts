import { getBook } from './books';
import { psalmLabel } from './psalms';

/** "Marcos 3", "Salmo 23 (22)" */
export function chapterLabel(bookId: string, chapter: number): string {
  if (bookId === 'salmos') return psalmLabel(chapter);
  return `${getBook(bookId).shortName} ${chapter}`;
}

/** "Mc 1,14-20", "Sl 23(22),1-6" */
export function refLabel(bookId: string, chapter: number, from?: number, to?: number): string {
  const b = getBook(bookId);
  let ch = String(chapter);
  if (bookId === 'salmos') {
    const label = psalmLabel(chapter); // "Salmo 23 (22)"
    const m = label.match(/^Salmo (\S+)(?: \((\d+)\))?$/);
    ch = m && m[2] ? `${m[1]}(${m[2]})` : String(chapter);
  }
  if (from === undefined) return `${b.abbrev} ${ch}`;
  return `${b.abbrev} ${ch},${from}${to !== undefined && to !== from ? `-${to}` : ''}`;
}

/** "cerca de 7 min" */
export function minutesLabel(m: number): string {
  if (m < 1) return 'menos de 1 min';
  return `cerca de ${Math.round(m)} min`;
}
