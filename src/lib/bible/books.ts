/**
 * Cânon católico — 73 livros, na ordem das Bíblias católicas brasileiras.
 *
 * `sourceId` é o identificador do livro no corpus de origem (Figueiredo, ed. 1950,
 * extraído por OCR — ver docs/texto-biblico.md). `chapters` segue a divisão da
 * Vulgata usada pela tradução de Figueiredo (ex.: Ester com 16 capítulos,
 * Daniel com 14, Baruc com 6, Salmos na numeração grega/latina).
 */

export type Testament = 'AT' | 'NT';

export type BookGroup =
  | 'Pentateuco'
  | 'Históricos'
  | 'Sapienciais'
  | 'Proféticos'
  | 'Evangelhos'
  | 'Atos'
  | 'Cartas de São Paulo'
  | 'Cartas católicas'
  | 'Apocalipse';

export interface Book {
  /** Identificador estável usado no app e no banco (= sourceId). */
  id: string;
  /** Posição canônica, de 1 a 73. */
  order: number;
  /** Nome moderno exibido. */
  name: string;
  /** Nome curto para listas e botões. */
  shortName: string;
  /** Sigla no padrão das Bíblias católicas brasileiras. */
  abbrev: string;
  /** Nome usado em edições antigas, quando diferente (ex.: Paralipômenos). */
  oldName?: string;
  testament: Testament;
  group: BookGroup;
  chapters: number;
  /** Livros deuterocanônicos (presentes só no cânon católico). */
  deuterocanonical?: boolean;
}

type Row = [
  id: string,
  name: string,
  shortName: string,
  abbrev: string,
  group: BookGroup,
  chapters: number,
  extra?: { oldName?: string; deutero?: boolean },
];

