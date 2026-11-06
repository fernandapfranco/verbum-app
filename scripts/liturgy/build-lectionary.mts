/// <reference types="node" />
/**
 * Gera src/content/lectionary.ts: a referência do EVANGELHO de cada dia
 * litúrgico, segundo o Ordo Lectionum Missae (1981).
 *
 * Referências bíblicas são fatos (não há texto do Lecionário aqui). Para não
 * depender de uma única transcrição, cruzamos duas compilações independentes,
 * lidas apenas como TEXTO (nenhum código delas é executado):
 *
 *   H = github.com/harvouscom/harvous  src/data/lectionary/*.ts  (edição dos EUA)
 *   O = github.com/RafaelAngelRamirez/documentos-vaticanos  frontend/src/app/core/liturgia/
 *       (olm-pack.ts + ot-weekday-lectionary.ts; tabelas de Felix Just, S.J.)
 *
 * Onde as duas concordam, a referência é usada. Onde divergem, vale a decisão
 * registrada em OVERRIDES (revisada à mão) ou, na falta dela, H — e a
 * divergência vai para docs/lecionario-divergencias.md.
 *
 * Uso: npm run lectionary:build -- <pasta harvous> <pasta documentos-vaticanos>
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const [hDir, oDir] = process.argv.slice(2);
if (!hDir || !oDir) {
  console.error('Uso: npm run lectionary:build -- <harvous> <documentos-vaticanos>');
  process.exit(1);
}
const read = (p: string) => fs.readFileSync(p, 'utf8');

// ----------------------------------------------------------------- formato
const EN_BOOK: Record<string, string> = { Matthew: 'Mt', Mark: 'Mc', Luke: 'Lc', John: 'Jo' };

/** "Matthew 9:35—10:1, 5a, 6-8" → "Mt 9,35–10,1.5a.6-8" */
function fromEnglish(ref: string): string {
  const m = ref.match(/^(\w+)\s+(.*)$/);
  if (!m || !EN_BOOK[m[1]]) throw new Error(`Referência não reconhecida: ${ref}`);
  const body = m[2]
    .replace(/—/g, '–')
    .replace(/(\d+):(\d)/g, '$1,$2')
    // Em inglês, ", " separa trechos de versículos; capítulo,versículo já não tem espaço.
    .replace(/,\s+/g, '.')
    .replace(/;\s*/g, '; ')
    .replace(/\s+(?!\d+,)/g, '');
  return `${EN_BOOK[m[1]]} ${body}`;
}

/** "Jn 20,19-31" → "Jo 20,19-31" */
function fromSpanish(ref: string): string {
  return ref.replace(/^Jn\b/, 'Jo').replace(/\s+/g, ' ').replace(/—/g, '–').trim();
}

const norm = (r: string) => r.toLowerCase().replace(/\s+/g, '').replace(/[–—]/g, '-');

// ----------------------------------------------------------------- chaves
const DAYS_EN = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAYS_PT = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const cycles = ['A', 'B', 'C'] as const;

const H = new Map<string, string>();
const O = new Map<string, string>();

