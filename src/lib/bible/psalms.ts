/**
 * Numeração dos Salmos.
 *
 * A tradução de Figueiredo segue a Vulgata (numeração grega/latina). As Bíblias
 * católicas atuais usam a numeração hebraica e colocam a grega entre parênteses,
 * por exemplo "Sl 23(22)". No app, o capítulo armazenado é sempre o da Vulgata.
 *
 * Correspondência:
 *   Vulgata 1–8     = Hebraica 1–8
 *   Vulgata 9       = Hebraica 9–10
 *   Vulgata 10–112  = Hebraica 11–113
 *   Vulgata 113     = Hebraica 114–115
 *   Vulgata 114–115 = Hebraica 116
 *   Vulgata 116–145 = Hebraica 117–146
 *   Vulgata 146–147 = Hebraica 147
 *   Vulgata 148–150 = Hebraica 148–150
 */

/** Rótulo hebraico correspondente a um salmo na numeração da Vulgata. */
export function vulgateToHebrew(v: number): string {
  if (v < 1 || v > 150) throw new RangeError(`Salmo inválido: ${v}`);
  if (v <= 8) return String(v);
  if (v === 9) return '9–10';
  if (v <= 112) return String(v + 1);
  if (v === 113) return '114–115';
  if (v === 114 || v === 115) return '116';
  if (v <= 145) return String(v + 1);
  if (v === 146 || v === 147) return '147';
  return String(v);
}

/** Salmo da Vulgata que contém o salmo de numeração hebraica `h`. */
export function hebrewToVulgate(h: number): number {
  if (h < 1 || h > 150) throw new RangeError(`Salmo inválido: ${h}`);
  if (h <= 8) return h;
  if (h === 9 || h === 10) return 9;
  if (h <= 113) return h - 1;
  if (h === 114 || h === 115) return 113;
  if (h === 116) return 114; // Sl 116 hebraico = Vulgata 114 + 115
  if (h <= 146) return h - 1;
  if (h === 147) return 146; // Sl 147 hebraico = Vulgata 146 + 147
  return h;
}

/**
 * "Salmo 23 (22)" — numeração hebraica primeiro (a mais conhecida hoje),
 * a da Vulgata entre parênteses, como nas Bíblias católicas brasileiras.
 */
export function psalmLabel(vulgate: number): string {
  const h = vulgateToHebrew(vulgate);
  return h === String(vulgate) ? `Salmo ${vulgate}` : `Salmo ${h} (${vulgate})`;
}
