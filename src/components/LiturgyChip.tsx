import { View } from 'react-native';

import { today } from '@/lib/dates';
import { COLOR_HEX, liturgicalDay, SEASON_NAME } from '@/lib/liturgy';
import { useTheme } from '@/theme';

import { T } from './ui';

const COLOR_NAME = { roxo: 'roxo', branco: 'branco', verde: 'verde', vermelho: 'vermelho', rosa: 'rosa' } as const;

/** "● Tempo Comum" com a cor litúrgica do dia. */
export function LiturgyChip() {
  const { c } = useTheme();
  const d = liturgicalDay(today());
  const label = d.special ?? SEASON_NAME[d.season];
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: c.surface, borderRadius: 999, paddingHorizontal: 12, minHeight: 32 }}
      accessible
      accessibilityLabel={`${label}, cor litúrgica ${COLOR_NAME[d.color]}`}
    >
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLOR_HEX[d.color] }} />
      <T variant="caption" style={{ fontWeight: '600' }}>
        {label}
      </T>
    </View>
  );
}
