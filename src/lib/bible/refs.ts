/**
 * Leitura de referências bíblicas no padrão brasileiro:
 *   "Mc 1,14-20" · "Mt 9,35–10,1.5a.6-8" · "Jo 13,31-33a.34-35" · "Jo 18,1–19,42"
 * Letras de meio versículo (a, b, c) são ignoradas: o versículo inteiro é incluído.
 */
import { findBookByAbbrev } from './books';

export interface RefSpan {
  chapter: number;
  from: number;
  /** Último versículo; `null` = até o fim do capítulo. */
  to: number | null;
}

export interface ParsedRef {
  bookId: string;
  spans: RefSpan[];
}

const num = (s: string) => Number(s.replace(/[a-z]+$/i, ''));

export function parseRef(ref: string): ParsedRef {
  const m = ref.trim().match(/^(\d?\s?[A-Za-zÀ-ú]+)\s+(.+)$/);
  if (!m) throw new Error(`Referência inválida: ${ref}`);
  const book = findBookByAbbrev(m[1].replace(/\s/g, ''));
  if (!book) throw new Error(`Livro desconhecido: ${m[1]}`);
  const body = m[2].replace(/\s+/g, '').replace(/[—–]/g, '~');

  const spans: RefSpan[] = [];
  let chapter = 0;
  for (const part of body.split(/[.;]/).filter(Boolean)) {
    // "35~10,1": vai do versículo 35 do capítulo atual até 10,1
    const cross = part.match(/^(?:(\d+),)?(\d+[a-z]?)~(\d+),(\d+[a-z]?)$/i);
    if (cross) {
      if (cross[1]) chapter = Number(cross[1]);
      const endChapter = Number(cross[3]);
      spans.push({ chapter, from: num(cross[2]), to: null });
      for (let c = chapter + 1; c < endChapter; c++) spans.push({ chapter: c, from: 1, to: null });
      spans.push({ chapter: endChapter, from: 1, to: num(cross[4]) });
      chapter = endChapter;
      continue;
    }
    const simple = part.match(/^(?:(\d+),)?(\d+[a-z]?)(?:-(\d+[a-z]?))?$/i);
    if (!simple) throw new Error(`Trecho inválido "${part}" em ${ref}`);
    if (simple[1]) chapter = Number(simple[1]);
    const from = num(simple[2]);
    spans.push({ chapter, from, to: simple[3] ? num(simple[3]) : from });
  }
  return { bookId: book.id, spans };
}
