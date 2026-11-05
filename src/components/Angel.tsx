/**
 * O anjo da guarda do Verbum — desenho original, vetorial.
 * Fase 1: estático, com três expressões. Fase 2: animações e itens.
 */
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { useTheme } from '@/theme';

export type AngelMood = 'feliz' | 'sereno' | 'festa';

export function Angel({ size = 96, mood = 'feliz' }: { size?: number; mood?: AngelMood }) {
  const { dark } = useTheme();
  const wing = dark ? '#C9D6F0' : '#DCE6F7';
  const wingLine = dark ? '#8FA6D6' : '#A9BDE3';
  const robe = dark ? '#F4EFE4' : '#FFFFFF';
  const robeLine = dark ? '#CFC5B0' : '#E4D9C4';
  const skin = '#F6D7BE';
  const ink = '#3A3226';
  const halo = '#D9AE5C';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityRole="image"
      accessibilityLabel="Seu anjo da guarda"
    >
      {/* asas */}
      <G>
        <Path d="M40 66 C18 56 10 38 20 30 C30 36 36 48 46 58 Z" fill={wing} stroke={wingLine} strokeWidth={1.5} />
        <Path d="M80 66 C102 56 110 38 100 30 C90 36 84 48 74 58 Z" fill={wing} stroke={wingLine} strokeWidth={1.5} />
        <Path d="M24 38 C30 44 34 50 40 56" stroke={wingLine} strokeWidth={1.2} fill="none" strokeLinecap="round" />
        <Path d="M96 38 C90 44 86 50 80 56" stroke={wingLine} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </G>
      {/* túnica */}
      <Path d="M60 56 C44 56 36 80 34 104 C46 110 74 110 86 104 C84 80 76 56 60 56 Z" fill={robe} stroke={robeLine} strokeWidth={1.5} />
      <Path d="M52 66 Q60 72 68 66" stroke={halo} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* cabeça */}
      <Circle cx={60} cy={42} r={19} fill={skin} />
      {/* cabelo */}
      <Path d="M42 40 C42 26 54 21 62 23 C70 21 80 28 78 40 C74 32 68 30 62 31 C56 30 48 32 42 40 Z" fill="#E9C27A" />
      {/* auréola */}
      <Ellipse cx={60} cy={15} rx={15} ry={4.5} fill="none" stroke={halo} strokeWidth={3} />
      {/* rosto */}
      {mood === 'sereno' ? (
        <G>
          <Path d="M50 44 Q53 46 56 44" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M64 44 Q67 46 70 44" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M56 51 Q60 53 64 51" stroke={ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </G>
      ) : (
        <G>
          <Path d="M50 45 Q53 41 56 45" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M64 45 Q67 41 70 45" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          {mood === 'festa' ? (
            <Path d="M54 50 Q60 58 66 50 Z" fill={ink} />
          ) : (
            <Path d="M55 50 Q60 55 65 50" stroke={ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          )}
        </G>
      )}
      <Circle cx={48} cy={49} r={3} fill="#F2A7A0" opacity={0.6} />
      <Circle cx={72} cy={49} r={3} fill="#F2A7A0" opacity={0.6} />
      {mood === 'festa' && (
        <G>
          <Path d="M14 18 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 Z" fill={halo} opacity={0.8} />
          <Path d="M102 12 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 Z" fill={halo} opacity={0.8} />
        </G>
      )}
    </Svg>
  );
}
