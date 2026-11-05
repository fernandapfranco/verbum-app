/**
 * O anjo da guarda do Verbum — identidade "Luz".
 * Formas simples e chapadas, sem contorno. Túnica azul mariano com um ponto
 * de luz no peito, que brilha mais nas comemorações.
 * Expressões: feliz (padrão), sereno (olhos fechados) e festa (asas para cima).
 */
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

export type AngelMood = 'feliz' | 'sereno' | 'festa';

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
  const wing = onPrimary ? '#DCE2FF' : dark ? '#3A4590' : '#DCE2FF';
  const robe = onPrimary ? '#FFFFFF' : '#2F45D6';
  const skin = '#FFE2CC';
  const ink = '#12142B';
  const light = '#F2B544';
  const party = mood === 'festa';

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityRole="image" accessibilityLabel="Seu anjo da guarda">
      {party && <Circle cx={60} cy={64} r={54} fill={onPrimary ? '#FFFFFF' : light} opacity={onPrimary ? 0.1 : 0.14} />}
      {/* auréola */}
      <Ellipse cx={60} cy={16} rx={20} ry={5.5} fill="none" stroke={light} strokeWidth={4} />
      {/* asas */}
      {party ? (
        <G>
          <Path d="M38 62 C18 54 10 32 16 22 C30 28 38 42 46 54 Z" fill={wing} />
          <Path d="M82 62 C102 54 110 32 104 22 C90 28 82 42 74 54 Z" fill={wing} />
        </G>
      ) : (
        <G>
          <Path d="M38 66 C20 62 12 44 18 34 C30 38 38 48 46 58 Z" fill={wing} />
          <Path d="M82 66 C100 62 108 44 102 34 C90 38 82 48 74 58 Z" fill={wing} />
        </G>
      )}
      {/* túnica */}
      <Rect x={38} y={56} width={44} height={54} rx={22} fill={robe} />
      <Circle cx={60} cy={78} r={party ? 6.5 : 5} fill={light} />
      {party && <Circle cx={60} cy={78} r={11} fill={light} opacity={0.25} />}
      {/* cabeça */}
      <Circle cx={60} cy={42} r={20} fill={skin} />
      {mood === 'sereno' ? (
        <G>
          <Path d="M50 43 Q53 46 56 43" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Path d="M64 43 Q67 46 70 43" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Path d="M55 50 Q60 53 65 50" stroke={ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </G>
      ) : party ? (
        <G>
          <Path d="M50 42 Q53 38 56 42" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Path d="M64 42 Q67 38 70 42" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Path d="M53 49 Q60 57 67 49 Z" fill={ink} />
        </G>
      ) : (
        <G>
          <Circle cx={53} cy={42} r={2.8} fill={ink} />
          <Circle cx={67} cy={42} r={2.8} fill={ink} />
          <Path d="M54 50 Q60 55 66 50" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </G>
      )}
      <Circle cx={47} cy={48} r={3} fill="#FFB3A7" opacity={0.55} />
      <Circle cx={73} cy={48} r={3} fill="#FFB3A7" opacity={0.55} />
      {party && (
        <G>
          <Path d="M14 18 l2.5 5 l5.5 1 l-4 3.5 l1 5.5 l-5 -2.7 l-5 2.7 l1 -5.5 l-4 -3.5 l5.5 -1 Z" fill={light} />
          <Path d="M104 10 l2 4 l4 0.8 l-3 2.8 l0.8 4 l-3.8 -2 l-3.8 2 l0.8 -4 l-3 -2.8 l4 -0.8 Z" fill={light} />
        </G>
      )}
    </Svg>
  );
}
