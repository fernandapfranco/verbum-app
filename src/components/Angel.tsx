/**
 * O anjo da guarda do Verbum — identidade "Luz".
 * Proporções de anjo clássico: asas de penas atrás do corpo, túnica longa com
 * gola e barra douradas, mãos em oração, cabelo e auréola. Formas chapadas.
 * Expressões: feliz (padrão), sereno (olhos fechados) e festa (asas erguidas).
 */
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useTheme } from '@/theme';

export type AngelMood = 'feliz' | 'sereno' | 'festa';

const INK = '#12142B';
const GOLD = '#F2B544';
const SKIN = '#FFE2CC';
const HAIR = '#D9A35B';

function Wing({ fill, shade, line, edge, lift }: { fill: string; shade: string; line: string; edge?: string; lift: number }) {
  return (
    <G transform={`translate(0 ${lift})`}>
      <Path
        d="M52 52 C44 36 30 22 12 18 C10 26 12 32 16 36 C10 38 8 44 10 50 C14 50 16 52 18 54 C14 58 14 64 18 68 C22 66 25 67 27 69 C26 74 28 78 32 80 C40 74 48 66 52 58 Z"
        fill={fill}
        stroke={edge ?? 'none'}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path d="M52 56 C46 48 36 42 22 40 C24 46 26 50 30 52 C28 56 30 60 34 62 C36 66 40 68 44 68 C47 64 50 60 52 56 Z" fill={shade} />
      <Path d="M16 36 C26 38 36 42 46 50" stroke={line} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M18 54 C28 54 38 56 48 58" stroke={line} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M27 69 C34 66 42 64 50 60" stroke={line} strokeWidth={1.6} fill="none" strokeLinecap="round" />
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
  const wing = dark && !onPrimary ? '#C9D2FF' : '#FFFFFF';
  const wingShade = dark && !onPrimary ? '#9FAEF5' : '#DCE2FF';
  const wingLine = onPrimary ? '#C3CCF7' : '#B9C4F5';
  const wingEdge = onPrimary || dark ? undefined : '#C9D2F7';
  const robe = onPrimary ? '#FFFFFF' : '#2F45D6';
  const robeShade = onPrimary ? '#E6EAFF' : '#2638B8';
  const sleeve = onPrimary ? '#F1F3FF' : '#3E55E3';
  const lift = party ? -6 : 0;
  const wingProps = { fill: wing, shade: wingShade, line: wingLine, edge: wingEdge, lift };

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityRole="image" accessibilityLabel="Seu anjo da guarda">
      {party && <Circle cx={60} cy={62} r={54} fill={onPrimary ? '#FFFFFF' : GOLD} opacity={onPrimary ? 0.1 : 0.14} />}

      {/* asas */}
      <Wing {...wingProps} />
      <G transform="translate(120 0) scale(-1 1)">
        <Wing {...wingProps} />
      </G>

      {/* túnica longa */}
      <Path d="M60 50 C52 50 47 55 45 64 L38 106 Q60 113 82 106 L75 64 C73 55 68 50 60 50 Z" fill={robe} />
      <Path d="M60 50 C66 50 70 54 72 60 L80 104 Q72 108 62 109 Z" fill={robeShade} opacity={0.35} />
      <Path d="M52.5 52.5 Q60 58 67.5 52.5" stroke={GOLD} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M39.5 102 Q60 109 80.5 102" stroke={GOLD} strokeWidth={2.6} fill="none" strokeLinecap="round" />

      {/* mangas e mãos em oração */}
      <Path d="M47 60 C44 68 46 76 54 79 L60 76 L58 70 C54 68 51 64 50 60 Z" fill={sleeve} />
      <Path d="M73 60 C76 68 74 76 66 79 L60 76 L62 70 C66 68 69 64 70 60 Z" fill={sleeve} />
      <Path d="M60 64 C57.5 67 57 72 58.5 76 L61.5 76 C63 72 62.5 67 60 64 Z" fill={SKIN} />

      {/* cabeça e cabelo */}
      <Circle cx={60} cy={38} r={13} fill={SKIN} />
      <Path
        d="M46.8 38 C46 28 52 23 60 23 C68 23 74 28 73.2 38 C71 33 68 31 64 31 C62 33 58 33 56 31 C52 31 49 33 46.8 38 Z"
        fill={HAIR}
      />
      <Circle cx={51} cy={42} r={2.4} fill="#FFB3A7" opacity={0.6} />
      <Circle cx={69} cy={42} r={2.4} fill="#FFB3A7" opacity={0.6} />

      {/* rosto */}
      {mood === 'sereno' ? (
        <G>
          <Path d="M53 38 Q55.5 40.5 58 38" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M62 38 Q64.5 40.5 67 38" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M56.5 44.5 Q60 46.5 63.5 44.5" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </G>
      ) : party ? (
        <G>
          <Path d="M53 38.5 Q55.5 35.5 58 38.5" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M62 38.5 Q64.5 35.5 67 38.5" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M56 43.5 Q60 49 64 43.5 Z" fill={INK} />
        </G>
      ) : (
        <G>
          <Circle cx={55.5} cy={38} r={2} fill={INK} />
          <Circle cx={64.5} cy={38} r={2} fill={INK} />
          <Path d="M56.5 44 Q60 47 63.5 44" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </G>
      )}

      {/* auréola */}
      <Ellipse cx={60} cy={16} rx={15} ry={4} fill="none" stroke={GOLD} strokeWidth={3.2} />

      {party && (
        <G>
          <Path d="M14 92 l2 4 l4.4 .8 l-3.2 3 l.8 4.4 l-4 -2.2 l-4 2.2 l.8 -4.4 l-3.2 -3 l4.4 -.8 Z" fill={GOLD} />
          <Path d="M104 88 l1.6 3.2 l3.5 .6 l-2.6 2.4 l.6 3.5 l-3.1 -1.7 l-3.1 1.7 l.6 -3.5 l-2.6 -2.4 l3.5 -.6 Z" fill={GOLD} />
        </G>
      )}
    </Svg>
  );
}
