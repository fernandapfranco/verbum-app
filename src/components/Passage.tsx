/**
 * Renderiza um trecho bíblico: números de versículo, destaques, marcas de
 * favorito/nota e termos do glossário tocáveis.
 */
import { memo, useMemo } from 'react';
import { Text } from 'react-native';

import { GLOSSARY, type GlossaryTerm } from '@/content/glossary';
import type { Verse } from '@/db/bible';
import type { VerseMark } from '@/db/user';
import { FONTS, HIGHLIGHTS, type ReaderPalette } from '@/theme';

const POETIC = new Set(['salmos', 'proverbios', 'cantico', 'lamentacoes']);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Uma regex com todas as formas do glossário (mais longas primeiro). */
const FORMS = GLOSSARY.flatMap((t) => t.formas.map((f) => ({ f: f.toLowerCase(), t }))).sort(
  (a, b) => b.f.length - a.f.length,
);
const FORM_TO_TERM = new Map(FORMS.map((x) => [x.f, x.t]));
const GLOSSARY_RE = new RegExp(`(^|[^\\p{L}])(${FORMS.map((x) => escapeRe(x.f)).join('|')})(?=[^\\p{L}]|$)`, 'giu');

type Segment = { text: string; term?: GlossaryTerm };

/** Divide o texto marcando só a primeira ocorrência de cada termo no trecho. */
function segment(text: string, seen: Set<string>): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  GLOSSARY_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = GLOSSARY_RE.exec(text))) {
    const start = m.index + m[1].length;
    const word = m[2];
    const term = FORM_TO_TERM.get(word.toLowerCase());
    if (!term || seen.has(term.id)) continue;
    seen.add(term.id);
    if (start > last) out.push({ text: text.slice(last, start) });
    out.push({ text: word, term });
    last = start + word.length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export interface PassageProps {
  bookId: string;
  verses: Verse[];
  palette: ReaderPalette;
  fontSize: number;
  dark: boolean;
  showNumbers?: boolean;
  marks?: Map<number, VerseMark>;
  selected?: number | null;
  onSelectVerse?: (verse: number) => void;
  onTerm?: (term: GlossaryTerm) => void;
}

export const Passage = memo(function Passage({
  bookId,
  verses,
  palette,
  fontSize,
  dark,
  showNumbers = true,
  marks,
  selected,
  onSelectVerse,
  onTerm,
}: PassageProps) {
  const segmented = useMemo(() => {
    const seen = new Set<string>();
    return verses.map((v) => ({ v, segs: v.text ? segment(v.text, seen) : [] }));
  }, [verses]);

  const poetic = POETIC.has(bookId);
  const lineHeight = Math.round(fontSize * 1.65);

  return (
    <Text
      style={{ fontFamily: FONTS.scripture, fontSize, lineHeight, color: palette.text }}
      accessibilityRole="text"
    >
      {segmented.map(({ v, segs }, i) => {
        const mark = marks?.get(v.verse);
        const hl = mark?.color ? HIGHLIGHTS[mark.color][dark ? 'dark' : 'light'] : undefined;
        const isSel = selected === v.verse;
        return (
          <Text
            key={v.verse}
            onPress={onSelectVerse ? () => onSelectVerse(v.verse) : undefined}
            accessibilityHint={onSelectVerse ? 'Toque para destacar, favoritar ou anotar' : undefined}
            style={{
              backgroundColor: hl,
              textDecorationLine: isSel ? 'underline' : 'none',
              textDecorationColor: palette.verseNumber,
            }}
          >
            {i > 0 ? (poetic ? '\n' : ' ') : ''}
            {showNumbers && (
              <Text
                style={{ fontFamily: FONTS.uiSemiBold, fontSize: Math.round(fontSize * 0.6), color: palette.verseNumber }}
                accessibilityLabel={`Versículo ${v.verse}`}
              >
                {v.verse}
                {' '}
              </Text>
            )}
            {v.text ? (
              segs.map((s, k) =>
                s.term && onTerm ? (
                  <Text
                    key={k}
                    onPress={() => onTerm(s.term!)}
                    accessibilityRole="link"
                    accessibilityHint="Toque para ver o significado"
                    style={{ color: palette.link, textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}
                  >
                    {s.text}
                  </Text>
                ) : (
                  s.text
                ),
              )
            ) : (
              <Text style={{ color: palette.muted }} accessibilityLabel="Versículo em recuperação">
                […]
              </Text>
            )}
            {mark?.favorite ? <Text style={{ color: palette.verseNumber }}> ★</Text> : null}
            {mark?.note ? <Text style={{ color: palette.verseNumber }} accessibilityLabel="tem nota"> ✎</Text> : null}
          </Text>
        );
      })}
    </Text>
  );
});
