import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { AngelSays, Button, Card, Screen, T } from '@/components/ui';
import { listJournal, useDataVersion } from '@/db/user';
import { chapterLabel } from '@/lib/bible/format';
import { findBook } from '@/lib/bible/books';
import { useSettings } from '@/store/settings';
import { SPACE, useTheme } from '@/theme';

/** "lucas 15" → "Lucas 15"; outros textos ficam como estão. */
function refTitle(ref: string | null): string | null {
  if (!ref) return null;
  const m = ref.match(/^(\S+) (\d+)$/);
  if (m && findBook(m[1])) return chapterLabel(m[1], Number(m[2]));
  return ref;
}

export default function Diario() {
  const { c } = useTheme();
  const allowed = useSettings((s) => s.consent?.personalNotes ?? false);
  const v = useDataVersion((s) => s.v);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const entries = useMemo(() => (allowed ? listJournal() : []), [allowed, v]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACE.sm }}>
        <T variant="title">Diário espiritual</T>
      </View>

      {!allowed ? (
        <Card tone="soft">
          <T variant="heading">Seu diário está desligado</T>
          <T>
            Para escrever aqui, o Verbum precisa da sua permissão para guardar anotações pessoais (dados sensíveis pela
            LGPD). Tudo fica só no seu celular.
          </T>
          <Button title="Ativar em Privacidade e dados" kind="secondary" onPress={() => router.push('/privacidade')} />
        </Card>
      ) : (
        <>
          <Button
            title="Nova anotação"
            icon="add"
            onPress={() => router.push({ pathname: '/diario/editar', params: { prompt: 'O que Deus falou comigo hoje?' } })}
          />
          {entries.length === 0 ? (
            <AngelSays text="Seu diário ainda está em branco. Depois de ler, que tal anotar o que tocou seu coração?" mood="sereno" />
          ) : (
            entries.map((e) => (
              <Card
                key={e.id}
                onPress={() => router.push({ pathname: '/diario/editar', params: { id: String(e.id) } })}
                accessibilityLabel={`Anotação de ${new Date(e.createdAt).toLocaleDateString('pt-BR')}`}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T variant="caption" color={c.goldText}>
                    {new Date(e.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </T>
                  {e.ref && (
                    <T variant="caption" muted>
                      {refTitle(e.ref)}
                    </T>
                  )}
                </View>
                {e.prompt && (
                  <T variant="caption" muted>
                    {e.prompt}
                  </T>
                )}
                <T numberOfLines={4}>{e.text}</T>
              </Card>
            ))
          )}
        </>
      )}
    </Screen>
  );
}
