import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Angel } from '@/components/Angel';
import { Button, T } from '@/components/ui';
import { useGamification } from '@/hooks/useGamification';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

/** Comemoração do check-in diário. */
export default function Checkin() {
  const { c } = useTheme();
  const p = useLocalSearchParams<{ streak?: string; reward?: string; bonus?: string }>();
  const g = useGamification();
  const reward = Number(p.reward ?? 0);
  const bonus = Number(p.bonus ?? 0);
  const streak = Number(p.streak ?? g.streak);

  const message =
    streak <= 1
      ? 'Primeiro dia da sua ofensiva! Todo grande caminho começa com um passo.'
      : bonus > 0
        ? `${streak} dias seguidos! Ganhou um bônus por mais uma semana completa.`
        : `${streak} dias seguidos. Até bati as asinhas de alegria!`;

  const Stat = ({ value, label }: { value: number; label: string }) => (
    <View style={{ backgroundColor: c.surface, borderRadius: RADIUS.md, paddingVertical: SPACE.md, paddingHorizontal: SPACE.lg, alignItems: 'center', minWidth: 88 }}>
      <T variant="title">{value}</T>
      <T variant="caption" muted>
        {label}
      </T>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.primarySoft }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE.xl, gap: SPACE.lg }}>
        <Angel size={150} mood="festa" />
        <T variant="label" color={c.goldText}>
          Check-in feito
        </T>
        <T style={{ fontFamily: FONTS.uiBold, fontSize: 40, lineHeight: 48 }} accessibilityLabel={`Mais ${reward + bonus} talentos`}>
          +{reward + bonus} talentos
        </T>
        <T style={{ textAlign: 'center' }}>{message}</T>
        <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
          <Stat value={streak} label={streak === 1 ? 'dia' : 'dias'} />
          <Stat value={g.talentos} label="talentos" />
          <Stat value={g.velas} label={g.velas === 1 ? 'vela' : 'velas'} />
        </View>
        <T variant="caption" muted style={{ textAlign: 'center' }}>
          Talentos compram velas de proteção: se um dia não der, a vela guarda sua ofensiva.
        </T>
        <Button title="Continuar" onPress={() => router.back()} style={{ alignSelf: 'stretch' }} />
      </View>
    </SafeAreaView>
  );
}
