import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlossarySheet } from '@/components/GlossarySheet';
import { Passage } from '@/components/Passage';
import { AngelSays, Button, Card, ReviewTag, T } from '@/components/ui';
import { LESSON_DONE, pick } from '@/content/angel';
import type { GlossaryTerm } from '@/content/glossary';
import { getPrayer } from '@/content/prayers';
import { getLesson, getTrail, type LessonStep } from '@/content/trails';
import { getVerses } from '@/db/bible';
import { completeLesson, saveJournalEntry } from '@/db/user';
import { useCheckin } from '@/hooks/useGamification';
import { refLabel } from '@/lib/bible/format';
import { useSettings } from '@/store/settings';
import { FONTS, RADIUS, READER_THEMES, SPACE, useTheme } from '@/theme';

export default function Licao() {
  const { trilha, licao } = useLocalSearchParams<{ trilha: string; licao: string }>();
  const { c, dark } = useTheme();
  const trail = getTrail(trilha);
  const lesson = getLesson(trilha, licao);
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const checkin = useCheckin();

  if (!trail || !lesson) return null;
  const step = lesson.passos[i];
  const last = i === lesson.passos.length - 1;
  const idx = trail.licoes.findIndex((l) => l.id === lesson.id);
  const nextLesson = trail.licoes[idx + 1];

  const finish = () => {
    completeLesson(trail.id, lesson.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setDone(true);
    const r = checkin('licao');
    if (r.isNew)
      router.push({ pathname: '/checkin', params: { streak: String(r.streak), reward: String(r.reward), bonus: String(r.bonus) } });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACE.sm, gap: SPACE.sm, height: 52 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fechar lição" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={26} color={c.textMuted} />
        </Pressable>
        <View
          style={{ flex: 1, flexDirection: 'row', gap: 4 }}
          accessibilityLabel={`Passo ${i + 1} de ${lesson.passos.length}`}
        >
          {lesson.passos.map((_, k) => (
            <View key={k} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: k <= i || done ? c.gold : c.border }} />
          ))}
        </View>
        <View style={{ width: 44 }} />
      </View>

      {done ? (
        <ScrollView contentContainerStyle={{ padding: SPACE.lg, gap: SPACE.lg, flexGrow: 1, justifyContent: 'center' }}>
          <AngelSays text={pick(LESSON_DONE)} mood="festa" size={96} />
          <T variant="title" style={{ textAlign: 'center' }}>
            {lesson.titulo} ✓
          </T>
          {nextLesson ? (
            <Button
              title={`Próxima: ${nextLesson.titulo}`}
              onPress={() => router.replace({ pathname: '/licao/[trilha]/[licao]', params: { trilha: trail.id, licao: nextLesson.id } })}
            />
          ) : (
            <Button title="Montar meu plano de leitura" onPress={() => router.replace('/plano/novo')} />
          )}
          <Button title="Voltar para a trilha" kind="ghost" onPress={() => router.back()} />
        </ScrollView>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: SPACE.lg, gap: SPACE.lg, paddingBottom: SPACE.xxl }}>
            {i === 0 && (
              <View style={{ gap: SPACE.xs }}>
                <T variant="label" color={c.goldText}>
                  {trail.titulo} · Lição {idx + 1}
                </T>
                <T variant="display">{lesson.titulo}</T>
                <ReviewTag status={lesson.status} />
              </View>
            )}
            <StepView key={i} step={step} lessonTitle={lesson.titulo} onTerm={setTerm} dark={dark} />
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: SPACE.md, padding: SPACE.lg }}>
            {i > 0 && <Button title="Voltar" kind="ghost" onPress={() => setI(i - 1)} style={{ flex: 1 }} />}
            <Button title={last ? 'Concluir lição' : 'Continuar'} onPress={() => (last ? finish() : setI(i + 1))} style={{ flex: 2 }} />
          </View>
        </>
      )}
      <GlossarySheet term={term} onClose={() => setTerm(null)} />
    </SafeAreaView>
  );
}