// ----------------------------------------------------------------- leitura de H
const hLect = path.join(hDir, 'src/data/lectionary');
{
  const s = read(path.join(hLect, 'sundays-and-solemnities.ts'));
  const H_KEY: Record<string, string> = {
    'holy-family': 'festa:sagrada-familia', 'mary-mother-of-god': 'fixo:01-01', 'baptism-of-the-lord': 'festa:batismo',
    'ash-wednesday': 'festa:cinzas', 'palm-sunday': 'festa:ramos', 'holy-thursday': 'festa:quinta-santa',
    'good-friday': 'festa:sexta-santa', 'corpus-christi': 'festa:corpus-christi', 'sacred-heart': 'festa:sagrado-coracao',
    'christ-the-king': 'festa:cristo-rei', christmas: 'fixo:12-25', epiphany: 'festa:epifania', easter: 'festa:pascoa',
    ascension: 'festa:ascensao', pentecost: 'festa:pentecostes', trinity: 'festa:trindade',
    'st-joseph': 'fixo:03-19', 'birth-of-john-the-baptist': 'fixo:06-24', 'peter-and-paul': 'fixo:06-29',
    'exaltation-of-the-cross': 'fixo:09-14', 'all-saints': 'fixo:11-01', 'all-souls': 'fixo:11-02',
    'dedication-of-the-lateran': 'fixo:11-09', 'immaculate-conception': 'fixo:12-08', presentation: 'fixo:02-02',
    annunciation: 'fixo:03-25', transfiguration: 'fixo:08-06', assumption: 'fixo:08-15',
  };
  const ourKey = (k: string): string | null => {
    let m;
    if ((m = k.match(/^advent-(\d)$/))) return `dom:advento-${m[1]}`;
    if ((m = k.match(/^lent-(\d)$/))) return `dom:quaresma-${m[1]}`;
    if ((m = k.match(/^easter-(\d)$/))) return `dom:pascoa-${m[1]}`;
    if ((m = k.match(/^ordinary-(\d+)$/))) return `dom:comum-${m[1]}`;
    return H_KEY[k] ?? null;
  };
  const blockRe = /^\s{2}'?([a-z][a-z0-9-]*)'?:\s*\{([\s\S]*?)^\s{2}\},?$/gm;
  let b;
  while ((b = blockRe.exec(s))) {
    const key = ourKey(b[1]);
    if (!key) continue;
    const lineRe = /(A|B|C|all):\s*e\(\d+,\s*'[^']*',\s*'[^']*',\s*(?:'[^']*'|null),\s*'([^']*)'/g;
    let l;
    while ((l = lineRe.exec(b[2]))) {
      const g = fromEnglish(l[2]);
      if (l[1] === 'all') H.set(key, g);
      else H.set(`${key}:${l[1]}`, g);
    }
  }
  // Natal e Epifania "all" em linha única
  for (const m of s.matchAll(/^\s{2}(\w+):\s*\{\s*all:\s*e\(\d+,\s*'[^']*',\s*'[^']*',\s*(?:'[^']*'|null),\s*'([^']*)'/gm)) {
    const key = ourKey(m[1]);
    if (key) H.set(key, fromEnglish(m[2]));
  }
}
{
  const s = read(path.join(hLect, 'weekdays-ordinary.ts'));
  const weekRe = /^\s{2}(\d+):\s*\[([\s\S]*?)^\s{2}\],?$/gm;
  let w;
  while ((w = weekRe.exec(s))) {
    const gospels = [...w[2].matchAll(/\],\s*'([^']+)'\],?\s*$/gm)].map((m) => m[1]);
    gospels.forEach((g, i) => H.set(`sem:comum-${w![1]}-${DAYS_PT[i]}`, fromEnglish(g)));
  }
}
{
  const s = read(path.join(hLect, 'weekdays-seasons.ts'));
  for (const m of s.matchAll(/'([a-z0-9-]+)':\s*w\(\d+,\s*'[^']*',\s*'[^']*',\s*'([^']*)'/g)) {
    const k = m[1]
      .replace(/^advent-dec-(\d+)$/, 'advento-dez-$1')
      .replace(/^advent-(\d)-(\w+)$/, (_, n, d) => `advento-${n}-${DAYS_PT[DAYS_EN.indexOf(d)]}`)
      .replace(/^christmas-dec-(\d+)$/, 'natal-dez-$1')
      .replace(/^christmas-jan-(\d+)$/, 'natal-jan-$1')
      .replace(/^after-epiphany-(\w+)$/, (_, d) => `apos-epifania-${DAYS_PT[DAYS_EN.indexOf(d)]}`)
      .replace(/^lent-(\d)-(\w+)$/, (_, n, d) => `quaresma-${n}-${DAYS_PT[DAYS_EN.indexOf(d)]}`)
      .replace(/^holy-(\w+)$/, (_, d) => `santa-${DAYS_PT[DAYS_EN.indexOf(d)]}`)
      .replace(/^easter-(\d)-(\w+)$/, (_, n, d) => `pascoa-${n}-${DAYS_PT[DAYS_EN.indexOf(d)]}`)
      .replace(/^mary-mother-of-the-church$/, 'maria-mae-da-igreja');
    H.set(k === 'maria-mae-da-igreja' ? 'festa:maria-mae-da-igreja' : `sem:${k}`, fromEnglish(m[2]));
  }
}
{
  const s = read(path.join(hLect, 'saints.ts'));
  for (const m of s.matchAll(/'(\d\d-\d\d)':\s*f\(\d+,\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'([^']*)'/g)) H.set(`fixo:${m[1]}`, fromEnglish(m[2]));
}

// ----------------------------------------------------------------- leitura de O
const oLit = path.join(oDir, 'frontend/src/app/core/liturgia');
{
  const s = read(path.join(oLit, 'olm-pack.ts'));
  const j = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
  type R = { gospel: string };
  (j.adventWeekday as R[][]).forEach((wk, wi) => wk.forEach((r, d) => O.set(`sem:advento-${wi + 1}-${DAYS_PT[d]}`, fromSpanish(r.gospel))));
  for (const [d, r] of Object.entries(j.dec17 as Record<string, R>)) O.set(`sem:advento-dez-${d}`, fromSpanish(r.gospel));
  for (const [md, r] of Object.entries(j.christmasDays as Record<string, R>)) {
    const [mm, dd] = md.split('-');
    O.set(mm === '12' ? `sem:natal-dez-${Number(dd)}` : `sem:natal-jan-${Number(dd)}`, fromSpanish(r.gospel));
  }
  (j.afterEpiphany as R[]).forEach((r, d) => O.set(`sem:apos-epifania-${DAYS_PT[d]}`, fromSpanish(r.gospel)));
  // Cinzas: chave 2 = a própria quarta-feira; 3, 4, 5 = quinta, sexta e sábado seguintes
  const ASH: Record<string, string> = { '2': 'festa:cinzas', '3': 'sem:quaresma-0-qui', '4': 'sem:quaresma-0-sex', '5': 'sem:quaresma-0-sab' };
  for (const [d, r] of Object.entries(j.ash as Record<string, R>)) if (ASH[d]) O.set(ASH[d], fromSpanish(r.gospel));
  (j.lentWeekday as R[][]).forEach((wk, wi) =>
    wk.forEach((r, d) => O.set(wi === 5 ? `sem:santa-${DAYS_PT[d]}` : `sem:quaresma-${wi + 1}-${DAYS_PT[d]}`, fromSpanish(r.gospel))),
  );
  (j.easterWeekday as R[][]).forEach((wk, wi) => wk.forEach((r, d) => O.set(`sem:pascoa-${wi + 1}-${DAYS_PT[d]}`, fromSpanish(r.gospel))));
  const sundays: [string, string][] = [['adventSunday', 'advento'], ['lentSunday', 'quaresma'], ['easterSunday', 'pascoa'], ['otSunday', 'comum']];
  for (const [field, name] of sundays)
    for (const [n, byCycle] of Object.entries(j[field] as Record<string, Record<string, R>>))
      for (const c of cycles) if (byCycle[c]) O.set(`dom:${name}-${n}:${c}`, fromSpanish(byCycle[c].gospel));
  const F: Record<string, string> = {
    christmas: 'fixo:12-25', 'holy-family': 'festa:sagrada-familia', 'mary-mother': 'fixo:01-01', epiphany: 'festa:epifania',
    baptism: 'festa:batismo', 'palm-sunday': 'festa:ramos', 'holy-thursday': 'festa:quinta-santa', 'good-friday': 'festa:sexta-santa',
    easter: 'festa:pascoa', ascension: 'festa:ascensao', pentecost: 'festa:pentecostes', trinity: 'festa:trindade',
    'corpus-christi': 'festa:corpus-christi', 'christ-the-king': 'festa:cristo-rei', 'sacred-heart': 'festa:sagrado-coracao',
  };
  for (const [k, byCycle] of Object.entries(j.feasts as Record<string, Record<string, R>>)) {
    const key = F[k];
    if (!key) continue;
    const gs = cycles.map((c) => byCycle[c]?.gospel).filter(Boolean) as string[];
    if (gs.length && gs.every((g) => g === gs[0])) O.set(key, fromSpanish(gs[0]));
    else cycles.forEach((c) => byCycle[c] && O.set(`${key}:${c}`, fromSpanish(byCycle[c].gospel)));
  }
}
{
  const s = read(path.join(oLit, 'ot-weekday-lectionary.ts'));
  const arr = s.slice(s.indexOf('OT_WEEKDAY_GOSPEL'));
  const rows = [...arr.matchAll(/\[\s*('[^\]]*')\s*\]/g)].slice(0, 34);
  rows.forEach((r, wi) => {
    const gs = [...r[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    gs.forEach((g, d) => O.set(`sem:comum-${wi + 1}-${DAYS_PT[d]}`, fromSpanish(g)));
  });
}

// ----------------------------------------------------------------- decisões manuais
/**
 * Decisões revisadas à mão quando as fontes divergem ou faltam.
 * Natal: Missa do dia (Jo 1,1-18). Aparecida (12/10, solenidade no Brasil): Jo 2,1-11.
 */
const OVERRIDES: Record<string, string> = {
  'fixo:12-25': 'Jo 1,1-18',
  'fixo:10-12': 'Jo 2,1-11',
  // A edição dos EUA estende até o v. 25; o Ordo (e o Lecionário brasileiro) termina no 24.
  'sem:advento-dez-18': 'Mt 1,18-24',
};

// Erros conhecidos de leitura: o bloco do Natal na fonte H "engole" o da Sagrada
// Família, e a fonte O tem as festas de Pentecostes/Trindade/Corpus Christi
// desalinhadas por ciclo. Nesses casos valem as outras leituras.
for (const k of [...H.keys()]) if (k.startsWith('fixo:12-25:')) H.delete(k);
for (const k of [...O.keys()]) if (/^festa:(pentecostes|trindade|corpus-christi)(:|$)/.test(k)) O.delete(k);

// ----------------------------------------------------------------- cruzamento
const keys = [...new Set([...H.keys(), ...O.keys(), ...Object.keys(OVERRIDES)])].sort();
const out: Record<string, string> = {};
const report: string[] = [];
let agree = 0;
let onlyOne = 0;
for (const k of keys) {
  const h = H.get(k);
  const o = O.get(k);
  if (OVERRIDES[k]) {
    out[k] = OVERRIDES[k];
    if (h && o && norm(h) !== norm(o)) report.push(`| ${k} | ${h} | ${o} | **${OVERRIDES[k]}** (decisão manual) |`);
    continue;
  }
  if (h && o) {
    if (norm(h) === norm(o)) agree++;
    else report.push(`| ${k} | ${h} | ${o} | ${h} |`);
    out[k] = h;
  } else {
    onlyOne++;
    out[k] = (h ?? o)!;
    report.push(`| ${k} | ${h ?? '—'} | ${o ?? '—'} | ${out[k]} (só uma fonte) |`);
  }
}

const header = `/**
 * Evangelho de cada dia litúrgico (Ordo Lectionum Missae, 1981) — GERADO por
 * scripts/liturgy/build-lectionary.mts. Não edite à mão: ajuste OVERRIDES no script.
 * Só referências (fatos); o texto vem da nossa tradução (Figueiredo).
 *
 * Chaves: dom:<tempo>-<n>:<ciclo> · sem:<tempo>-<semana>-<dia> · festa:<nome>[:<ciclo>] · fixo:MM-DD
 */
export const GOSPELS: Record<string, string> = ${JSON.stringify(out, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'src/content/lectionary.ts'), header);
fs.writeFileSync(
  path.join(ROOT, 'docs/lecionario-divergencias.md'),
  `# Lecionário: divergências entre as fontes

> Gerado por \`npm run lectionary:build\`. ${keys.length} chaves; ${agree} com as duas fontes iguais;
> ${report.length} listadas abaixo (divergência ou fonte única) para conferência.

| Chave | Fonte H (EUA) | Fonte O (OLM/Felix Just) | Usado |
|---|---|---|---|
${report.join('\n')}
`,
);
console.log(`Lecionário: ${keys.length} chaves, ${agree} concordantes, ${report.length} para conferir (${onlyOne} de fonte única).`);
