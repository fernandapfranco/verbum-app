import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';

import { AngelSays, Button, Card, Screen, T } from '@/components/ui';
import { TalentIcon } from '@/components/TalentIcon';
import { WeekStrip } from '@/components/WeekStrip';
import { buyCandle } from '@/db/user';
import { useGamification } from '@/hooks/useGamification';
import { CANDLE_PRICE, MAX_CANDLES, REWARDS } from '@/lib/streak';
import { SPACE, useTheme } from '@/theme';

export default function Ofensiva() {
  const { c } = useTheme();
  const g = useGamification();
  const [msg, setMsg] = useState<string | null>(null);

  const buy = () => {
    const r = buyCandle();
    setMsg(
      r === 'ok'
        ? 'Vela guardada! Se algum dia não der, ela protege sua ofensiva. 🕯️'
        : r === 'limite'
          ? `Você já tem ${MAX_CANDLES} velas, o máximo. Elas ficam guardadas até precisar.`
          : `Faltam ${CANDLE_PRICE - g.talentos} talentos. Cada check-in rende ${REWARDS.checkin}.`,
    );
  };

  return (
    <Screen edges={['bottom']}>
      <View style={{ alignItems: 'center', gap: SPACE.xs }}>
        <Ionicons name="flame" size={56} color="#E8902A" />
        <T variant="display">{g.streak}</T>
        <T muted>{g.streak === 1 ? 'dia de ofensiva' : 'dias de ofensiva'}</T>
      </View>

      <Card>
        <T variant="label" color={c.goldText}>
          Esta semana
        </T>
        <WeekStrip week={g.week} />
        <T variant="caption" muted>
          {g.checkedInToday ? 'Check-in de hoje feito ✓' : 'Leia um capítulo ou faça uma lição para fazer o check-in de hoje.'}
        </T>
      </Card>

      <Card>
        <T variant="heading">Como funciona</T>
        <T>• A primeira leitura ou lição do dia é o seu check-in: +{REWARDS.checkin} talentos.</T>
        <T>• A cada 7 dias seguidos, +{REWARDS.weekBonus} de bônus.</T>
        <T>• Perdeu um dia? Se tiver uma vela, ela é acesa sozinha e sua ofensiva continua.</T>
        <T>• Sem vela, a ofensiva recomeça — e tudo bem. O importante é voltar. 💛</T>
      </Card>

      <Card tone="soft">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T variant="heading">Suas velas</T>
          <T variant="bodyStrong">
            {g.velas} / {MAX_CANDLES}
          </T>
        </View>
        <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
          {Array.from({ length: MAX_CANDLES }, (_, i) => (
            <Ionicons key={i} name={i < g.velas ? 'flame' : 'flame-outline'} size={28} color={i < g.velas ? c.gold : c.textMuted} accessibilityLabel={i < g.velas ? 'vela' : 'espaço vazio'} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm }}>
          <TalentIcon size={22} />
          <T>Você tem {g.talentos} talentos.</T>
        </View>
        <Button title={`Comprar vela · ${CANDLE_PRICE} talentos`} icon="flame-outline" onPress={buy} />
        {msg && <T variant="caption">{msg}</T>}
      </Card>

      <Card tone="alt">
        <T variant="heading">Ofensiva com amigos</T>
        <T muted>
          Em breve: ler junto com amigos e manter uma ofensiva compartilhada. Precisa de conta e servidor, então chega com a
          parte social.
        </T>
      </Card>

      {g.streak === 0 && <AngelSays text="Toda ofensiva começa com um dia. Que tal hoje?" />}
    </Screen>
  );
}
