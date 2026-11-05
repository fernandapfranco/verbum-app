import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { AngelSays, Card, ProgressBar, Screen, T } from '@/components/ui';
import { getTrail } from '@/content/trails';
import { getCompletedLessons, useDataVersion } from '@/db/user';
import { SPACE, useTheme } from '@/theme';

export default function Trilha() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const trail = getTrail(id);
  const v = useDataVersion((s) => s.v);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const done = useMemo(() => getCompletedLessons(id), [id, v]);
  if (!trail) return null;
  const nextIdx = trail.licoes.findIndex((l) => !done.has(l.id));

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: trail.titulo }} />
      <T variant="display">{trail.titulo}</T>
      <AngelSays text={trail.paraQuem} />
      <ProgressBar value={done.size / trail.licoes.length} label="Progresso da trilha" />
      <T variant="caption" muted>
        {done.size} de {trail.licoes.length} lições
      </T>
      <View style={{ gap: SPACE.md }}>
        {trail.licoes.map((l, i) => {
          const isDone = done.has(l.id);
          const isNext = i === nextIdx;
          return (
            <Card
              key={l.id}
              tone={isNext ? 'soft' : 'surface'}
              onPress={() => router.push({ pathname: '/licao/[trilha]/[licao]', params: { trilha: trail.id, licao: l.id } })}
              accessibilityLabel={`Lição ${i + 1}: ${l.titulo}${isDone ? ', concluída' : ''}`}
            >
              <View style={{ flexDirection: 'row', gap: SPACE.md, alignItems: 'center' }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDone ? c.gold : isNext ? c.primary : c.surfaceAlt,
                  }}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={20} color="#2A1E05" />
                  ) : (
                    <T variant="bodyStrong" color={isNext ? c.onPrimary : c.text}>
                      {i + 1}
                    </T>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <T variant="bodyStrong">{l.titulo}</T>
                  <T variant="caption" muted>
                    {l.resumo} · {l.minutos} min
                  </T>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
