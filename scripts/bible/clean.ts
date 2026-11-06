/// <reference types="node" />
/**
 * Limpeza automática do texto de Figueiredo extraído por OCR (edição de 1950).
 *
 * O que fazemos aqui é só correção mecânica — nunca reescrevemos a tradução:
 *  1. separar versículos que o OCR grudou ("... caminho. R 4 Estava João ...");
 *  2. juntar palavras partidas por fim de linha ("cami nho" → "caminho");
 *  3. separar palavras grudadas por ruído ("logo.que" → "logo que");
 *  4. atualizar a ortografia de 1943 para a atual ("êle" → "ele", "Judéia" → "Judeia")
 *     e repor acentos que o OCR perdeu ("sabios" → "sábios"), só quando o
 *     dicionário confirma uma única forma correta;
 *  5. marcar como "suspeito" o versículo que parece conter restos de notas de
 *     rodapé, cabeçalhos de página ou números perdidos, para revisão humana.
 */

export interface Lexicon {
  /** A palavra existe no dicionário de português atual? */
  has(word: string): boolean;
}

export interface RawVerse {
  n: number;
  t: string;
}

const UPPER = 'A-ZÁÉÍÓÚÂÊÔÃÕÀÇÜ';
const LETTER = 'A-Za-zÁÉÍÓÚÂÊÔÃÕÀÇÜáéíóúâêôãõàçüèìòùäëïö';

// ---------------------------------------------------------------------------
// 1. Versículos grudados
// ---------------------------------------------------------------------------

/** Formas que o OCR costuma dar a um número (1 → I/l, 0 → O, 5 → S). */
function numberPattern(n: number): { pattern: string; digitsOnly: string } {
  const map: Record<string, string> = { '1': '[1Il]', '0': '[0O]', '5': '[5S]' };
  const pattern = String(n)
    .split('')
    .map((d) => map[d] ?? d)
    .join('');
  return { pattern, digitsOnly: String(n) };
}

/**
 * Procura, dentro de `text`, o início do versículo `n` e devolve [antes, depois].
 * Exige que o número esteja isolado e seguido de texto que começa com maiúscula
 * (todo versículo de Figueiredo começa assim).
 */
export function findVerseStart(text: string, n: number): [string, string] | null {
  const { pattern } = numberPattern(n);
  const junk = `[+“”"'«»*À]?`;
  const re = new RegExp(
    `(^|\\s)(?:R\\s+)?${junk}\\s?(${pattern})([”"'.º°:%•]?)(\\s*)${junk}(?=[${UPPER}“"«(])`,
    'g',
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const token = m[2];
    const after = m[3];
    const hasRealDigit = /\d/.test(token);
    // "S. Paulo", "I. ..." não são números de versículo.
    if (!hasRealDigit && after === '.') continue;
    // Sem espaço depois do número só vale com dígito real e pontuação ("33.E").
    if (m[4] === '' && !(hasRealDigit && after)) continue;
    // Um número sem nenhum dígito real (ex.: "S", "I", "IO") só vale se não for
    // uma palavra comum como "I" isolado em início de frase.
    if (!hasRealDigit && token.length === 1 && token !== 'S') continue;
    const idx = m.index + m[1].length;
    if (idx < 3) continue; // não separa no comecinho do versículo
    const before = text.slice(0, idx).trim();
    const rest = text.slice(m.index + m[0].length).trim();
    if (rest.length < 3) continue;
    return [before, rest];
  }
  return null;
}

export interface SplitResult {
  verses: RawVerse[];
  /** Números de versículo que continuaram faltando. */
  missing: number[];
}

/** Separa versículos grudados e reporta os números que continuam faltando. */
export function splitMergedVerses(input: RawVerse[]): SplitResult {
  const out: RawVerse[] = [];
  const missing: number[] = [];
  for (const v of input) {
    if (v.n <= 0) {
      // Fragmento sem número (cabeçalho/nota): anexa ao anterior para revisão.
      if (out.length) out[out.length - 1].t += ' ' + v.t;
      continue;
    }
    const last = out[out.length - 1];
    const expected = last ? last.n + 1 : 1;
    if (last && v.n > expected) {
      for (let k = expected; k < v.n; k++) {
        const cur = out[out.length - 1];
        const split = findVerseStart(cur.t, k);
        if (split) {
          cur.t = split[0];
          out.push({ n: k, t: split[1] });
        } else {
          missing.push(k);
        }
      }
    } else if (!last && v.n > 1) {
      for (let k = 1; k < v.n; k++) missing.push(k);
    }
    if (last && v.n <= last.n) {
      // Número repetido ou fora de ordem: junta ao anterior para não perder texto.
      last.t += ' ' + v.t;
      continue;
    }
    out.push({ n: v.n, t: v.t });
  }
  return { verses: out, missing };
}

