import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { LiturgyChip } from '@/components/LiturgyChip';
import { Card, Divider, Row, Screen, T } from '@/components/ui';
import { PRAYER_GROUPS, PRAYERS } from '@/content/prayers';
import { today } from '@/lib/dates';
import { isReginaCaeliTime } from '@/lib/liturgy';
import { SPACE, useTheme } from '@/theme';

export default function Orar() {
  const { c } = useTheme();
  const regina = isReginaCaeliTime(today());
  const hour = new Date().getHours();
  const marian = regina ? 'regina-caeli' : 'angelus';
  // Sugestão do momento: antes da leitura de manhã/à noite, Angelus perto de 6h/12h/18h.
  const nearAngelus = [6, 12, 18].some((h) => Math.abs(hour - h) <= 1);
  const suggested = nearAngelus ? marian : 'antes-da-leitura';
  const s = PRAYERS.find((p) => p.id === suggested)!;

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

      {PRAYER_GROUPS.map((g) => {
        const items = PRAYERS.filter((p) => p.grupo === g.id && (g.id !== 'do-dia' || p.id === marian));
        return (
          <View key={g.id} style={{ gap: SPACE.sm }}>
            <T variant="label" color={c.goldText}>
              {g.titulo}
            </T>
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

      <Card tone="alt">
        <View style={{ flexDirection: 'row', gap: SPACE.md, alignItems: 'center' }}>
          <Ionicons name="ellipse-outline" size={22} color={c.textMuted} />
          <View style={{ flex: 1 }}>
            <T variant="bodyStrong">Terço guiado</T>
            <T variant="caption" muted>
              Em breve: o terço com os mistérios do dia e um contador de contas.
            </T>
          </View>
        </View>
      </Card>
    </Screen>
  );
}
