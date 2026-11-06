/**
 * Ícones religiosos próprios do Verbum, em traço (mesmo peso dos Ionicons
 * "outline"). `accent` colore chamas, estrelas e coroas (dourado-luz por padrão).
 */
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

export type SacredIconName =
  | 'terco'
  | 'coroa-advento'
  | 'estrela'
  | 'cruz'
  | 'calvario'
  | 'cirio'
  | 'trigo'
  | 'biblia'
  | 'calendario'
  | 'sino'
  | 'maria'
  | 'coracao'
  | 'capela';

const GOLD = '#F2B544';
const ROSE = '#D9779B';

export function SacredIcon({
  name,
  size = 24,
  color,
  accent = GOLD,
}: {
  name: SacredIconName;
  size?: number;
  color: string;
  accent?: string;
}) {
  const s = { stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {draw(name, s, color, accent)}
    </Svg>
  );
}

type Stroke = { stroke: string; strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round'; fill: string };

const flame = (cx: number, base: number, h = 3.4) =>
  `M${cx} ${base} C${cx - 1.3} ${base - h * 0.35} ${cx - 0.9} ${base - h * 0.75} ${cx} ${base - h} C${cx + 0.9} ${base - h * 0.75} ${cx + 1.3} ${base - h * 0.35} ${cx} ${base}Z`;

function draw(name: SacredIconName, s: Stroke, color: string, accent: string) {
  switch (name) {
    case 'terco': {
      // Dez contas em volta, a medalha embaixo e o crucifixo.
      const beads = Array.from({ length: 10 }, (_, i) => {
        const a = ((120 + i * 33.3) * Math.PI) / 180;
        return <Circle key={i} cx={12 + 6.2 * Math.cos(a)} cy={8 + 6.2 * Math.sin(a)} r={1.15} fill={color} />;
      });
      return (
        <G>
          {beads}
          <Circle cx={12} cy={14.6} r={1.2} {...s} strokeWidth={1.4} />
          <Path d="M12 15.8 V17.4 M12 17.6 V23 M9.9 19.4 H14.1" {...s} />
        </G>
      );
    }
    case 'coroa-advento':
      return (
        <G>
          <Ellipse cx={12} cy={19.4} rx={9.8} ry={2.6} {...s} />
          <Path d="M3.6 20.6 l1.2 -1.4 M7 21.6 l1 -1.5 M17 21.6 l-1 -1.5 M20.4 20.6 l-1.2 -1.4" {...s} strokeWidth={1.3} />
          {[4.6, 8.8, 13.0, 17.2].map((x, i) => (
            <G key={x}>
              <Rect x={x} y={i === 1 || i === 2 ? 9.5 : 11} width={2.2} height={i === 1 || i === 2 ? 9 : 7.5} rx={0.6} {...s} stroke={i === 2 ? ROSE : color} strokeWidth={1.5} />
              <Path d={flame(x + 1.1, i === 1 || i === 2 ? 8.6 : 10.1, 3)} fill={accent} />
            </G>
          ))}
        </G>
      );
    case 'estrela':
      return (
        <G>
          <Path d="M12 1.8 L13.4 6.6 L18.6 8.2 L13.4 9.8 L12 22.2 L10.6 9.8 L5.4 8.2 L10.6 6.6 Z" fill={accent} stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
          <Path d="M4.5 3 V5.4 M3.3 4.2 H5.7 M19.6 13.2 V15.6 M18.4 14.4 H20.8" {...s} strokeWidth={1.3} />
        </G>
      );
    case 'cruz':
      return <Path d="M10.5 2 H13.5 V7.2 H18.5 V10.2 H13.5 V22 H10.5 V10.2 H5.5 V7.2 H10.5 Z" {...s} />;
    case 'calvario':
      return (
        <G>
          <Path d="M1.5 22 Q12 15.5 22.5 22" {...s} />
          <Path d="M12 2.5 V18 M8.6 6.8 H15.4" {...s} strokeWidth={2} />
          <Path d="M5 10.5 V19.8 M3.2 13 H6.8 M19 10.5 V19.8 M17.2 13 H20.8" {...s} />
        </G>
      );
    case 'cirio':
      return (
        <G>
          <Path d={flame(12, 7, 5)} fill={accent} />
          <Path d="M7.4 3.8 L8.7 4.8 M16.6 3.8 L15.3 4.8 M6.6 7.2 H8.1 M17.4 7.2 H15.9" {...s} stroke={accent} strokeWidth={1.4} />
          <Rect x={8.6} y={8.4} width={6.8} height={13.8} rx={1} {...s} />
          <Path d="M12 11.2 V17.4 M9.9 13.3 H14.1" {...s} strokeWidth={1.5} />
          <Circle cx={10.4} cy={19.6} r={0.55} fill={color} />
          <Circle cx={13.6} cy={19.6} r={0.55} fill={color} />
        </G>
      );
    case 'trigo': {
      const grain = (y: number) => (
        <G key={y}>
          <Path d={`M12 ${y} C9.4 ${y - 0.4} 8.6 ${y - 2.4} 9.2 ${y - 3.8} C10.9 ${y - 3.2} 12 ${y - 1.9} 12 ${y}Z`} {...s} strokeWidth={1.4} />
          <Path d={`M12 ${y} C14.6 ${y - 0.4} 15.4 ${y - 2.4} 14.8 ${y - 3.8} C13.1 ${y - 3.2} 12 ${y - 1.9} 12 ${y}Z`} {...s} strokeWidth={1.4} />
        </G>
      );
      return (
        <G>
          <Path d="M12 22.5 V5.2" {...s} />
          <Path d="M12 5.4 C11 4 11.2 2.6 12 1.5 C12.8 2.6 13 4 12 5.4Z" {...s} strokeWidth={1.4} />
          {[8.6, 12.4, 16.2].map(grain)}
          <Path d="M12 21 C14 20.2 16 18.4 16.6 16.8" {...s} strokeWidth={1.4} />
        </G>
      );
    }
    case 'biblia':
      return (
        <G>
          <Rect x={4.8} y={2.5} width={14.4} height={19} rx={1.6} {...s} />
          <Path d="M7.6 2.8 V21.2" {...s} strokeWidth={1.4} />
          <Path d="M13.4 6.8 V15.4 M10.6 9.6 H16.2" {...s} stroke={accent} strokeWidth={1.9} />
        </G>
      );
    case 'calendario':
      return (
        <G>
          <Rect x={3} y={4.6} width={18} height={16.8} rx={2.6} {...s} />
          <Path d="M3.2 9.6 H20.8 M8 2.6 V6.4 M16 2.6 V6.4" {...s} />
          <Path d="M12 11.8 V19 M9.4 14 H14.6" {...s} stroke={accent} strokeWidth={1.9} />
        </G>
      );
    case 'sino':
      return (
        <G>
          <Path d="M12 1.6 V3.4" {...s} />
          <Path d="M12 3.4 C8.4 3.4 6.6 6.2 6.6 9.6 V13.8 L4.6 17.4 H19.4 L17.4 13.8 V9.6 C17.4 6.2 15.6 3.4 12 3.4Z" {...s} />
          <Path d="M12 7 V12.4 M10 8.8 H14" {...s} stroke={accent} strokeWidth={1.5} />
          <Path d="M10.2 19.6 a1.8 1.8 0 0 0 3.6 0" {...s} />
        </G>
      );
    case 'maria':
      return (
        <G>
          <Path d="M7 7.6 L8.4 3.4 L10.2 5.8 L12 2.6 L13.8 5.8 L15.6 3.4 L17 7.6 Z" fill={accent} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
          <Path d="M5 21 V10 L12 17.4 L19 10 V21" {...s} strokeWidth={2} />
        </G>
      );
    case 'coracao':
      return (
        <G>
          <Path d="M12 21.6 C6.4 17.6 3.4 14.6 3.4 11 C3.4 8.6 5.2 6.8 7.5 6.8 C9.3 6.8 10.9 7.8 12 9.4 C13.1 7.8 14.7 6.8 16.5 6.8 C18.8 6.8 20.6 8.6 20.6 11 C20.6 14.6 17.6 17.6 12 21.6Z" {...s} />
          <Path d="M12 1.6 V7.4 M10 3.4 H14" {...s} stroke={accent} strokeWidth={1.8} />
        </G>
      );
    case 'capela':
      return (
        <G>
          <Path d="M12 1.6 V5.6 M10.3 3 H13.7" {...s} stroke={accent} strokeWidth={1.8} />
          <Path d="M4 21.6 V12 L12 6 L20 12 V21.6 Z" {...s} />
          <Path d="M10 21.6 V17.6 a2 2 0 0 1 4 0 V21.6" {...s} />
          <Path d="M2.6 21.6 H21.4" {...s} />
        </G>
      );
  }
}
