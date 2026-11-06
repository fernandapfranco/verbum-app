/// <reference types="node" />
/**
 * Gera assets/db/bible.db a partir do corpus de Figueiredo em JSON.
 *
 * Uso:
 *   npm run bible:build -- <pasta-A> <pasta-B>
 *
 *   pasta-A: abibliasagrada/web/data/livros   (github.com/ronaldomelofz/abibliasagrada)
 *            um JSON por livro: { id, capitulos: [{ n, versiculos: [{ n, t }] }] }
 *   pasta-B: biblia-chat-server/corpus         (github.com/gpadova/biblia-chat-server)
 *            um JSON por livro: string[][] (capítulos → versículos) + books-manifest.json
 *
 * São duas leituras de OCR independentes da mesma edição de 1950. O texto final
 * de cada versículo é a combinação das duas (ver merge.ts).
 * Notas de rodapé, títulos de capítulo e introduções da edição de 1950 são
 * DESCARTADOS de propósito: são de autores modernos e protegidos por direito
 * autoral. Só o texto bíblico (domínio público) entra no banco.
 *
 * Saídas:
 *   assets/db/bible.db                       banco somente leitura usado pelo app
 *   content/bible/revisao/suspeitos.csv      versículos para revisão humana
 *   docs/qualidade-do-texto.md               resumo da qualidade por livro
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { DatabaseSync } from 'node:sqlite';
import { decodeTrie } from 'cspell-trie-lib';

import { BOOKS } from '../../src/lib/bible/books.ts';
import { mergeReadings } from './merge.ts';
import {
  cleanVerseText,
  findVerseStart,
  makeChecker,
  splitMergedVerses,
  suspicionReasons,
  type RawVerse,
} from './clean.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const WORDS_PER_MINUTE = 170;
const BUILD_VERSION = 1;

interface SourceBook {
  id: string;
  capitulos: { n: number; versiculos: RawVerse[] }[];
}


interface Corrections {
  /** Capítulos revisados por uma pessoa contra a digitalização. Ex.: "lucas 15". */
  revisados: string[];
  /** Texto corrigido manualmente. Chave: "livro capítulo:versículo". */
  versiculos: Record<string, string>;
  /** Versículos a remover (ex.: duplicados criados pelo OCR). */
  remover?: string[];
}