// ---------------------------------------------------------------------------
// 2–4. Palavras
// ---------------------------------------------------------------------------

const ACUTE: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const CIRC: Record<string, string> = { a: 'â', e: 'ê', o: 'ô' };
const TILDE: Record<string, string> = { a: 'ã', o: 'õ' };
const STRIP: Record<string, string> = {
  ê: 'e', ô: 'o', â: 'a', é: 'e', ó: 'o', á: 'a', í: 'i', ú: 'u',
  è: 'e', ò: 'o', à: 'a', ì: 'i', ù: 'u', ü: 'u',
};

function matchCase(model: string, word: string): string {
  if (model === model.toUpperCase() && model.length > 1) return word.toUpperCase();
  if (model[0] === model[0].toUpperCase()) return word[0].toUpperCase() + word.slice(1);
  return word;
}

export function makeChecker(lex: Lexicon) {
  const cache = new Map<string, boolean>();
  return function valid(word: string): boolean {
    let r = cache.get(word);
    if (r === undefined) {
      const lower = word.toLowerCase();
      r = lex.has(word) || lex.has(lower);
      if (!r && word.includes('-')) {
        r = word.split('-').every((p) => p.length > 0 && (lex.has(p) || lex.has(p.toLowerCase())));
      }
      cache.set(word, r);
    }
    return r;
  };
}

/** Variações com um único acento trocado, retirado ou acrescentado. */
function accentVariants(word: string): string[] {
  const out = new Set<string>();
  const chars = [...word];
  chars.forEach((c, i) => {
    const lower = c.toLowerCase();
    const put = (rep: string) => {
      const r = lower === c ? rep : rep.toUpperCase();
      out.add([...chars.slice(0, i), r, ...chars.slice(i + 1)].join(''));
    };
    if (STRIP[lower]) put(STRIP[lower]);
    const base = STRIP[lower] ?? lower;
    if (ACUTE[base] && ACUTE[base] !== lower) put(ACUTE[base]);
    if (CIRC[base] && CIRC[base] !== lower) put(CIRC[base]);
    if (TILDE[base] && TILDE[base] !== lower) put(TILDE[base]);
  });
  out.delete(word);
  return [...out];
}

/** Grafias corrigidas manualmente (casos que o dicionário aceita em outro sentido). */
const FIXED: Record<string, string> = {
  ha: 'há',
  fieis: 'fiéis',
  ate: 'até',
  tambem: 'também',
  tras: 'trás',
  alem: 'além',
  porem: 'porém',
  sabio: 'sábio',
  sabios: 'sábios',
  sabia: 'sábia',
  satanaz: 'Satanás',
};

export interface WordFix {
  from: string;
  to: string;
}

/**
 * Atualiza a ortografia de uma palavra. Só troca quando a forma original não
 * existe no português atual e há exatamente uma variação válida.
 */
export function modernizeWord(word: string, valid: (w: string) => boolean): string {
  const lower = word.toLowerCase();
  if (FIXED[lower] !== undefined) return matchCase(word, FIXED[lower]);
  if (valid(word)) return word;
  if (word.includes('-')) {
    const parts = word.split('-').map((p) => (p ? modernizeWord(p, valid) : p));
    return parts.join('-');
  }
  const candidates = accentVariants(word).filter(valid);
  if (candidates.length === 1) return candidates[0];
  // Preferir sempre a retirada de acento diferencial (reforma de 1971).
  const stripped = candidates.filter((c) => c.length === word.length && [...c].every((ch, i) => {
    const o = [...word][i];
    return ch === o || STRIP[o.toLowerCase()] === ch.toLowerCase();
  }));
  if (stripped.length === 1) return stripped[0];
  return word;
}

const TOKEN_RE = new RegExp(`[${LETTER}]+(?:[-'’][${LETTER}]+)*`, 'g');