const AT: Row[] = [
  ['genesis', 'Gênesis', 'Gênesis', 'Gn', 'Pentateuco', 50],
  ['exodo', 'Êxodo', 'Êxodo', 'Ex', 'Pentateuco', 40],
  ['levitico', 'Levítico', 'Levítico', 'Lv', 'Pentateuco', 27],
  ['numeros', 'Números', 'Números', 'Nm', 'Pentateuco', 36],
  ['deuteronomio', 'Deuteronômio', 'Deuteronômio', 'Dt', 'Pentateuco', 34],
  ['josue', 'Josué', 'Josué', 'Js', 'Históricos', 24],
  ['juizes', 'Juízes', 'Juízes', 'Jz', 'Históricos', 21],
  ['rute', 'Rute', 'Rute', 'Rt', 'Históricos', 4],
  ['1-samuel', '1º Livro de Samuel', '1 Samuel', '1Sm', 'Históricos', 31, { oldName: '1º Livro dos Reis' }],
  ['2-samuel', '2º Livro de Samuel', '2 Samuel', '2Sm', 'Históricos', 24, { oldName: '2º Livro dos Reis' }],
  ['1-reis', '1º Livro dos Reis', '1 Reis', '1Rs', 'Históricos', 22, { oldName: '3º Livro dos Reis' }],
  ['2-reis', '2º Livro dos Reis', '2 Reis', '2Rs', 'Históricos', 25, { oldName: '4º Livro dos Reis' }],
  ['1-cronicas', '1º Livro das Crônicas', '1 Crônicas', '1Cr', 'Históricos', 29, { oldName: '1º Paralipômenos' }],
  ['2-cronicas', '2º Livro das Crônicas', '2 Crônicas', '2Cr', 'Históricos', 36, { oldName: '2º Paralipômenos' }],
  ['esdras', 'Esdras', 'Esdras', 'Esd', 'Históricos', 10],
  ['neemias', 'Neemias', 'Neemias', 'Ne', 'Históricos', 13, { oldName: '2º Livro de Esdras' }],
  ['tobias', 'Tobias', 'Tobias', 'Tb', 'Históricos', 14, { deutero: true }],
  ['judite', 'Judite', 'Judite', 'Jt', 'Históricos', 16, { deutero: true }],
  ['ester', 'Ester', 'Ester', 'Est', 'Históricos', 16],
  ['1-macabeus', '1º Livro dos Macabeus', '1 Macabeus', '1Mc', 'Históricos', 16, { deutero: true }],
  ['2-macabeus', '2º Livro dos Macabeus', '2 Macabeus', '2Mc', 'Históricos', 15, { deutero: true }],
  ['jo', 'Jó', 'Jó', 'Jó', 'Sapienciais', 42],
  ['salmos', 'Salmos', 'Salmos', 'Sl', 'Sapienciais', 150],
  ['proverbios', 'Provérbios', 'Provérbios', 'Pr', 'Sapienciais', 31],
  ['eclesiastes', 'Eclesiastes', 'Eclesiastes', 'Ecl', 'Sapienciais', 12],
  ['cantico', 'Cântico dos Cânticos', 'Cântico', 'Ct', 'Sapienciais', 8],
  ['sabedoria', 'Sabedoria', 'Sabedoria', 'Sb', 'Sapienciais', 19, { deutero: true }],
  ['eclesiastico', 'Eclesiástico', 'Eclesiástico', 'Eclo', 'Sapienciais', 51, { deutero: true }],
  ['isaias', 'Isaías', 'Isaías', 'Is', 'Proféticos', 66],
  ['jeremias', 'Jeremias', 'Jeremias', 'Jr', 'Proféticos', 52],
  ['lamentacoes', 'Lamentações', 'Lamentações', 'Lm', 'Proféticos', 5],
  ['baruc', 'Baruc', 'Baruc', 'Br', 'Proféticos', 6, { deutero: true }],
  ['ezequiel', 'Ezequiel', 'Ezequiel', 'Ez', 'Proféticos', 48],
  ['daniel', 'Daniel', 'Daniel', 'Dn', 'Proféticos', 14],
  ['oseias', 'Oseias', 'Oseias', 'Os', 'Proféticos', 14],
  ['joel', 'Joel', 'Joel', 'Jl', 'Proféticos', 3],
  ['amos', 'Amós', 'Amós', 'Am', 'Proféticos', 9],
  ['abdias', 'Abdias', 'Abdias', 'Ab', 'Proféticos', 1],
  ['jonas', 'Jonas', 'Jonas', 'Jn', 'Proféticos', 4],
  ['miqueias', 'Miqueias', 'Miqueias', 'Mq', 'Proféticos', 7],
  ['naum', 'Naum', 'Naum', 'Na', 'Proféticos', 3],
  ['habacuc', 'Habacuc', 'Habacuc', 'Hab', 'Proféticos', 3],
  ['sofonias', 'Sofonias', 'Sofonias', 'Sf', 'Proféticos', 3],
  ['ageu', 'Ageu', 'Ageu', 'Ag', 'Proféticos', 2],
  ['zacarias', 'Zacarias', 'Zacarias', 'Zc', 'Proféticos', 14],
  ['malaquias', 'Malaquias', 'Malaquias', 'Ml', 'Proféticos', 4],
];

