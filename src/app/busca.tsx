import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { T } from '@/components/ui';
import { searchVerses } from '@/db/bible';
import { refLabel } from '@/lib/bible/format';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

/** Divide "[termo]" do snippet em partes destacadas. */
function Snippet({ text }: { text: string }) {
  const { c } = useTheme();
  const parts = text.split(/(\[[^\]]*\])/g);
  return (
    <T style={{ fontFamily: FONTS.scripture }}>
      {parts.map((p, i) =>
        p.startsWith('[') ? (
          <T key={i} style={{ fontFamily: FONTS.scriptureBold, backgroundColor: c.primarySoft }}>
            {p.slice(1, -1)}
          </T>
        ) : (
          p
        ),
      )}
    </T>
  );
}

export default function Busca() {
  const { c } = useTheme();
  const db = useSQLiteContext();
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const { hits, failed } = useMemo(() => {
    if (dq.trim().length < 3) return { hits: [], failed: false };
    try {
      return { hits: searchVerses(db, dq), failed: false };
    } catch {
      return { hits: [], failed: true };
    }
  }, [db, dq]);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ padding: SPACE.lg }}>
        <TextInput
          value={q}
          onChangeText={setQ}
          autoFocus
          placeholder="Ex.: misericórdia, pastor, filho pródigo"
          placeholderTextColor={c.textMuted}
          accessibilityLabel="Buscar palavras na Bíblia"
          returnKeyType="search"
          style={{
            fontFamily: FONTS.ui,
            fontSize: 17,
            color: c.text,
            backgroundColor: c.surface,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: c.border,
            padding: SPACE.md,
          }}
        />
      </View>
      <FlatList
        data={hits}
        keyExtractor={(h) => `${h.bookId}-${h.chapter}-${h.verse}`}
        contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl, gap: SPACE.md }}
        ListEmptyComponent={
          failed ? (
            <T muted>Não foi possível buscar agora. Tente de novo em instantes.</T>
          ) : dq.trim().length >= 3 ? (
            <T muted>Nada encontrado. Tente outra palavra.</T>
          ) : (
            <T muted>Digite pelo menos 3 letras.</T>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/leitor/[livro]/[capitulo]', params: { livro: item.bookId, capitulo: String(item.chapter) } })
            }
            accessibilityRole="button"
            style={({ pressed }) => ({ gap: 4, opacity: pressed ? 0.7 : 1 })}
          >
            <T variant="caption" color={c.goldText}>
              {refLabel(item.bookId, item.chapter, item.verse)}
            </T>
            <Snippet text={item.snippet} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