export interface CleanOptions {
  valid: (w: string) => boolean;
  /** Palavras frequentes no próprio corpus (nomes próprios etc.). */
  corpusWord?: (w: string) => boolean;
  /** Frequência (minúsculas) de uma palavra no corpus inteiro. */
  corpusFreq?: (w: string) => number;
  /** Frequência (minúsculas) do par de palavras "a b" no corpus inteiro. */
  corpusBigram?: (a: string, b: string) => number;
}

/**
 * Palavras curtas e comuns: duas delas lado a lado ("por que", "de mais",
 * "se não") são legítimas e nunca devem ser juntadas.
 */
const STOPWORDS = new Set(
  'a o as os e é de do da dos das em no na nos nas por para que se não um uma com como mais pois quem sem sob ao à aos às eu tu ele ela nós vós eles me te lhe nos vos lhes meu teu seu fim mas bem já lá cá ali aqui então porque quando onde'.split(' '),
);

export interface CleanResult {
  text: string;
  unknownWords: string[];
}

export function cleanVerseText(raw: string, opts: CleanOptions): CleanResult {
  const { valid } = opts;
  const known = (w: string) => valid(w) || (opts.corpusWord?.(w) ?? false);
  let t = raw.normalize('NFC');

  // Ruído tipográfico comum
  t = t
    .replace(/[|_~^`•■□▪●]+/g, ' ')
    .replace(/Ș/g, 'S')
    .replace(/\s+([,;:.!?])/g, '$1')
    .replace(/([,;:])(?=[^\s\d»”"')])/g, '$1 ')
    .replace(/:\s*:/g, ':')
    .replace(/(\p{L})--(\p{L})/gu, '$1-$2')
    .replace(/(\p{L})-\s+-(\p{L})/gu, '$1-$2')
    // Hifenização de fim de linha que sobrou: "purifi-. cado", "re- nova"
    .replace(/(\p{Ll})-\.?\s+(\p{Ll}{2,})/gu, '$1$2')
    .replace(/\.\.(?!\.)/g, '.')
    .replace(/\bE['’”"](?=\s)/g, 'É')
    .replace(/\bA['’](?=\s)/g, 'A')
    .replace(/([,;:])\s*\.\s/g, '$1 ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Lixo no fim do versículo depois da pontuação final: "maldades. li", "Abraão: 1I0"
  t = t.replace(/([.:;!?,])\s+(?:[A-Za-z]{1,2}|[\dIlO]{1,4})$/u, '$1');
  // Ponto perdido no meio da frase: "em toda. a Galileia" (só quando o que
  // vem antes é palavra comum e o que vem depois começa com minúscula).
  // Se depois do ponto vier um trecho longo, mantemos o ponto: pode ser o
  // começo de uma nota de rodapé vazada, e suspicionReasons() vai sinalizar.
  t = t.replace(/(\p{L}{3,})\.\s+(?=\p{Ll})/gu, (m, w: string, offset: number, str: string) => {
    const after = str.slice(offset + m.length).split(/\s+/).length;
    return valid(w) && after < BLEED_MIN_WORDS ? `${w} ` : m;
  });

  // Primeira palavra em CAIXA ALTA (versalete da edição impressa): "LIVRO da" → "Livro da".
  t = t.replace(/^([A-ZÁÉÍÓÚÂÊÔÃÕÀÇ])([A-ZÁÉÍÓÚÂÊÔÃÕÀÇ]{2,})(?=[\s,.;:])/u, (_, a: string, b: string) => a + b.toLowerCase());

  // Remove sujeira no início do versículo (aspas soltas, "+", "R").
  t = t.replace(/^(?:[+*“”"'«»]\s*)+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÀÇ])/u, '');
  t = t.replace(/\s*[:;]\s*$/, (m) => (m.includes(':') ? ':' : ';'));
  t = t.replace(/\s+[:.;,]$/, (m) => m.trim());

  // 3. Palavras grudadas por ponto/apóstrofo: "logo.que", "tem'Deus".
  t = t.replace(
    new RegExp(`([${LETTER}]{2,})[.'’]([${LETTER}]{2,})`, 'g'),
    (m, a: string, b: string) => (known(a) && known(b) && !known(a + b) ? `${a} ${b}` : m),
  );

  // 2. Palavras partidas: "cami nho" → "caminho" (inclusive "tra zia", "es tás").
  const parts = t.split(' ');
  const merged: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const a = parts[i];
    const b = parts[i + 1];
    if (b !== undefined) {
      const aCore = a.match(new RegExp(`^[${LETTER}]+$`))?.[0];
      const bm = b.match(new RegExp(`^([${LETTER}]+(?:-[${LETTER}]+)*)(.*)$`));
      if (aCore && bm && /^[a-záéíóúâêôãõàçü]/.test(bm[1])) {
        const joined = aCore + bm[1];
        const aOk = known(aCore);
        const bOk = known(bm[1]);
        const jOk = valid(joined) || valid(modernizeWord(joined, valid)) || (opts.corpusWord?.(joined) ?? false);
        const common = STOPWORDS.has(aCore.toLowerCase()) && STOPWORDS.has(bm[1].toLowerCase());
        const freqOk = opts.corpusFreq ? opts.corpusFreq(joined.toLowerCase()) >= 3 : false;
        // Com as duas partes válidas ("ove lhas", "no venta"), só junta se a
        // segunda não for palavra curta/comum ("vai a" ≠ "vaia").
        const bStrong = bm[1].length >= 3 && !STOPWORDS.has(bm[1].toLowerCase());
        // "de ter" e "a parte" são comuns como duas palavras; "ove lhas" não.
        const pairRare = opts.corpusBigram
          ? (opts.corpusFreq?.(joined.toLowerCase()) ?? 0) > 2 * opts.corpusBigram(aCore.toLowerCase(), bm[1].toLowerCase())
          : true;
        if (jOk && (!aOk || !bOk || (freqOk && !common && bStrong && pairRare))) {
          merged.push(joined + bm[2]);
          i++;
          continue;
        }
      }
    }
    merged.push(a);
  }
  t = merged.join(' ');

  // 4. Ortografia atual e acentos perdidos.
  const unknownWords: string[] = [];
  t = t.replace(TOKEN_RE, (w) => {
    const m = modernizeWord(w, valid);
    if (!valid(m) && !(opts.corpusWord?.(m) ?? false)) unknownWords.push(m);
    return m;
  });

  return { text: t.trim(), unknownWords };
}

// ---------------------------------------------------------------------------
// 5. Suspeitas
// ---------------------------------------------------------------------------

const NOTE_SIGNS = [
  /\b(?:Sacy|Éstio|Estio|Calmet|Amelote|Pereira\.|Menochio|Tirino|Cornélio|Maldonado)\b/,
  /\bS\.\s?(?:Jerônimo|Agostinho|Tomás|Gregório|João Crisóstomo|Ambrósio|Hilário|Cipriano)\b/,
  /\b(?:cap\.|caps\.|liv\.|vers\.|cfr\.|Cfr\.|Vide|v\.\s?\d)/,
  /\b(?:o hebraico|no hebreu|o texto grego|os Setenta|a Vulgata|Expositores|Intérpretes)\b/i,
  new RegExp(`[${UPPER}]{3,}(?:\\s+[${UPPER}]{1,})+\\s*[—-]`),
  /\d+\.\s?º\s+(?:Epístola|Livro)/,
  /\b(?:Epístola|Evangelho) de S\. \w+ \d+/,
];

/** Palavras após "ponto + minúscula" a partir das quais suspeitamos de nota vazada. */
const BLEED_MIN_WORDS = 10;

/** Nesta tradução frases começam com maiúscula: ". palavra" seguido de texto longo é suspeito. */
function looksLikeBleed(text: string): boolean {
  const m = text.match(/\.\s+(?=\p{Ll})/u);
  if (!m || m.index === undefined) return false;
  return text.slice(m.index + 1).trim().split(/\s+/).length >= BLEED_MIN_WORDS;
}

export function suspicionReasons(text: string, unknownWords: string[], medianLen: number): string[] {
  const reasons: string[] = [];
  if (NOTE_SIGNS.some((re) => re.test(text)) || looksLikeBleed(text)) reasons.push('nota');
  if (/\d/.test(text)) reasons.push('digito');
  const words = text.match(TOKEN_RE)?.length ?? 1;
  if (unknownWords.length >= 2 && unknownWords.length / words > 0.06) reasons.push('palavras');
  if (text.length > Math.max(420, medianLen * 3.5)) reasons.push('longo');
  if (text.length < 12) reasons.push('curto');
  return reasons;
}
