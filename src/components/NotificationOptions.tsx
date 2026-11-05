import { Switch, View } from 'react-native';

import { useSettings } from '@/store/settings';
import { SPACE, useTheme } from '@/theme';

import { Chip, Divider, T } from './ui';

export const TIME_OPTIONS = ['07:00', '12:30', '18:00', '20:00', '21:30'];

/** Lista de tipos de notificação com chaves (usada no onboarding e nos ajustes). */
export function NotificationOptions() {
  const { c } = useTheme();
  const prefs = useSettings((s) => s.notifications);
  const set = useSettings((s) => s.setNotifications);

  const Toggle = ({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md, minHeight: 56 }}>
      <View style={{ flex: 1 }}>
        <T variant="bodyStrong">{title}</T>
        <T variant="caption" muted>
          {subtitle}
        </T>
      </View>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={title} trackColor={{ true: c.primary, false: c.border }} />
    </View>
  );

  return (
    <View style={{ gap: SPACE.sm }}>
      <Toggle title="Lembrete diário" subtitle="Seu anjo lembra você de ler, com mensagens diferentes todo dia" value={prefs.daily} onChange={(v) => set({ daily: v })} />
      {prefs.daily && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm, paddingBottom: SPACE.sm }}>
          {TIME_OPTIONS.map((t) => (
            <Chip key={t} label={t} selected={prefs.time === t} onPress={() => set({ time: t })} />
          ))}
        </View>
      )}
      <Divider />
      <Toggle title="Ofensiva em risco" subtitle="Um aviso gentil às 20h30 se você ainda não fez o check-in" value={prefs.streakRisk} onChange={(v) => set({ streakRisk: v })} />
      <Divider />
      <Toggle
        title="Angelus e Regina Caeli"
        subtitle="Às 6h, 12h e 18h, um convite para rezar (Regina Caeli no tempo pascal). Toque para abrir a oração."
        value={prefs.angelus}
        onChange={(v) => set({ angelus: v })}
      />
    </View>
  );
}
