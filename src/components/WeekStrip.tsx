import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { parseISODate } from '@/lib/dates';
import type { WeekDayState } from '@/lib/streak';
import { SPACE, useTheme } from '@/theme';

import { T } from './ui';

const LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const LABEL: Record<WeekDayState, string> = {
  checkin: 'check-in feito',
  protegido: 'protegido por vela',
  vazio: 'sem check-in',
  hoje: 'hoje, ainda sem check-in',
  futuro: 'ainda não chegou',
};

export function WeekStrip({ week }: { week: { date: string; state: WeekDayState }[] }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {week.map(({ date, state }) => {
        const d = parseISODate(date);
        const bg = state === 'checkin' ? c.gold : state === 'protegido' ? c.primarySoft : c.surfaceAlt;
        return (
          <View key={date} style={{ alignItems: 'center', gap: SPACE.xs }} accessible accessibilityLabel={`${d.getDate()}: ${LABEL[state]}`}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: bg,
                borderWidth: state === 'hoje' || state === 'protegido' ? 2 : 0,
                borderColor: c.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {state === 'checkin' && <Ionicons name="checkmark" size={18} color="#2A1E05" />}
              {state === 'protegido' && <Ionicons name="flame" size={16} color={c.primary} />}
            </View>
            <T variant="caption" muted>
              {LETTERS[d.getDay()]}
            </T>
          </View>
        );
      })}
    </View>
  );
}