function loadLexicon() {
  const file = path.join(ROOT, 'node_modules/@cspell/dict-pt-br/pt_BR.trie.gz');
  const trie = decodeTrie(zlib.gunzipSync(fs.readFileSync(file)));
  const extra = new Set(
    fs
      .readFileSync(path.join(import.meta.dirname, 'palavras-extras.txt'), 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#')),
  );
  return makeChecker({ has: (w) => extra.has(w) || trie.has(w) });
}

function csvCell(s: string) {
  return `"${s.replace(/"/g, '""')}"`;
}

function median(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** Ids do corpus B → ids do app. */
const B_IDS: Record<string, string> = {
  gn: 'genesis', ex: 'exodo', lv: 'levitico', nm: 'numeros', dt: 'deuteronomio', js: 'josue',
  jz: 'juizes', rt: 'rute', '1sm': '1-samuel', '2sm': '2-samuel', '1rs': '1-reis', '2rs': '2-reis',
  '1cr': '1-cronicas', '2cr': '2-cronicas', esd: 'esdras', ne: 'neemias', tb: 'tobias', jdt: 'judite',
  et: 'ester', job: 'jo', sl: 'salmos', pr: 'proverbios', ec: 'eclesiastes', ct: 'cantico',
  sb: 'sabedoria', eclo: 'eclesiastico', is: 'isaias', jr: 'jeremias', lm: 'lamentacoes', br: 'baruc',
  ez: 'ezequiel', dn: 'daniel', os: 'oseias', jl: 'joel', am: 'amos', ab: 'abdias', jn: 'jonas',
  mq: 'miqueias', na: 'naum', hc: 'habacuc', sf: 'sofonias', ag: 'ageu', zc: 'zacarias',
  ml: 'malaquias', '1mc': '1-macabeus', '2mc': '2-macabeus', mt: 'mateus', mc: 'marcos',
  lc: 'lucas', jo: 'joao', at: 'atos', rm: 'romanos', '1co': '1-corintios', '2co': '2-corintios',
  gl: 'galatas', ef: 'efesios', fp: 'filipenses', cl: 'colossenses', '1ts': '1-tessalonicenses',
  '2ts': '2-tessalonicenses', '1tm': '1-timoteo', '2tm': '2-timoteo', tt: 'tito', fm: 'filemom',
  hb: 'hebreus', tg: 'tiago', '1pe': '1-pedro', '2pe': '2-pedro', '1jo': '1-joao', '2jo': '2-joao',
  '3jo': '3-joao', jd: 'judas', ap: 'apocalipse',
};

/** Leitura A: versículos numerados; separa os grudados. Devolve capítulo → (n → texto). */
function loadA(dir: string, id: string): Map<number, Map<number, string>> {
  const sb: SourceBook = JSON.parse(fs.readFileSync(path.join(dir, `${id}.json`), 'utf8'));
  const out = new Map<number, Map<number, string>>();
  for (const c of sb.capitulos) {
    const { verses } = splitMergedVerses(c.versiculos.map((v) => ({ ...v })));
    out.set(c.n, new Map(verses.map((v) => [v.n, v.t])));
  }
  return out;
}

/** Leitura B: arrays posicionais com "" onde o versículo grudou no anterior. */
function loadB(dir: string) {
  const manifest: { id: string; verseCounts: number[] }[] = JSON.parse(
    fs.readFileSync(path.join(dir, 'books-manifest.json'), 'utf8'),
  );
  const books = new Map<string, string[][]>();
  const counts = new Map<string, number[]>();
  for (const m of manifest) {
    const id = B_IDS[m.id];
    if (!id) throw new Error(`Livro desconhecido no corpus B: ${m.id}`);
    const chapters: string[][] = JSON.parse(fs.readFileSync(path.join(dir, `${m.id}.json`), 'utf8'));
    for (const ch of chapters) {
      for (let i = 1; i < ch.length; i++) {
        if (ch[i]?.trim()) continue;
        const split = findVerseStart(ch[i - 1] ?? '', i + 1);
        if (split) {
          ch[i - 1] = split[0];
          ch[i] = split[1];
        }
      }
    }
    books.set(id, chapters);
    counts.set(id, m.verseCounts);
  }
  return { books, counts };
}

/** Separa `prev` no ponto onde começa `next` (comparando as 4 primeiras palavras). */
function anchorSplit(prev: string, next: string): [string, string] | null {
  const norm = (t: string) => t.toLowerCase().replace(/[^\p{L}\d]/gu, '');
  const pt = prev.split(/\s+/);
  const nt = next.split(/\s+/).slice(0, 4).map(norm);
  if (nt.length < 3) return null;
  for (let i = 3; i + nt.length <= pt.length; i++) {
    if (nt.every((w, k) => norm(pt[i + k]) === w)) {
      return [pt.slice(0, i).join(' '), pt.slice(i).join(' ')];
    }
  }
  return null;
}

function main() {
  const [dirA, dirB] = process.argv.slice(2);
  if (!dirA || !dirB || !fs.existsSync(dirA) || !fs.existsSync(dirB)) {
    console.error('Uso: npm run bible:build -- <abibliasagrada/web/data/livros> <biblia-chat-server/corpus>');
    process.exit(1);
  }

  const corrections: Corrections = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'content/bible/correcoes.json'), 'utf8'),
  );
  const reviewed = new Set(corrections.revisados);
  const toRemove = new Set(corrections.remover ?? []);

  console.log('Carregando dicionário…');
  const valid = loadLexicon();

  console.log('Lendo as duas leituras…');
  const A = new Map(BOOKS.map((b) => [b.id, loadA(dirA, b.id)]));
  const { books: B, counts } = loadB(dirB);

  // Frequência das palavras: nomes próprios bíblicos não estão no dicionário,
  // mas aparecem muitas vezes no texto.
  const freq = new Map<string, number>();
  const count = (t: string) => {
    for (const w of t.match(/[\p{L}]+/gu) ?? []) freq.set(w, (freq.get(w) ?? 0) + 1);
  };
  for (const chs of A.values()) for (const vs of chs.values()) for (const t of vs.values()) count(t);
  for (const chs of B.values()) for (const vs of chs) for (const t of vs) count(t);
  const corpusWord = (w: string) => /^\p{Lu}/u.test(w) && (freq.get(w) ?? 0) >= 6;
  const lowerFreq = new Map<string, number>();
  for (const [w, n] of freq) lowerFreq.set(w.toLowerCase(), (lowerFreq.get(w.toLowerCase()) ?? 0) + n);
  const corpusFreq = (w: string) => lowerFreq.get(w) ?? 0;
  const bigrams = new Map<string, number>();
  const countPairs = (t: string) => {
    const ws = t.toLowerCase().match(/[\p{L}]+/gu) ?? [];
    for (let i = 0; i + 1 < ws.length; i++) {
      const k = ws[i] + ' ' + ws[i + 1];
      bigrams.set(k, (bigrams.get(k) ?? 0) + 1);
    }
  };
  for (const chs of A.values()) for (const vs of chs.values()) for (const t of vs.values()) countPairs(t);
  for (const chs of B.values()) for (const vs of chs) for (const t of vs) countPairs(t);
  const corpusBigram = (a: string, b: string) => bigrams.get(a + ' ' + b) ?? 0;
  const knownForMerge = (w: string) => valid(w) || corpusWord(w);

  const outDb = path.join(ROOT, 'assets/db/bible.db');
  fs.mkdirSync(path.dirname(outDb), { recursive: true });
  if (fs.existsSync(outDb)) fs.rmSync(outDb);
  const db = new DatabaseSync(outDb);
  db.exec(`
    PRAGMA journal_mode = DELETE;
    CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE books (
      id TEXT PRIMARY KEY, ord INTEGER NOT NULL, name TEXT NOT NULL, short_name TEXT NOT NULL,
      abbrev TEXT NOT NULL, old_name TEXT, testament TEXT NOT NULL, grp TEXT NOT NULL,
      chapters INTEGER NOT NULL, deutero INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE chapters (
      book_id TEXT NOT NULL, chapter INTEGER NOT NULL, verse_count INTEGER NOT NULL,
      words INTEGER NOT NULL, minutes REAL NOT NULL,
      reviewed INTEGER NOT NULL DEFAULT 0, suspect_count INTEGER NOT NULL DEFAULT 0,
      missing_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (book_id, chapter)
    );
    CREATE TABLE verses (
      id INTEGER PRIMARY KEY, book_id TEXT NOT NULL, chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL, text TEXT NOT NULL, flags TEXT NOT NULL DEFAULT ''
    );
    CREATE UNIQUE INDEX verses_ref ON verses (book_id, chapter, verse);
    CREATE VIRTUAL TABLE verses_fts USING fts5(
      text, content='verses', content_rowid='id', tokenize='unicode61 remove_diacritics 2'
    );
  `);

  const insBook = db.prepare('INSERT INTO books VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insChapter = db.prepare('INSERT INTO chapters VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insVerse = db.prepare(
    'INSERT INTO verses (book_id, chapter, verse, text, flags) VALUES (?, ?, ?, ?, ?)',
  );

  const report: string[] = [];
  const csv: string[] = ['referencia,motivos,texto'];
  let totalVerses = 0;
  let totalSuspect = 0;
  let totalMissing = 0;

  db.exec('BEGIN');
  for (const b of BOOKS) {
    insBook.run(
      b.id, b.order, b.name, b.shortName, b.abbrev, b.oldName ?? null,
      b.testament, b.group, b.chapters, b.deuterocanonical ? 1 : 0,
    );
    const a = A.get(b.id)!;
    const bb = B.get(b.id) ?? [];
    const vc = counts.get(b.id) ?? [];
    let bookVerses = 0;
    let bookSuspect = 0;
    let bookMissing = 0;

    for (let c = 1; c <= b.chapters; c++) {
      const aCh = a.get(c) ?? new Map<number, string>();
      const bCh = bb[c - 1] ?? [];
      const n = vc[c - 1] ?? Math.max(bCh.length, ...aCh.keys());
      const chapKey = `${b.id} ${c}`;
      const isReviewed = reviewed.has(chapKey);

      // Limpa as duas leituras e usa o começo do versículo de uma para achar,
      // na outra, o versículo que ficou grudado no anterior sem número.
      const clean = (t: string | undefined) => (t?.trim() ? cleanVerseText(t, { valid, corpusWord, corpusFreq, corpusBigram }).text : '');
      const ca: string[] = [];
      const cb: string[] = [];
      for (let v = 1; v <= n; v++) {
        ca[v] = clean(aCh.get(v));
        cb[v] = clean(bCh[v - 1]);
      }
      for (let v = 2; v <= n; v++) {
        if (!ca[v] && cb[v] && ca[v - 1]) {
          const sp = anchorSplit(ca[v - 1], cb[v]);
          if (sp) [ca[v - 1], ca[v]] = sp;
        }
        if (!cb[v] && ca[v] && cb[v - 1]) {
          const sp = anchorSplit(cb[v - 1], ca[v]);
          if (sp) [cb[v - 1], cb[v]] = sp;
        }
      }

      const merged: { n: number; text: string; flags: string[]; unknown: string[] }[] = [];
      for (let v = 1; v <= n; v++) {
        const ref = `${b.id} ${c}:${v}`;
        if (toRemove.has(ref)) continue;
        const manual = corrections.versiculos[ref];
        if (manual !== undefined) {
          merged.push({ n: v, text: manual, flags: [], unknown: [] });
          continue;
        }
        const m = mergeReadings(ca[v], cb[v], knownForMerge, corpusFreq);
        const final = cleanVerseText(m.text, { valid, corpusWord, corpusFreq, corpusBigram });
        merged.push({ n: v, text: final.text, flags: m.flags, unknown: final.unknownWords });
      }

      const med = median(merged.filter((v) => v.text).map((v) => v.text.length));
      let words = 0;
      let suspect = 0;
      let missing = 0;
      for (const v of merged) {
        const ref = `${b.id} ${c}:${v.n}`;
        const manual = corrections.versiculos[ref] !== undefined;
        let reasons: string[] = [];
        if (!v.text) {
          reasons = ['ausente'];
          missing++;
        } else if (!manual && !isReviewed) {
          reasons = [
            ...v.flags.filter((f) => f !== 'fonte-unica'),
            ...suspicionReasons(v.text, v.unknown, med),
          ];
          // Só uma leitura e já com sinais de problema: reforça a suspeita.
          if (v.flags.includes('fonte-unica') && reasons.length) reasons.push('fonte-unica');
        }
        if (reasons.length) {
          suspect++;
          csv.push([csvCell(ref), csvCell(reasons.join(' ')), csvCell(v.text)].join(','));
        }
        words += v.text ? v.text.split(/\s+/).length : 0;
        insVerse.run(b.id, c, v.n, v.text, reasons.join(' '));
      }

      insChapter.run(
        b.id, c, merged.length, words, Math.round((words / WORDS_PER_MINUTE) * 10) / 10,
        isReviewed ? 1 : 0, suspect, missing,
      );
      bookVerses += merged.length;
      bookSuspect += suspect;
      bookMissing += missing;
    }

    totalVerses += bookVerses;
    totalSuspect += bookSuspect;
    totalMissing += bookMissing;
    const pct = bookVerses ? ((bookSuspect / bookVerses) * 100).toFixed(1) : '0';
    report.push(`| ${b.shortName} | ${bookVerses} | ${bookSuspect} (${pct}%) | ${bookMissing} |`);
  }

  db.exec(`INSERT INTO verses_fts (rowid, text) SELECT id, text FROM verses WHERE text <> '';`);
  const meta = db.prepare('INSERT INTO meta VALUES (?, ?)');
  meta.run('translation', 'figueiredo');
  meta.run('translation_name', 'Bíblia Sagrada — tradução do Pe. Antônio Pereira de Figueiredo');
  meta.run(
    'source',
    'Edição de 1950, combinando duas digitalizações por OCR (github.com/ronaldomelofz/abibliasagrada e github.com/gpadova/biblia-chat-server); ortografia atualizada automaticamente',
  );
  meta.run('build_version', String(BUILD_VERSION));
  meta.run('built_at', new Date().toISOString());
  db.exec('COMMIT');
  db.exec('VACUUM');
  db.close();

  fs.mkdirSync(path.join(ROOT, 'content/bible/revisao'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'content/bible/revisao/suspeitos.csv'), csv.join('\n') + '\n');

  const pctAll = ((totalSuspect / totalVerses) * 100).toFixed(1);
  fs.writeFileSync(
    path.join(ROOT, 'docs/qualidade-do-texto.md'),
    `# Qualidade do texto bíblico

> Arquivo gerado por \`npm run bible:build\`. Não edite à mão.

- Versículos no banco: **${totalVerses}**
- Marcados para revisão humana: **${totalSuspect}** (${pctAll}%)
- Versículos que nenhuma das duas digitalizações recuperou: **${totalMissing}**
- Capítulos revisados manualmente: **${reviewed.size}**

Motivos: \`ausente\` (sem texto), \`vazamento\` (trecho de nota de rodapé
descartado — conferir se não sumiu texto bíblico), \`divergente\` (as duas
leituras discordam muito), \`nota\` (ainda parece haver nota ou cabeçalho),
\`digito\` (número no meio do texto), \`palavras\` (muitas palavras fora do
dicionário), \`longo\`/\`curto\` (tamanho anormal), \`fonte-unica\` (só uma
digitalização tinha este versículo).

A lista completa está em \`content/bible/revisao/suspeitos.csv\`.

| Livro | Versículos | Para revisão | Ausentes |
|---|---:|---:|---:|
${report.join('\n')}
`,
  );

  console.log(`Pronto: ${totalVerses} versículos, ${totalSuspect} para revisão (${pctAll}%), ${totalMissing} ausentes.`);
  console.log(`Banco: ${outDb} (${(fs.statSync(outDb).size / 1024 / 1024).toFixed(1)} MB)`);
}

main();
