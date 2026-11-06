import { View } from 'react-native';

import { Card, ReviewTag, Screen, T } from '@/components/ui';
import { GLOSSARY } from '@/content/glossary';
import { SPACE, useTheme } from '@/theme';

export default function Glossario() {
  const { c } = useTheme();
  const fe = GLOSSARY.filter((g) => !g.antiga).sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR'));
  const antigas = GLOSSARY.filter((g) => g.antiga).sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR'));
  return (
    <Screen edges={['bottom']}>
      <T muted>Durante a leitura, toque nas palavras sublinhadas para ver o significado aqui explicado.</T>
      <T variant="label" color={c.goldText}>
        Termos da fé
      </T>
      {fe.map((g) => (
        <Card key={g.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACE.sm }}>
            <T variant="heading" style={{ flex: 1 }}>
              {g.termo}
            </T>
            <ReviewTag status={g.status} />
          </View>
          <T>{g.definicao}</T>
          {g.fontes && g.fontes.length > 0 && (
            <T variant="caption" muted>
              {g.fontes.join(' · ')}
            </T>
          )}
        </Card>
      ))}
      <T variant="label" color={c.goldText} style={{ marginTop: SPACE.lg }}>
        Palavras antigas da tradução
      </T>
      <Card>
        {antigas.map((g) => (
          <T key={g.id}>
            <T variant="bodyStrong">{g.termo}</T> — {g.definicao}
          </T>
        ))}
      </Card>
    </Screen>
  );
}
