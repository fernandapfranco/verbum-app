/**
 * Banco do usuário (user.db): progresso, plano, destaques, notas, diário.
 * Tudo fica só no aparelho. API síncrona: as consultas são pequenas.
 *
 * Migrações: cada item de MIGRATIONS roda uma vez, controlado por
 * PRAGMA user_version. Nunca edite uma migração já publicada — acrescente outra.
 */
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { create } from 'zustand';

import type { HighlightColor } from '@/theme/tokens';
import type { PlanConfig } from '@/lib/plan/engine';
import { today as todayISO, toISODate } from '@/lib/dates';
import {
  CANDLE_PRICE,
  checkinReward,
  currentStreak,
  MAX_CANDLES,
  reconcile,
  REWARDS,
  type Reconciliation,
  type StreakInput,
} from '@/lib/streak';

const MIGRATIONS: string[] = [
  `
  CREATE TABLE reading_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    read_on TEXT NOT NULL,          -- AAAA-MM-DD local
    read_at TEXT NOT NULL           -- ISO completo
  );
  CREATE UNIQUE INDEX reading_log_unique ON reading_log (book_id, chapter);

  CREATE TABLE plans (
    id TEXT PRIMARY KEY,
    config TEXT NOT NULL,           -- JSON de PlanConfig
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    finished_at TEXT
  );

  CREATE TABLE highlights (
    book_id TEXT NOT NULL, chapter INTEGER NOT NULL, verse INTEGER NOT NULL,
    color TEXT NOT NULL, created_at TEXT NOT NULL,
    PRIMARY KEY (book_id, chapter, verse)
  );

  CREATE TABLE favorites (
    book_id TEXT NOT NULL, chapter INTEGER NOT NULL, verse INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (book_id, chapter, verse)
  );

  CREATE TABLE notes (
    book_id TEXT NOT NULL, chapter INTEGER NOT NULL, verse INTEGER NOT NULL,
    text TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
    PRIMARY KEY (book_id, chapter, verse)
  );

  CREATE TABLE journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    ref TEXT,                       -- ex.: "lucas 15:11-32" (opcional)
    prompt TEXT,                    -- pergunta que inspirou a entrada (opcional)
    text TEXT NOT NULL
  );

  CREATE TABLE trail_progress (
    trail_id TEXT NOT NULL, lesson_id TEXT NOT NULL, completed_at TEXT NOT NULL,
    PRIMARY KEY (trail_id, lesson_id)
  );

  CREATE TABLE consent_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,             -- 'termos' | 'idade' | 'notas-pessoais'
    version TEXT NOT NULL,
    granted INTEGER NOT NULL,
    at TEXT NOT NULL
  );
  `,
  `
  -- Fase 2 (antecipada): check-in diário, ofensiva e talentos
  CREATE TABLE checkins (
    day TEXT PRIMARY KEY,           -- AAAA-MM-DD local
    at TEXT NOT NULL,
    source TEXT NOT NULL            -- 'leitura' | 'licao'
  );
  CREATE TABLE protected_days (
    day TEXT PRIMARY KEY,
    at TEXT NOT NULL
  );
  -- Extrato de talentos e velas (soma de delta = saldo)
  CREATE TABLE wallet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    currency TEXT NOT NULL,         -- 'talentos' | 'velas'
    delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    at TEXT NOT NULL
  );
  `,
];

let db: SQLiteDatabase | null = null;

export function userDb(): SQLiteDatabase {
  if (db) return db;
  db = openDatabaseSync('user.db');
  db.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    db.withTransactionSync(() => {
      db!.execSync(MIGRATIONS[version]);
      db!.execSync(`PRAGMA user_version = ${version + 1}`);
    });
    version++;
  }
  return db;
}

/** Contador que muda a cada escrita: as telas usam para recarregar dados. */
export const useDataVersion = create<{ v: number; bump: () => void }>((set, get) => ({
  v: 0,
  bump: () => set({ v: get().v + 1 }),
}));
const bump = () => useDataVersion.getState().bump();
const now = () => new Date().toISOString();

// ---------------------------------------------------------------- leitura

export interface ReadEntry {
  bookId: string;
  chapter: number;
  readOn: string;
}

export function markChapterRead(bookId: string, chapter: number) {
  userDb().runSync(
    'INSERT OR IGNORE INTO reading_log (book_id, chapter, read_on, read_at) VALUES (?, ?, ?, ?)',
    bookId,
    chapter,
    toISODate(new Date()),
    now(),
  );
  bump();
}

export function unmarkChapterRead(bookId: string, chapter: number) {
  userDb().runSync('DELETE FROM reading_log WHERE book_id = ? AND chapter = ?', bookId, chapter);
  bump();
}

