/**
 * Combina duas leituras de OCR independentes do mesmo versículo.
 *
 * As duas digitalizações vêm da mesma edição impressa, mas erram em lugares
 * diferentes. Trechos de notas de rodapé "vazam" para dentro dos versículos em
 * pontos e com conteúdos diferentes em cada leitura. Por isso:
 *  - o que as duas leituras concordam fica;
 *  - diferenças curtas (até 4 palavras) são decididas pela forma que existe no
 *    dicionário;
 *  - diferenças longas que aparecem em só uma leitura são tratadas como
 *    "vazamento" de nota e descartadas;
 *  - diferenças longas nas duas leituras ao mesmo tempo são descartadas e o
 *    versículo fica marcado para revisão humana.
 */
import { diffArrays } from 'diff';

export interface MergeResult {
  text: string;
  flags: string[];
}

const SHORT = 4;

function score(tokens: string[], valid: (w: string) => boolean): number {
  let s = 0;
  for (const tok of tokens) {
    const core = tok.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
    if (!core) {
      s -= 0.5;
      continue;
    }
    s += valid(core) ? 1 : -1;
  }
  return s;
}

export function mergeReadings(
  a: string | undefined,
  b: string | undefined,
  valid: (w: string) => boolean,
  /** Frequência da palavra no corpus, usada para desempatar. */
  freq: (w: string) => number = () => 0,
): MergeResult {
  const A = a?.trim() ?? '';
  const B = b?.trim() ?? '';
  if (!A && !B) return { text: '', flags: ['ausente'] };
  if (!A) return { text: B, flags: ['fonte-unica'] };
  if (!B) return { text: A, flags: ['fonte-unica'] };
  if (A === B) return { text: A, flags: [] };

  const ta = A.split(/\s+/);
  const tb = B.split(/\s+/);
  const norm = (t: string) => t.toLowerCase().replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, '');
  const parts = diffArrays(ta, tb, { comparator: (x: string, y: string) => norm(x) === norm(y) });
  const flags = new Set<string>();
  const freqOf = (ts: string[]) => ts.reduce((n, t) => n + freq(norm(t)), 0);

  // Cada pedaço do resultado: texto mantido ou um "buraco" (trecho descartado).
  type Piece = { tokens: string[]; equal: boolean } | { dropped: true };
  const pieces: Piece[] = [];
  const keep = (tokens: string[], equal = false) => pieces.push({ tokens, equal });
  const drop = (flag: string) => {
    flags.add(flag);
    pieces.push({ dropped: true });
  };

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p.added && !p.removed) {
      keep(p.value, true);
      continue;
    }
    // Agrupa um par removido+adicionado como substituição.
    let removed: string[] = [];
    let added: string[] = [];
    if (p.removed) {
      removed = p.value;
      if (parts[i + 1]?.added) {
        added = parts[i + 1].value;
        i++;
      }
    } else {
      added = p.value;
    }

    if (!removed.length || !added.length) {
      const only = removed.length ? removed : added;
      if (only.length <= SHORT) {
        // Palavra que uma leitura perdeu: mantém se parecer palavra real.
        if (score(only, valid) > 0) keep(only);
      } else {
        drop('vazamento');
      }
      continue;
    }

    const shortA = removed.length <= SHORT;
    const shortB = added.length <= SHORT;
    if (shortA && shortB) {
      const sa = score(removed, valid);
      const sb = score(added, valid);
      const pickA = sa > sb || (sa === sb && freqOf(removed) >= freqOf(added));
      keep(pickA ? removed : added);
    } else if (shortA !== shortB) {
      // Uma leitura tem um trecho curto, a outra um trecho longo: o longo
      // provavelmente traz nota de rodapé. Fica o curto.
      keep(shortA ? removed : added);
      flags.add('vazamento');
    } else {
      drop('divergente');
    }
  }

  // Depois de um trecho descartado, "ilhas" curtas de concordância casual entre
  // duas notas diferentes (ex.: "como a sua vida, e") também são descartadas.
  const out: string[] = [];
  for (let i = 0; i < pieces.length; i++) {
    const pc = pieces[i];
    if ('dropped' in pc) continue;
    const prevDropped = i > 0 && 'dropped' in pieces[i - 1];
    const nextIsDropOrEnd = i === pieces.length - 1 || 'dropped' in pieces[i + 1];
    if (prevDropped && nextIsDropOrEnd && pc.tokens.length <= 6) continue;
    out.push(...pc.tokens);
  }

  return { text: out.join(' ').replace(/\s{2,}/g, ' ').trim(), flags: [...flags] };
}
