import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, T } from '@/components/ui';
import { useReadSet } from '@/hooks/usePlan';
import { BOOKS, GROUP_ORDER, type Book, type Testament } from '@/lib/bible/books';
import { RADIUS, SPACE, useTheme } from '@/theme';

export default function Biblia() {
  const { c } = useTheme();
  const [testament, setTestament] = useState<Testament>('NT');
  const read = useReadSet();

  const sections = useMemo(
    () =>
      GROUP_ORDER.map((g) => ({
        title: g,
        data: BOOKS.filter((b) => b.group === g && b.testament === testament),
      })).filter((s) => s.data.length > 0),
    [testament],
  );

  const readCount = (b: Book) => {
    let n = 0;
    for (let i = 1; i <= b.chapters; i++) if (read.has(`${b.id}:${i}`)) n++;
    return n;
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingHorizontal: SPACE.lg, paddingTop: SPACE.md, gap: SPACE.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T variant="title">Bíblia</T>
          <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
            <IconButton icon="bookmark-outline" label="Versículos salvos" onPress={() => router.push('/salvos')} />
            <IconButton icon="search" label="Buscar na Bíblia" onPress={() => router.push('/busca')} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
          <Chip label="Antigo Testamento" selected={testament === 'AT'} onPress={() => setTestament('AT')} />
          <Chip label="Novo Testamento" selected={testament === 'NT'} onPress={() => setTestament('NT')} />
        </View>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 2 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <T variant="label" color={c.goldText} style={{ marginTop: SPACE.lg, marginBottom: SPACE.sm }}>
            {section.title}
          </T>
        )}
        renderItem={({ item: b }) => {
          const n = readCount(b);
          return (
            <Pressable
              onPress={() => router.push({ pathname: '/livro/[id]', params: { id: b.id } })}
              accessibilityRole="button"
              accessibilityLabel={`${b.name}, ${b.chapters} capítulos${n ? `, ${n} lidos` : ''}`}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACE.md,
                paddingVertical: SPACE.md,
                minHeight: 52,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 46,
                  height: 36,
                  borderRadius: RADIUS.sm,
                  backgroundColor: n === b.chapters ? c.gold : c.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <T variant="caption" style={{ fontWeight: '600' }} color={n === b.chapters ? '#2A1E05' : c.text}>
                  {b.abbrev}
                </T>
              </View>
              <View style={{ flex: 1 }}>
                <T variant="bodyStrong">
                  {b.shortName}
                  {b.deuterocanonical ? ' ·' : ''}
                </T>
                <T variant="caption" muted>
                  {b.chapters} {b.chapters === 1 ? 'capítulo' : 'capítulos'}
                  {n > 0 ? ` · ${n} lido${n > 1 ? 's' : ''}` : ''}
                  {b.oldName ? ` · antigo "${b.oldName}"` : ''}
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
            </Pressable>
          );
        }}
        ListFooterComponent={
          testament === 'AT' ? (
            <T variant="caption" muted style={{ marginTop: SPACE.lg }}>
              · Livros deuterocanônicos: fazem parte do cânon católico (73 livros).
            </T>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

function IconButton({ icon, label, onPress }: { icon: 'search' | 'bookmark-outline'; label: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface }}
    >
      <Ionicons name={icon} size={22} color={c.primary} />
    </Pressable>
  );
}
