import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { AngelSays, Card, Divider, Option, Screen, T } from '@/components/ui';
import { MYSTERIES } from '@/content/mysteries';
import { countPrayers, useDataVersion } from '@/db/user';
import { today, WEEKDAYS_SHORT } from '@/lib/dates';
import { mysteriesForDate, SET_NAME, SET_ORDER, type MysterySet } from '@/lib/rosary';
import { SPACE, useTheme } from '@/theme';

const DAYS: Record<MysterySet, string> = {
  gozosos: 'segunda e sábado',
  luminosos: 'quinta',
  dolorosos: 'terça e sexta',
  gloriosos: 'quarta e domingo',
};

export default function Terco() {
  const { c } = useTheme();
  const v = useDataVersion((s) => s.v);
  const todays = mysteriesForDate(today());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const count = useMemo(() => countPrayers('terco') + countPrayers('rosario'), [v]);
  const start = (conjunto: string) => router.push({ pathname: '/terco/rezar', params: { conjunto } });

  return (
    <Screen edges={['bottom']}>
      <AngelSays
        text={
          count > 0
            ? `Você já rezou ${count} ${count === 1 ? 'terço' : 'terços'} comigo. Vamos rezar mais um?`
            : 'Não precisa saber de cor: eu mostro cada oração na tela e conto as contas com você.'
        }
      />

      <Card tone="primary" onPress={() => start(todays)} accessibilityLabel={`Rezar os ${SET_NAME[todays]}, mistérios de hoje`}>
        <T variant="label" color={c.onPrimary} style={{ opacity: 0.85 }}>
          Mistérios de hoje · {WEEKDAYS_SHORT[new Date().getDay()]}
        </T>
        <T variant="title" color={c.onPrimary}>
          {SET_NAME[todays]}
        </T>
        <T color={c.onPrimary} style={{ opacity: 0.85 }}>
          {MYSTERIES[todays].map((m, i) => `${i + 1}. ${m.titulo}`).join('\n')}
        </T>
        <T variant="caption" color={c.onPrimary} style={{ opacity: 0.85 }}>
          Cerca de 20 minutos · toque para começar
        </T>
      </Card>

      <T variant="label" color={c.goldText}>
        Outros mistérios
      </T>
      <View style={{ gap: SPACE.sm }}>
        {SET_ORDER.filter((s) => s !== todays).map((s) => (
          <Option key={s} title={SET_NAME[s]} subtitle={`Rezados às ${DAYS[s]}`} selected={false} onPress={() => start(s)} />
        ))}
        <Option title="Rosário completo" subtitle="Os 20 mistérios seguidos · cerca de 1 hora" selected={false} onPress={() => start('rosario')} />
      </View>

      <Card tone="alt">
        <T variant="heading">Como se reza o terço</T>
        <T>• Começa com o Sinal da Cruz, o Creio, um Pai-Nosso, três Ave-Marias e um Glória.</T>
        <T>• Depois, cinco mistérios: em cada um, contemplamos uma cena da vida de Jesus e Maria e rezamos um Pai-Nosso, dez Ave-Marias e um Glória.</T>
        <T>• Termina com a Salve Rainha.</T>
        <Divider />
        <T variant="caption" muted>
          Não precisa de um terço físico: o contador do app faz esse papel. Se tiver um, use junto!
        </T>
      </Card>
    </Screen>
  );
}