export function getReadLog(): ReadEntry[] {
  return userDb()
    .getAllSync<{ book_id: string; chapter: number; read_on: string }>(
      'SELECT book_id, chapter, read_on FROM reading_log',
    )
    .map((r) => ({ bookId: r.book_id, chapter: r.chapter, readOn: r.read_on }));
}

export function isChapterRead(bookId: string, chapter: number): boolean {
  return !!userDb().getFirstSync('SELECT 1 FROM reading_log WHERE book_id = ? AND chapter = ?', bookId, chapter);
}

// ---------------------------------------------------------------- plano

export function getActivePlan(): PlanConfig | null {
  const r = userDb().getFirstSync<{ config: string }>('SELECT config FROM plans WHERE active = 1 ORDER BY created_at DESC');
  return r ? (JSON.parse(r.config) as PlanConfig) : null;
}

export function saveActivePlan(config: PlanConfig) {
  const d = userDb();
  d.withTransactionSync(() => {
    d.runSync('UPDATE plans SET active = 0 WHERE active = 1 AND id <> ?', config.id);
    d.runSync(
      `INSERT INTO plans (id, config, active, created_at) VALUES (?, ?, 1, ?)
       ON CONFLICT(id) DO UPDATE SET config = excluded.config, active = 1`,
      config.id,
      JSON.stringify(config),
      now(),
    );
  });
  bump();
}

export function endActivePlan() {
  userDb().runSync('UPDATE plans SET active = 0, finished_at = ? WHERE active = 1', now());
  bump();
}

// ---------------------------------------------------------------- versículos

export interface VerseMark {
  verse: number;
  color?: HighlightColor;
  favorite?: boolean;
  note?: string;
}

export function getChapterMarks(bookId: string, chapter: number): Map<number, VerseMark> {
  const d = userDb();
  const out = new Map<number, VerseMark>();
  const get = (v: number) => out.get(v) ?? out.set(v, { verse: v }).get(v)!;
  for (const r of d.getAllSync<{ verse: number; color: HighlightColor }>(
    'SELECT verse, color FROM highlights WHERE book_id = ? AND chapter = ?',
    bookId,
    chapter,
  ))
    get(r.verse).color = r.color;
  for (const r of d.getAllSync<{ verse: number }>(
    'SELECT verse FROM favorites WHERE book_id = ? AND chapter = ?',
    bookId,
    chapter,
  ))
    get(r.verse).favorite = true;
  for (const r of d.getAllSync<{ verse: number; text: string }>(
    'SELECT verse, text FROM notes WHERE book_id = ? AND chapter = ?',
    bookId,
    chapter,
  ))
    get(r.verse).note = r.text;
  return out;
}

export function setHighlight(bookId: string, chapter: number, verse: number, color: HighlightColor | null) {
  const d = userDb();
  if (color) {
    d.runSync(
      `INSERT INTO highlights (book_id, chapter, verse, color, created_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT DO UPDATE SET color = excluded.color`,
      bookId,
      chapter,
      verse,
      color,
      now(),
    );
  } else {
    d.runSync('DELETE FROM highlights WHERE book_id = ? AND chapter = ? AND verse = ?', bookId, chapter, verse);
  }
  bump();
}

export function setFavorite(bookId: string, chapter: number, verse: number, fav: boolean) {
  const d = userDb();
  if (fav)
    d.runSync(
      'INSERT OR IGNORE INTO favorites (book_id, chapter, verse, created_at) VALUES (?, ?, ?, ?)',
      bookId,
      chapter,
      verse,
      now(),
    );
  else d.runSync('DELETE FROM favorites WHERE book_id = ? AND chapter = ? AND verse = ?', bookId, chapter, verse);
  bump();
}

export function setNote(bookId: string, chapter: number, verse: number, text: string) {
  const d = userDb();
  const t = text.trim();
  if (t)
    d.runSync(
      `INSERT INTO notes (book_id, chapter, verse, text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT DO UPDATE SET text = excluded.text, updated_at = excluded.updated_at`,
      bookId,
      chapter,
      verse,
      t,
      now(),
      now(),
    );
  else d.runSync('DELETE FROM notes WHERE book_id = ? AND chapter = ? AND verse = ?', bookId, chapter, verse);
  bump();
}

export interface SavedVerse {
  bookId: string;
  chapter: number;
  verse: number;
  color?: HighlightColor;
  note?: string;
  favorite: boolean;
}

