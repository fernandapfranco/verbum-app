import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Card, ReviewTag, Screen, T } from '@/components/ui';
import { getBookIntro } from '@/content/bookIntros';
import { useReadSet } from '@/hooks/usePlan';
import { findBook } from '@/lib/bible/books';
import { vulgateToHebrew } from '@/lib/bible/psalms';
import { RADIUS, SPACE, useTheme } from '@/theme';

export default function Livro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const book = findBook(id);
  const read = useReadSet();
  if (!book) return null;
  const intro = getBookIntro(book.id);
  const isPsalms = book.id === 'salmos';

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: book.shortName }} />
      <T variant="display">{book.name}</T>
      {intro && (
        <Card tone="alt">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <T variant="label" color={c.goldText}>
              Antes de ler
            </T>
            <ReviewTag status={intro.status} />
          </View>
          <T>{intro.esperar}</T>
          <T variant="caption" muted>
            Quem escreveu: {intro.quem}
          </T>
          <T variant="caption" muted>
            Contexto: {intro.contexto}
          </T>
        </Card>
      )}
      {isPsalms && (
        <T variant="caption" muted>
          A numeração grande segue esta tradução (antiga). Embaixo, entre parênteses, a numeração das Bíblias atuais.
        </T>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm }}>
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => {
          const done = read.has(`${book.id}:${ch}`);
          const heb = isPsalms ? vulgateToHebrew(ch) : null;
          return (
            <Pressable
              key={ch}
              onPress={() =>
                router.push({ pathname: '/leitor/[livro]/[capitulo]', params: { livro: book.id, capitulo: String(ch) } })
              }
              accessibilityRole="button"
              accessibilityLabel={`Capítulo ${ch}${heb && heb !== String(ch) ? `, ${heb} na numeração atual` : ''}${done ? ', lido' : ''}`}
              style={({ pressed }) => ({
                width: 56,
                height: isPsalms ? 60 : 52,
                borderRadius: RADIUS.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: done ? c.primary : c.surface,
                borderWidth: 1,
                borderColor: done ? c.primary : c.border,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <T variant="bodyStrong" color={done ? c.onPrimary : c.text}>
                {ch}
              </T>
              {heb && heb !== String(ch) && (
                <T variant="caption" color={done ? c.onPrimary : c.textMuted} style={{ fontSize: 11, lineHeight: 13 }}>
                  ({heb})
                </T>
              )}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
