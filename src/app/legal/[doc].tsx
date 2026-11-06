import { Stack, useLocalSearchParams } from 'expo-router';
import { Linking, View } from 'react-native';

import { Screen, T } from '@/components/ui';
import { LEGAL_VERSION, PRIVACY, TERMS } from '@/content/legal';
import { formatDate } from '@/lib/dates';
import { SPACE, useTheme } from '@/theme';

export default function LegalDoc() {
  const { c } = useTheme();
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const isPrivacy = doc === 'privacidade';
  const title = isPrivacy ? 'Política de Privacidade' : 'Termos de Uso';
  const sections = isPrivacy ? PRIVACY : TERMS;
  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title }} />
      <T variant="title">{title}</T>
      <T variant="caption" muted>
        Versão de {formatDate(LEGAL_VERSION)}
      </T>
      {sections.map((s) => (
        <View key={s.titulo} style={{ gap: SPACE.xs }}>
          <T variant="heading">{s.titulo}</T>
          <T>{s.corpo}</T>
          {s.link && (
            <T color={c.primary} onPress={() => Linking.openURL(s.link!.url)} accessibilityRole="link" style={{ textDecorationLine: 'underline' }}>
              {s.link.label}
            </T>
          )}
        </View>
      ))}
    </Screen>
  );
}
