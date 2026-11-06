import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { LiturgyChip } from '@/components/LiturgyChip';
import { SacredIcon, TrailIcon, type SacredIconName } from '@/components/SacredIcon';
import { Card, Divider, Row, Screen, T } from '@/components/ui';
import { PRAYER_GROUPS, PRAYERS } from '@/content/prayers';
import { SERIES, TRAILS } from '@/content/trails';
import { today } from '@/lib/dates';
import { COLOR_HEX, isReginaCaeliTime, liturgicalDay, SEASON_NAME, yearDates } from '@/lib/liturgy';
import { mysteriesForDate, SET_NAME } from '@/lib/rosary';
import { SPACE, useTheme } from '@/theme';

const GROUP_ICON: Record<string, SacredIconName> = { leitura: 'biblia', 'do-dia': 'sino', basicas: 'cruz', marianas: 'maria', perdao: 'coracao' };

export default function Orar() {
  const { c } = useTheme();
  const regina = isReginaCaeliTime(today());
  const hour = new Date().getHours();
  const marian = regina ? 'regina-caeli' : 'angelus';
  // Sugestão do momento: antes da leitura de manhã/à noite, Angelus perto de 6h/12h/18h.
  const nearAngelus = [6, 12, 18].some((h) => Math.abs(hour - h) <= 1);
  const suggested = nearAngelus ? marian : 'antes-da-leitura';
  const s = PRAYERS.find((p) => p.id === suggested)!;
  const lit = liturgicalDay(today());
  // Trilhas do tempo litúrgico: a do tempo atual (ou a próxima) primeiro.
  const nextStart = (season: string): string => {
    if (lit.season === season || (season === 'quaresma' && lit.season === 'triduo')) return '0000-00-00';
    const y = new Date().getFullYear();
    const starts = [y, y + 1].map((yr) => (season === 'advento' ? yearDates(yr).adventStart : yearDates(yr).ashWednesday));
    return starts.find((d) => d >= today()) ?? '9999';
  };
  const trails = [...[...SERIES].sort((a, b) => (nextStart(a.season) < nextStart(b.season) ? -1 : 1)), ...TRAILS];

  return (
    <Screen>
      <View style={{ gap: SPACE.sm, marginTop: SPACE.sm }}>
        <T variant="title">Orar</T>
        <LiturgyChip />
      </View>

      <Card tone="primary" onPress={() => router.push({ pathname: '/oracao/[id]', params: { id: s.id } })} accessibilityLabel={`Rezar agora: ${s.titulo}`}>
        <T variant="label" color={c.onPrimary} style={{ opacity: 0.85 }}>
          Para agora
        </T>
        <T variant="title" color={c.onPrimary}>
          {s.titulo}
        </T>
        <T color={c.onPrimary} style={{ opacity: 0.85 }} numberOfLines={2}>
          {s.sobre}
        </T>
      </Card>

      <Card onPress={() => router.push('/terco')} accessibilityLabel={`Terço guiado: ${SET_NAME[mysteriesForDate(today())]}`}>
        <View style={{ flexDirection: 'row', gap: SPACE.md, alignItems: 'center' }}>
          <SacredIcon name="terco" size={30} color={c.primary} />
          <View style={{ flex: 1 }}>
            <T variant="heading">Terço guiado</T>
            <T variant="caption" muted>
              Hoje: {SET_NAME[mysteriesForDate(today())]} · com contador de contas
            </T>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
        </View>
      </Card>

      <Card onPress={() => router.push('/evangelho')} accessibilityLabel="Evangelho do dia">
        <View style={{ flexDirection: 'row', gap: SPACE.md, alignItems: 'center' }}>
          <SacredIcon name="biblia" size={30} color={c.primary} />
          <View style={{ flex: 1 }}>
            <T variant="heading">Evangelho do dia</T>
            <T variant="caption" muted>
              Segundo o Lecionário da Missa de hoje
            </T>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
        </View>
      </Card>

      <Card onPress={() => router.push('/tempos-liturgicos')} accessibilityLabel="Tempos litúrgicos: o que são, quando começam e terminam">
        <View style={{ flexDirection: 'row', gap: SPACE.md, alignItems: 'center' }}>
          <SacredIcon name="calendario" size={30} color={c.primary} />
          <View style={{ flex: 1 }}>
            <T variant="heading">Tempos litúrgicos</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLOR_HEX[lit.color] }} />
              <T variant="caption" muted>
                Agora: {SEASON_NAME[lit.season]} · quando começa e termina cada tempo
              </T>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
        </View>
      </Card>

      <View style={{ gap: SPACE.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm }}>
          <SacredIcon name="capela" size={18} color={c.goldText} />
          <T variant="label" color={c.goldText}>
            Trilhas
          </T>
        </View>
        <Card>
          {trails.map((t, i) => (
            <View key={t.id}>
              {i > 0 && <Divider />}
              <Row
                leading={<TrailIcon id={t.id} color={c.primary} />}
                title={t.titulo}
                subtitle={t.subtitulo}
                onPress={() => router.push({ pathname: '/trilha/[id]', params: { id: t.id } })}
              />
            </View>
          ))}
        </Card>
      </View>

      {PRAYER_GROUPS.map((g) => {
        const items = PRAYERS.filter((p) => p.grupo === g.id && (g.id !== 'do-dia' || p.id === marian));
        return (
          <View key={g.id} style={{ gap: SPACE.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm }}>
              <SacredIcon name={GROUP_ICON[g.id]} size={18} color={c.goldText} />
              <T variant="label" color={c.goldText}>
                {g.titulo}
              </T>
            </View>
            <Card>
              {items.map((p, i) => (
                <View key={p.id}>
                  {i > 0 && <Divider />}
                  <Row
                    title={p.titulo}
                    subtitle={p.id === 'regina-caeli' ? 'No lugar do Angelus, até Pentecostes' : p.id === 'angelus' ? 'Às 6h, 12h e 18h' : undefined}
                    onPress={() => router.push({ pathname: '/oracao/[id]', params: { id: p.id } })}
                  />
                </View>
              ))}
            </Card>
          </View>
        );
      })}

    </Screen>
  );
}
