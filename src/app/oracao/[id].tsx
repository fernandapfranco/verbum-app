import { Stack, router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, ReviewTag, Screen, T } from '@/components/ui';
import { getPrayer } from '@/content/prayers';
import { FONTS, SPACE, useTheme } from '@/theme';

/** Uma oração, com versículo (V.) e resposta (R.) destacados. */
export default function Oracao() {
  const { id, depois } = useLocalSearchParams<{ id: string; depois?: string }>();
  const { c } = useTheme();
  const p = getPrayer(id);
  if (!p) return null;

  const blocks = p.texto.split('\n\n');

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: p.titulo }} />
      <T variant="display">{p.titulo}</T>
      <Card>
        <View style={{ gap: SPACE.lg }}>
          {blocks.map((b, i) => (
            <View key={i} style={{ gap: 4 }}>
              {b.split('\n').map((line, k) => {
                const isV = line.startsWith('V. ');
                const isR = line.startsWith('R. ');
                const isOremos = line.startsWith('Oremos:');
                return (
                  <T
                    key={k}
                    style={{
                      fontFamily: isR ? FONTS.scriptureBold : isOremos ? FONTS.scriptureItalic : FONTS.scripture,
                      fontSize: 20,
                      lineHeight: 31,
                    }}
                  >
                    {(isV || isR) && (
                      <T style={{ fontFamily: FONTS.uiBold, fontSize: 15 }} color={c.primary}>
                        {line.slice(0, 2)}{' '}
                      </T>
                    )}
                    {isV || isR ? line.slice(3) : line}
                  </T>
                );
              })}
            </View>
          ))}
        </View>
      </Card>
      {p.texto.includes('V. ') && (
        <T variant="caption" muted>
          V. = quem conduz · R. = todos respondem. Rezando sozinho, diga as duas partes.
        </T>
      )}
      <Card tone="alt">
        <T variant="label" muted>
          Sobre esta oração
        </T>
        <T>{p.sobre}</T>
        {p.propria && (
          <T variant="caption" muted>
            Oração escrita para o Verbum.
          </T>
        )}
        <ReviewTag status={p.status} />
      </Card>
      {depois === 'leitura' && <Button title="Começar a leitura" icon="book-outline" onPress={() => router.back()} />}
    </Screen>
  );
}
