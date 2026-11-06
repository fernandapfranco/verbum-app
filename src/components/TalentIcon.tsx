/**
 * Ícone dos talentos: uma moeda dourada antiga com uma pequena cruz,
 * lembrando a parábola dos talentos (Mt 25,14-30).
 */
import Svg, { Circle, Path } from 'react-native-svg';

export function TalentIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      <Circle cx={12} cy={12} r={10.5} fill="#F2B544" />
      <Circle cx={12} cy={12} r={7.6} fill="none" stroke="#C98A12" strokeWidth={1.4} />
      <Path d="M12 7.6 V16.4 M8.6 10.8 H15.4" stroke="#8A5A00" strokeWidth={2} strokeLinecap="round" />
      <Path d="M5.6 7.4 A8 8 0 0 1 9 4.6" stroke="#FFE3A3" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