/** Todos os versículos marcados (destaque, favorito ou nota), em ordem de criação. */
export function listSavedVerses(): SavedVerse[] {
  const rows = userDb().getAllSync<{
    book_id: string;
    chapter: number;
    verse: number;
    color: HighlightColor | null;
    note: string | null;
    fav: number;
    at: string;
  }>(`
    SELECT book_id, chapter, verse,
           MAX(color) AS color, MAX(note) AS note, MAX(fav) AS fav, MIN(at) AS at
    FROM (
      SELECT book_id, chapter, verse, color, NULL AS note, 0 AS fav, created_at AS at FROM highlights
      UNION ALL SELECT book_id, chapter, verse, NULL, NULL, 1, created_at FROM favorites
      UNION ALL SELECT book_id, chapter, verse, NULL, text, 0, created_at FROM notes
    ) GROUP BY book_id, chapter, verse ORDER BY at DESC`);
  return rows.map((r) => ({
    bookId: r.book_id,
    chapter: r.chapter,
    verse: r.verse,
    color: r.color ?? undefined,
    note: r.note ?? undefined,
    favorite: r.fav === 1,
  }));
}

// ---------------------------------------------------------------- diário

export interface JournalEntry {
  id: number;
  createdAt: string;
  updatedAt: string;
  ref: string | null;
  prompt: string | null;
  text: string;
}

const mapJournal = (r: {
  id: number;
  created_at: string;
  updated_at: string;
  ref: string | null;
  prompt: string | null;
  text: string;
}): JournalEntry => ({
  id: r.id,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  ref: r.ref,
  prompt: r.prompt,
  text: r.text,
});

export function listJournal(): JournalEntry[] {
  return userDb().getAllSync<Parameters<typeof mapJournal>[0]>('SELECT * FROM journal ORDER BY created_at DESC').map(mapJournal);
}

export function getJournalEntry(id: number): JournalEntry | null {
  const r = userDb().getFirstSync<Parameters<typeof mapJournal>[0]>('SELECT * FROM journal WHERE id = ?', id);
  return r ? mapJournal(r) : null;
}

export function saveJournalEntry(e: { id?: number; ref?: string | null; prompt?: string | null; text: string }): number {
  const d = userDb();
  if (e.id) {
    d.runSync('UPDATE journal SET text = ?, updated_at = ? WHERE id = ?', e.text, now(), e.id);
    bump();
    return e.id;
  }
  const r = d.runSync(
    'INSERT INTO journal (created_at, updated_at, ref, prompt, text) VALUES (?, ?, ?, ?, ?)',
    now(),
    now(),
    e.ref ?? null,
    e.prompt ?? null,
    e.text,
  );
  bump();
  return Number(r.lastInsertRowId);
}

export function deleteJournalEntry(id: number) {
  userDb().runSync('DELETE FROM journal WHERE id = ?', id);
  bump();
}

/** Ao retirar o consentimento de notas pessoais, apagamos diário e notas. */
export function deletePersonalNotes() {
  const d = userDb();
  d.withTransactionSync(() => {
    d.runSync('DELETE FROM journal');
    d.runSync('DELETE FROM notes');
  });
  bump();
}

// ---------------------------------------------------------------- trilhas

export function completeLesson(trailId: string, lessonId: string) {
  userDb().runSync(
    'INSERT OR IGNORE INTO trail_progress (trail_id, lesson_id, completed_at) VALUES (?, ?, ?)',
    trailId,
    lessonId,
    now(),
  );
  bump();
}

export function getCompletedLessons(trailId: string): Set<string> {
  return new Set(
    userDb()
      .getAllSync<{ lesson_id: string }>('SELECT lesson_id FROM trail_progress WHERE trail_id = ?', trailId)
      .map((r) => r.lesson_id),
  );
}

// ---------------------------------------------------------------- consentimento e LGPD

export function logConsent(kind: 'termos' | 'idade' | 'notas-pessoais', version: string, granted: boolean) {
  userDb().runSync(
    'INSERT INTO consent_log (kind, version, granted, at) VALUES (?, ?, ?, ?)',
    kind,
    version,
    granted ? 1 : 0,
    now(),
  );
}

export function listConsentLog() {
  return userDb().getAllSync<{ kind: string; version: string; granted: number; at: string }>(
    'SELECT kind, version, granted, at FROM consent_log ORDER BY id DESC',
  );
}

