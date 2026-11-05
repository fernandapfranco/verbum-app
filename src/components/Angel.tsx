/**
 * O anjo da guarda do Verbum — identidade "Luz".
 * Como os anjinhos de enfeite de Natal: asas em gota atrás dos ombros, túnica
 * longa com gola e barra douradas, mãos em oração, cabelo cacheado e auréola.
 * Expressões: feliz (padrão), sereno (olhos fechados) e festa (asas erguidas).
 */
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useTheme } from '@/theme';

export type AngelMood = 'feliz' | 'sereno' | 'festa';

const INK = '#12142B';
const GOLD = '#F2B544';
const SKIN = '#FFE2CC';
const HAIR = '#D9A35B';
const HAIR_SHADE = '#B9823A';

/** Asa de enfeite de Natal: uma peça só, em gota, com a ponta para cima e para fora. */
function Wing({ fill, shade, line, edge, lift }: { fill: string; shade: string; line: string; edge?: string; lift: number }) {
  return (
    <G transform={`translate(0 ${lift})`}>
      <Path
        d="M52 60 C50 44 42 28 28 18 C22 14 16 16 15 22 C13 38 18 56 30 68 C37 74 46 74 52 68 Z"
        fill={fill}
        stroke={edge ?? 'none'}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path d="M50 64 C46 52 38 40 28 32 C26 42 28 54 36 63 C40 67 46 68 50 64 Z" fill={shade} />
      <Path d="M21 26 C22 40 28 54 40 64" stroke={line} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Path d="M17 40 C21 50 27 58 34 64" stroke={line} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Cachinhos: círculos em arco em volta da cabeça (centro 60,37). */
const CURLS = [-200, -180, -158, -136, -114, -90, -66, -44, -22, 0, 20].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: 60 + 12.5 * Math.cos(a), y: 37 + 12.5 * Math.sin(a) };
});
const CURL_MARKS = [-160, -125, -90, -55, -20].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: 60 + 12.5 * Math.cos(a), y: 37 + 12.5 * Math.sin(a) };
});

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
      {CURLS.map((c, i) => (
        <Circle key={i} cx={c.x} cy={c.y} r={4.6} fill={HAIR} />
      ))}
      {CURL_MARKS.map((c, i) => (
        <Path key={i} d={`M${c.x - 2} ${c.y + 0.5} q2 -2.6 4 0`} stroke={HAIR_SHADE} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      ))}      <Circle cx={51} cy={42} r={2.4} fill="#FFB3A7" opacity={0.6} />
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
