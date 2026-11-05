/**
 * Consultas ao banco bíblico (somente leitura), gerado por scripts/bible/build.mts.
 */
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useMemo } from 'react';

import type { ChapterUnit } from '@/lib/plan/engine';

export interface Verse {
  verse: number;
  text: string;
  /** Motivos de suspeita, separados por espaço ('' = ok). */
  flags: string;
}

export interface ChapterInfo {
  bookId: string;
  chapter: number;
  verseCount: number;
  minutes: number;
  reviewed: boolean;
  suspectCount: number;
  missingCount: number;
}

/** Flags que indicam problema visível no texto (as demais são só "conferir"). */
const VISIBLE_FLAGS = ['ausente', 'divergente', 'nota', 'digito', 'palavras', 'longo', 'curto'];

export function hasVisibleIssue(flags: string): boolean {
  if (!flags) return false;
  return flags.split(' ').some((f) => VISIBLE_FLAGS.includes(f));
}

export function getVerses(db: SQLiteDatabase, bookId: string, chapter: number, from?: number, to?: number): Verse[] {
  if (from !== undefined) {
    return db.getAllSync<Verse>(
      'SELECT verse, text, flags FROM verses WHERE book_id = ? AND chapter = ? AND verse BETWEEN ? AND ? ORDER BY verse',
      bookId,
      chapter,
      from,
      to ?? from,
    );
  }
  return db.getAllSync<Verse>(
    'SELECT verse, text, flags FROM verses WHERE book_id = ? AND chapter = ? ORDER BY verse',
    bookId,
    chapter,
  );
}

export function getChapterInfo(db: SQLiteDatabase, bookId: string, chapter: number): ChapterInfo | null {
  const r = db.getFirstSync<{
    verse_count: number;
    minutes: number;
    reviewed: number;
    suspect_count: number;
    missing_count: number;
  }>('SELECT verse_count, minutes, reviewed, suspect_count, missing_count FROM chapters WHERE book_id = ? AND chapter = ?', bookId, chapter);
  if (!r) return null;
  return {
    bookId,
    chapter,
    verseCount: r.verse_count,
    minutes: r.minutes,
    reviewed: r.reviewed === 1,
    suspectCount: r.suspect_count,
    missingCount: r.missing_count,
  };
}

/** Todos os capítulos com o tempo estimado de leitura (para o motor do plano). */
export function getAllChapterUnits(db: SQLiteDatabase): ChapterUnit[] {
  return db
    .getAllSync<{ book_id: string; chapter: number; minutes: number }>('SELECT book_id, chapter, minutes FROM chapters')
    .map((r) => ({ bookId: r.book_id, chapter: r.chapter, minutes: Math.max(0.5, r.minutes) }));
}

export function useChapterUnits(): ChapterUnit[] {
  const db = useSQLiteContext();
  return useMemo(() => getAllChapterUnits(db), [db]);
}

export interface SearchHit {
  bookId: string;
  chapter: number;
  verse: number;
  snippet: string;
}

/** Busca por palavras (ignora acentos), em ordem canônica. */
export function searchVerses(db: SQLiteDatabase, query: string, limit = 100): SearchHit[] {
  const terms = query
    .normalize('NFC')
    .replace(/["*():^]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => `"${t}"*`);
  if (!terms.length) return [];
  try {
    return searchFts(db, terms, limit);
  } catch {
    // SQLite sem FTS5 (ex.: versão web usada em testes): busca simples.
    const words = query.split(/\s+/).filter((t) => t.length > 1);
    return db
      .getAllSync<{ book_id: string; chapter: number; verse: number; text: string }>(
        `SELECT v.book_id, v.chapter, v.verse, v.text FROM verses v JOIN books b ON b.id = v.book_id
         WHERE ${words.map(() => 'v.text LIKE ?').join(' AND ')} ORDER BY b.ord, v.chapter, v.verse LIMIT ?`,
        ...words.map((w) => `%${w}%`),
        limit,
      )
      .map((r) => ({ bookId: r.book_id, chapter: r.chapter, verse: r.verse, snippet: r.text }));
  }
}

function searchFts(db: SQLiteDatabase, terms: string[], limit: number): SearchHit[] {
  return db
    .getAllSync<{ book_id: string; chapter: number; verse: number; snippet: string }>(
      `SELECT v.book_id, v.chapter, v.verse,
              snippet(verses_fts, 0, '[', ']', '…', 18) AS snippet
       FROM verses_fts JOIN verses v ON v.id = verses_fts.rowid
       JOIN books b ON b.id = v.book_id
       WHERE verses_fts MATCH ?
       ORDER BY b.ord, v.chapter, v.verse
       LIMIT ?`,
      terms.join(' '),
      limit,
    )
    .map((r) => ({ bookId: r.book_id, chapter: r.chapter, verse: r.verse, snippet: r.snippet }));
}

export function getMeta(db: SQLiteDatabase): Record<string, string> {
  return Object.fromEntries(
    db.getAllSync<{ key: string; value: string }>('SELECT key, value FROM meta').map((r) => [r.key, r.value]),
  );
}