const NT: Row[] = [
  ['mateus', 'Evangelho segundo São Mateus', 'Mateus', 'Mt', 'Evangelhos', 28],
  ['marcos', 'Evangelho segundo São Marcos', 'Marcos', 'Mc', 'Evangelhos', 16],
  ['lucas', 'Evangelho segundo São Lucas', 'Lucas', 'Lc', 'Evangelhos', 24],
  ['joao', 'Evangelho segundo São João', 'João', 'Jo', 'Evangelhos', 21],
  ['atos', 'Atos dos Apóstolos', 'Atos', 'At', 'Atos', 28],
  ['romanos', 'Carta aos Romanos', 'Romanos', 'Rm', 'Cartas de São Paulo', 16],
  ['1-corintios', '1ª Carta aos Coríntios', '1 Coríntios', '1Cor', 'Cartas de São Paulo', 16],
  ['2-corintios', '2ª Carta aos Coríntios', '2 Coríntios', '2Cor', 'Cartas de São Paulo', 13],
  ['galatas', 'Carta aos Gálatas', 'Gálatas', 'Gl', 'Cartas de São Paulo', 6],
  ['efesios', 'Carta aos Efésios', 'Efésios', 'Ef', 'Cartas de São Paulo', 6],
  ['filipenses', 'Carta aos Filipenses', 'Filipenses', 'Fl', 'Cartas de São Paulo', 4],
  ['colossenses', 'Carta aos Colossenses', 'Colossenses', 'Cl', 'Cartas de São Paulo', 4],
  ['1-tessalonicenses', '1ª Carta aos Tessalonicenses', '1 Tessalonicenses', '1Ts', 'Cartas de São Paulo', 5],
  ['2-tessalonicenses', '2ª Carta aos Tessalonicenses', '2 Tessalonicenses', '2Ts', 'Cartas de São Paulo', 3],
  ['1-timoteo', '1ª Carta a Timóteo', '1 Timóteo', '1Tm', 'Cartas de São Paulo', 6],
  ['2-timoteo', '2ª Carta a Timóteo', '2 Timóteo', '2Tm', 'Cartas de São Paulo', 4],
  ['tito', 'Carta a Tito', 'Tito', 'Tt', 'Cartas de São Paulo', 3],
  ['filemom', 'Carta a Filêmon', 'Filêmon', 'Fm', 'Cartas de São Paulo', 1],
  ['hebreus', 'Carta aos Hebreus', 'Hebreus', 'Hb', 'Cartas de São Paulo', 13],
  ['tiago', 'Carta de São Tiago', 'Tiago', 'Tg', 'Cartas católicas', 5],
  ['1-pedro', '1ª Carta de São Pedro', '1 Pedro', '1Pd', 'Cartas católicas', 5],
  ['2-pedro', '2ª Carta de São Pedro', '2 Pedro', '2Pd', 'Cartas católicas', 3],
  ['1-joao', '1ª Carta de São João', '1 João', '1Jo', 'Cartas católicas', 5],
  ['2-joao', '2ª Carta de São João', '2 João', '2Jo', 'Cartas católicas', 1],
  ['3-joao', '3ª Carta de São João', '3 João', '3Jo', 'Cartas católicas', 1],
  ['judas', 'Carta de São Judas', 'Judas', 'Jd', 'Cartas católicas', 1],
  ['apocalipse', 'Apocalipse', 'Apocalipse', 'Ap', 'Apocalipse', 22],
];

function build(rows: Row[], testament: Testament, offset: number): Book[] {
  return rows.map(([id, name, shortName, abbrev, group, chapters, extra], i) => ({
    id,
    order: offset + i + 1,
    name,
    shortName,
    abbrev,
    testament,
    group,
    chapters,
    ...(extra?.oldName ? { oldName: extra.oldName } : {}),
    ...(extra?.deutero ? { deuterocanonical: true } : {}),
  }));
}

export const BOOKS: readonly Book[] = [...build(AT, 'AT', 0), ...build(NT, 'NT', AT.length)];

const byId = new Map(BOOKS.map((b) => [b.id, b]));
const byAbbrev = new Map(BOOKS.map((b) => [normalizeAbbrev(b.abbrev), b]));

function normalizeAbbrev(a: string): string {
  return a.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, '');
}

export function getBook(id: string): Book {
  const b = byId.get(id);
  if (!b) throw new Error(`Livro desconhecido: ${id}`);
  return b;
}

export function findBook(id: string): Book | undefined {
  return byId.get(id);
}

export function findBookByAbbrev(abbrev: string): Book | undefined {
  // "Jó" e "Jo" (João) só diferem pelo acento: tratamos "Jó" antes de normalizar.
  if (abbrev.trim() === 'Jó') return byId.get('jo');
  if (abbrev.trim() === 'Jo') return byId.get('joao');
  return byAbbrev.get(normalizeAbbrev(abbrev));
}

export const GROUP_ORDER: readonly BookGroup[] = [
  'Pentateuco',
  'Históricos',
  'Sapienciais',
  'Proféticos',
  'Evangelhos',
  'Atos',
  'Cartas de São Paulo',
  'Cartas católicas',
  'Apocalipse',
];