function StepView({
  step,
  lessonTitle,
  onTerm,
  dark,
}: {
  step: LessonStep;
  lessonTitle: string;
  onTerm: (t: GlossaryTerm) => void;
  dark: boolean;
}) {
  const { c } = useTheme();
  const db = useSQLiteContext();
  const reader = useSettings((s) => s.reader);
  const notesAllowed = useSettings((s) => s.consent?.personalNotes ?? false);
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  const verses = useMemo(
    () => (step.kind === 'leitura' ? getVerses(db, step.ref.bookId, step.ref.chapter, step.ref.from, step.ref.to) : []),
    [db, step],
  );

  switch (step.kind) {
    case 'texto':
      return (
        <View style={{ gap: SPACE.md }}>
          {step.titulo && <T variant="title">{step.titulo}</T>}
          <T style={{ fontSize: 17, lineHeight: 27 }}>{step.corpo}</T>
        </View>
      );
    case 'leitura': {
      const palette = dark ? READER_THEMES.noturno : READER_THEMES[reader.theme === 'noturno' ? 'claro' : reader.theme];
      return (
        <View style={{ gap: SPACE.md }}>
          {step.antes && <T muted>{step.antes}</T>}
          <View style={{ backgroundColor: palette.bg, borderRadius: RADIUS.lg, padding: SPACE.lg, gap: SPACE.sm, borderWidth: 1, borderColor: c.border }}>
            <T variant="label" color={palette.verseNumber}>
              {refLabel(step.ref.bookId, step.ref.chapter, step.ref.from, step.ref.to)}
            </T>
            <Passage bookId={step.ref.bookId} verses={verses} palette={palette} fontSize={reader.fontSize} dark={dark} onTerm={onTerm} />
          </View>
          <T variant="caption" muted>
            Toque nas palavras sublinhadas para ver o significado.
          </T>
        </View>
      );
    }
    case 'oracao': {
      const p = getPrayer(step.prayerId);
      if (!p) return null;
      return (
        <Card>
          <T variant="label" color={c.goldText}>
            Oração
          </T>
          <T variant="title">{p.titulo}</T>
          <T style={{ fontFamily: FONTS.scripture, fontSize: 19, lineHeight: 31 }}>{p.texto}</T>
          <T variant="caption" muted>
            {p.sobre}
          </T>
        </Card>
      );
    }
    case 'reflexao':
      return (
        <View style={{ gap: SPACE.md }}>
          <T variant="label" color={c.goldText}>
            Para refletir
          </T>
          <T variant="title">{step.pergunta}</T>
          {notesAllowed ? (
            <>
              <TextInput
                value={answer}
                onChangeText={(t) => {
                  setAnswer(t);
                  setSaved(false);
                }}
                multiline
                placeholder="Escreva se quiser (é opcional e fica só no seu celular)…"
                placeholderTextColor={c.textMuted}
                accessibilityLabel="Sua resposta"
                style={{
                  minHeight: 120,
                  textAlignVertical: 'top',
                  fontFamily: FONTS.ui,
                  fontSize: 16,
                  color: c.text,
                  backgroundColor: c.surface,
                  borderRadius: RADIUS.md,
                  borderWidth: 1,
                  borderColor: c.border,
                  padding: SPACE.md,
                }}
              />
              {answer.trim().length > 0 && (
                <Button
                  title={saved ? 'Guardado no diário ✓' : 'Guardar no meu diário'}
                  kind="secondary"
                  disabled={saved}
                  onPress={() => {
                    saveJournalEntry({ text: answer.trim(), prompt: step.pergunta, ref: `Lição: ${lessonTitle}` });
                    setSaved(true);
                  }}
                />
              )}
            </>
          ) : (
            <T muted>Pense nisso por um instante, em silêncio. Se quiser, converse com Deus sobre isso agora.</T>
          )}
        </View>
      );
  }
}
