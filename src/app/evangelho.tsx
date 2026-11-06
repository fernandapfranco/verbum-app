import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { GlossarySheet } from '@/components/GlossarySheet';
import { LiturgyChip } from '@/components/LiturgyChip';
import { Passage } from '@/components/Passage';
import { AngelSays, Button, Card, Screen, T } from '@/components/ui';
import type { GlossaryTerm } from '@/content/glossary';
import { getPassage } from '@/db/bible';
import { useCheckin } from '@/hooks/useGamification';
import { parseRef } from '@/lib/bible/refs';
import { formatDate, today } from '@/lib/dates';
import { gospelOfDay } from '@/lib/lectionary';
import { useSettings } from '@/store/settings';
import { RADIUS, READER_THEMES, SPACE, useTheme } from '@/theme';

/** Evangelho do dia, segundo o Lecionário, no texto da nossa tradução. */
export default function Evangelho() {
  const { data } = useLocalSearchParams<{ data?: string }>();
  const date = data ?? today();
  const db = useSQLiteContext();
  const { c, dark } = useTheme();
  const reader = useSettings((s) => s.reader);
  const notesAllowed = useSettings((s) => s.consent?.personalNotes ?? false);
  const checkin = useCheckin();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [done, setDone] = useState(false);

  const g = gospelOfDay(date);
  const groups = useMemo(() => (g ? getPassage(db, parseRef(g.ref)) : []), [db, g?.ref]); // eslint-disable-line react-hooks/exhaustive-deps
  const palette = dark ? READER_THEMES.noturno : READER_THEMES[reader.theme === 'noturno' ? 'claro' : reader.theme];

  if (!g) {
    return (
      <Screen edges={['bottom']}>
        <AngelSays
          text="Hoje é Sábado Santo: a Igreja fica em silêncio junto ao sepulcro e não há Missa durante o dia. À noite, a Vigília Pascal anuncia a Ressurreição."
          mood="sereno"
        />
      </Screen>
    );
  }

  const finish = () => {
    setDone(true);
    const r = checkin('leitura');
    if (r.isNew)
      router.push({ pathname: '/checkin', params: { streak: String(r.streak), reward: String(r.reward), bonus: String(r.bonus) } });
  };

  return (
    <Screen edges={['bottom']}>
      <View style={{ gap: SPACE.sm }}>
        <T variant="label" muted>
          {formatDate(date)}
        </T>
        <LiturgyChip />
        <T variant="display">{g.title}</T>
        <T variant="bodyStrong" color={c.primary}>
          {g.ref}
        </T>
      </View>

      <View style={{ backgroundColor: palette.bg, borderRadius: RADIUS.lg, padding: SPACE.lg, gap: SPACE.md }}>
        <T variant="caption" color={palette.muted}>
          Proclamação do Evangelho de Jesus Cristo
        </T>
        {groups.map((gr) => (
          <View key={gr.chapter} style={{ gap: SPACE.xs }}>
            {groups.length > 1 && (
              <T variant="label" color={palette.verseNumber}>
                Capítulo {gr.chapter}
              </T>
            )}
            <Passage bookId={parseRef(g.ref).bookId} verses={gr.verses} palette={palette} fontSize={reader.fontSize} dark={dark} onTerm={setTerm} />
          </View>
        ))}
        <T variant="caption" color={palette.muted}>
          Palavra da Salvação. — Glória a vós, Senhor.
        </T>
      </View>

      {done ? (
        <AngelSays text="Que esta Palavra te acompanhe o dia todo. 💛" mood="festa" size={64} />
      ) : (
        <Button title="Li o Evangelho de hoje" icon="checkmark-circle-outline" onPress={finish} />
      )}
      {notesAllowed && (
        <Button
          title="O que este Evangelho falou comigo?"
          kind="ghost"
          icon="create-outline"
          onPress={() => router.push({ pathname: '/diario/editar', params: { ref: `Evangelho · ${g.ref}`, prompt: 'O que o Evangelho de hoje falou comigo?' } })}
        />
      )}
      <Card tone="alt">
        <T variant="caption" muted>
          As referências seguem o Lecionário da Missa. O texto é o da tradução do Pe. Antônio Pereira de Figueiredo; na Missa você
          ouvirá a tradução oficial da CNBB, por isso as palavras podem ser diferentes — o sentido é o mesmo.
        </T>
      </Card>
      <GlossarySheet term={term} onClose={() => setTerm(null)} />
    </Screen>
  );
}
