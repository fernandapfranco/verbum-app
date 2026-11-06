/**
 * O anjo da guarda do Verbum — "Clássico de Natal" (escolhido pela dona do projeto).
 * Como os anjinhos de enfeite: asas de penas em camadas com borda ondulada,
 * túnica em sino com gola e barra douradas, mãos segurando uma estrela,
 * cabelo e auréola. Formas chapadas, na paleta Luz.
 * Expressões: feliz (padrão), sereno (olhos fechados) e festa (asas erguidas).
 */
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useTheme } from '@/theme';

export type AngelMood = 'feliz' | 'sereno' | 'festa';

const INK = '#12142B';
const GOLD = '#F2B544';
const SKIN = '#FFE2CC';
const HAIR = '#D9A35B';

function Wing({ outer, inner, edge, lift }: { outer: string; inner: string; edge?: string; lift: number }) {
  return (
    <G transform={`translate(0 ${lift})`}>
      <Path
        d="M52 58 C44 38 28 22 10 20 C8 24 9 28 12 31 C8 33 8 38 11 41 C8 44 9 49 13 51 C11 55 13 59 17 60 C17 65 21 68 26 67 C28 72 34 73 38 70 C42 74 48 72 52 66 Z"
        fill={outer}
        stroke={edge ?? 'none'}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path
        d="M52 62 C46 50 34 42 22 40 C21 45 23 49 27 51 C26 56 29 59 33 60 C34 64 38 66 42 65 C45 68 50 67 52 64 Z"
        fill={inner}
        stroke={edge ?? 'none'}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </G>
  );
}

export function Angel({
  size = 96,
  mood = 'feliz',
  onPrimary = false,
}: {
  size?: number;
  mood?: AngelMood;
  /** Sobre fundo azul: túnica branca, para não sumir. */
  onPrimary?: boolean;
}) {
  const { dark } = useTheme();
  const party = mood === 'festa';
  const wingOuter = dark && !onPrimary ? '#DCE2FF' : '#FFFFFF';
  const wingInner = dark && !onPrimary ? '#B9C6FA' : '#E6EAFF';
  const edge = onPrimary || dark ? undefined : '#C9D2F7';
  const robe = onPrimary ? '#FFFFFF' : '#2F45D6';
  const sleeve = onPrimary ? '#E6EAFF' : '#3E55E3';
  const lift = party ? -6 : 0;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityRole="image" accessibilityLabel="Seu anjo da guarda">
      {party && <Circle cx={60} cy={62} r={54} fill={onPrimary ? '#FFFFFF' : GOLD} opacity={onPrimary ? 0.1 : 0.14} />}

      {/* asas */}
      <Wing outer={wingOuter} inner={wingInner} edge={edge} lift={lift} />
      <G transform="translate(120 0) scale(-1 1)">
        <Wing outer={wingOuter} inner={wingInner} edge={edge} lift={lift} />
      </G>

      {/* túnica em sino */}
      <Path d="M60 50 C51 50 47 56 46 64 C44 80 38 96 32 108 Q60 116 88 108 C82 96 76 80 74 64 C73 56 69 50 60 50 Z" fill={robe} />
      <Path d="M33 106 Q60 114 87 106" stroke={GOLD} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M52 53 Q60 58 68 53" stroke={GOLD} strokeWidth={2.6} fill="none" strokeLinecap="round" />

      {/* mangas e estrela nas mãos */}
      <Path d="M47 62 C44 70 47 78 55 80 L60 77 L58 70 C54 68 51 64 50 61 Z" fill={sleeve} />
      <Path d="M73 62 C76 70 73 78 65 80 L60 77 L62 70 C66 68 69 64 70 61 Z" fill={sleeve} />
      <Path d="M60 64 l2.4 5 l5.4 .8 l-3.9 3.8 l.9 5.4 l-4.8 -2.6 l-4.8 2.6 l.9 -5.4 l-3.9 -3.8 l5.4 -.8 Z" fill={GOLD} />

      {/* cabeça e cabelo */}
      <Circle cx={60} cy={37} r={12.5} fill={SKIN} />
      <Path
        d="M47.5 38 C46 27 53 22 60 22 C67 22 74 27 72.5 38 C71 34 69 31 66 30 C66 33 63 34 61 32 C59 34 55 34 54 31 C51 32 49 35 47.5 38 Z"
        fill={HAIR}
      />
      <Circle cx={52} cy={41} r={2.2} fill="#FFB3A7" opacity={0.55} />
      <Circle cx={68} cy={41} r={2.2} fill="#FFB3A7" opacity={0.55} />

      {/* rosto */}
      {mood === 'sereno' ? (
        <G>
          <Path d="M55 38 Q56.5 39.6 58 38" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M62 38 Q63.5 39.6 65 38" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M57 43 Q60 45 63 43" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </G>
      ) : party ? (
        <G>
          <Path d="M54.5 38.5 Q56.5 36 58.5 38.5" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M61.5 38.5 Q63.5 36 65.5 38.5" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M56.5 42.5 Q60 47.5 63.5 42.5 Z" fill={INK} />
        </G>
      ) : (
        <G>
          <Circle cx={56.3} cy={37.8} r={1.7} fill={INK} />
          <Circle cx={63.7} cy={37.8} r={1.7} fill={INK} />
          <Path d="M57 42.5 Q60 45 63 42.5" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </G>
      )}

      {/* auréola */}
      <Ellipse cx={60} cy={15} rx={14} ry={3.8} fill="none" stroke={GOLD} strokeWidth={3} />

      {party && (
        <G>
          <Path d="M14 92 l2 4 l4.4 .8 l-3.2 3 l.8 4.4 l-4 -2.2 l-4 2.2 l.8 -4.4 l-3.2 -3 l4.4 -.8 Z" fill={GOLD} />
          <Path d="M104 88 l1.6 3.2 l3.5 .6 l-2.6 2.4 l.6 3.5 l-3.1 -1.7 l-3.1 1.7 l.6 -3.5 l-2.6 -2.4 l3.5 -.6 Z" fill={GOLD} />
        </G>
      )}
    </Svg>
  );
}
