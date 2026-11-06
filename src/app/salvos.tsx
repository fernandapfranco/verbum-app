import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { View } from 'react-native';

import { AngelSays, Card, Screen, T } from '@/components/ui';
import { getVerses } from '@/db/bible';
import { listSavedVerses, useDataVersion } from '@/db/user';
import { refLabel } from '@/lib/bible/format';
import { FONTS, HIGHLIGHTS, SPACE, useTheme } from '@/theme';

export default function Salvos() {
  const { c, dark } = useTheme();
  const db = useSQLiteContext();
  const v = useDataVersion((s) => s.v);
  const items = useMemo(
    () =>
      listSavedVerses().map((s) => ({
        ...s,
        text: getVerses(db, s.bookId, s.chapter, s.verse, s.verse)[0]?.text ?? '',
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db, v],
  );

  return (
    <Screen edges={['bottom']}>
      {items.length === 0 ? (
        <AngelSays text="Quando um versículo tocar você, toque nele durante a leitura para destacar, favoritar ou anotar. Ele aparece aqui." />
      ) : (
        items.map((s) => (
          <Card
            key={`${s.bookId}-${s.chapter}-${s.verse}`}
            onPress={() =>
              router.push({ pathname: '/leitor/[livro]/[capitulo]', params: { livro: s.bookId, capitulo: String(s.chapter) } })
            }
            accessibilityLabel={refLabel(s.bookId, s.chapter, s.verse)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm }}>
              {s.color && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: HIGHLIGHTS[s.color][dark ? 'dark' : 'light'] }} />}
              <T variant="caption" color={c.goldText}>
                {refLabel(s.bookId, s.chapter, s.verse)}
                {s.favorite ? '  ★' : ''}
              </T>
            </View>
            <T style={{ fontFamily: FONTS.scripture }}>{s.text}</T>
            {s.note && (
              <T variant="caption" muted>
                ✎ {s.note}
              </T>
            )}
          </Card>
        ))
      )}
    </Screen>
  );
}