/** Exporta tudo o que o app guarda (direito de acesso/portabilidade, LGPD art. 18). */
export function exportAllData(extra: Record<string, unknown>) {
  const d = userDb();
  const all = (sql: string) => d.getAllSync<Record<string, unknown>>(sql);
  return {
    exportadoEm: now(),
    app: 'Verbum',
    preferencias: extra,
    leituras: all('SELECT book_id, chapter, read_on, read_at FROM reading_log ORDER BY read_at'),
    planos: all('SELECT id, config, active, created_at, finished_at FROM plans'),
    destaques: all('SELECT * FROM highlights'),
    favoritos: all('SELECT * FROM favorites'),
    notas: all('SELECT * FROM notes'),
    diario: all('SELECT * FROM journal ORDER BY created_at'),
    trilhas: all('SELECT * FROM trail_progress'),
    checkins: all('SELECT * FROM checkins ORDER BY day'),
    diasProtegidos: all('SELECT * FROM protected_days ORDER BY day'),
    carteira: all('SELECT * FROM wallet ORDER BY id'),
    consentimentos: all('SELECT * FROM consent_log ORDER BY id'),
  };
}

/** Apaga todos os dados do usuário (direito de eliminação). */
export function wipeAllData() {
  const d = userDb();
  d.withTransactionSync(() => {
    for (const t of [
      'reading_log', 'plans', 'highlights', 'favorites', 'notes', 'journal', 'trail_progress', 'consent_log',
      'checkins', 'protected_days', 'wallet',
    ])
      d.runSync(`DELETE FROM ${t}`);
  });
  bump();
}

// ---------------------------------------------------------------- ofensiva e talentos

export function getStreakInput(): StreakInput {
  const d = userDb();
  return {
    checkins: new Set(d.getAllSync<{ day: string }>('SELECT day FROM checkins').map((r) => r.day)),
    protectedDays: new Set(d.getAllSync<{ day: string }>('SELECT day FROM protected_days').map((r) => r.day)),
  };
}

export function getBalance(): { talentos: number; velas: number } {
  const rows = userDb().getAllSync<{ currency: string; total: number }>(
    'SELECT currency, SUM(delta) AS total FROM wallet GROUP BY currency',
  );
  const get = (c: string) => rows.find((r) => r.currency === c)?.total ?? 0;
  return { talentos: get('talentos'), velas: get('velas') };
}

function addToWallet(currency: 'talentos' | 'velas', delta: number, reason: string) {
  userDb().runSync('INSERT INTO wallet (currency, delta, reason, at) VALUES (?, ?, ?, ?)', currency, delta, reason, now());
}

/** Presente de boas-vindas (uma vez só). */
export function grantWelcomeGift() {
  const d = userDb();
  if (d.getFirstSync("SELECT 1 FROM wallet WHERE reason = 'boas-vindas'")) return;
  addToWallet('velas', REWARDS.welcomeCandles, 'boas-vindas');
  bump();
}

export interface CheckinResult {
  isNew: boolean;
  streak: number;
  reward: number;
  bonus: number;
}

/**
 * Registra uma atividade concluída. A primeira do dia vira o check-in e rende
 * talentos (mais um bônus a cada 7 dias seguidos).
 */
export function recordActivity(source: 'leitura' | 'licao'): CheckinResult {
  const d = userDb();
  const day = todayISO();
  if (d.getFirstSync('SELECT 1 FROM checkins WHERE day = ?', day)) {
    return { isNew: false, streak: currentStreak(getStreakInput(), day), reward: 0, bonus: 0 };
  }
  let result: CheckinResult = { isNew: true, streak: 0, reward: 0, bonus: 0 };
  d.withTransactionSync(() => {
    d.runSync('INSERT INTO checkins (day, at, source) VALUES (?, ?, ?)', day, now(), source);
    const streak = currentStreak(getStreakInput(), day);
    const { base, bonus } = checkinReward(streak);
    addToWallet('talentos', base, `check-in ${day}`);
    if (bonus) addToWallet('talentos', bonus, `bônus ${streak} dias`);
    result = { isNew: true, streak, reward: base, bonus };
  });
  bump();
  return result;
}

/** Usa velas para cobrir dias perdidos. Chamar ao abrir o app. */
export function applyStreakProtection(): Reconciliation {
  const d = userDb();
  const r = reconcile(getStreakInput(), getBalance().velas, todayISO());
  if (r.protect.length) {
    d.withTransactionSync(() => {
      for (const day of r.protect) {
        d.runSync('INSERT OR IGNORE INTO protected_days (day, at) VALUES (?, ?)', day, now());
        addToWallet('velas', -1, `protegeu ${day}`);
      }
    });
    bump();
  }
  return r;
}

export type BuyResult = 'ok' | 'sem-talentos' | 'limite';

export function buyCandle(): BuyResult {
  const b = getBalance();
  if (b.velas >= MAX_CANDLES) return 'limite';
  if (b.talentos < CANDLE_PRICE) return 'sem-talentos';
  const d = userDb();
  d.withTransactionSync(() => {
    addToWallet('talentos', -CANDLE_PRICE, 'compra de vela');
    addToWallet('velas', 1, 'compra');
  });
  bump();
  return 'ok';
}
