import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Share, TextInput, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlossarySheet } from '@/components/GlossarySheet';
import { Passage } from '@/components/Passage';
import { Sheet } from '@/components/Sheet';
import { AngelSays, Button, Chip, ReviewTag, T, type IconName } from '@/components/ui';
import { pick, CHAPTER_DONE } from '@/content/angel';
import { getBookIntro } from '@/content/bookIntros';
import { getChapterNote } from '@/content/chapterNotes';
import type { GlossaryTerm } from '@/content/glossary';
import { getChapterInfo, getVerses, hasVisibleIssue } from '@/db/bible';
import {
  getChapterMarks,
  isChapterRead,
  markChapterRead,
  setFavorite,
  setHighlight,
  setNote,
  unmarkChapterRead,
  useDataVersion,
} from '@/db/user';
import { useCheckin } from '@/hooks/useGamification';
import { usePlan } from '@/hooks/usePlan';
import { findBook } from '@/lib/bible/books';
import { chapterLabel, minutesLabel, refLabel } from '@/lib/bible/format';
import { chapterKey } from '@/lib/plan/engine';
import { useSettings } from '@/store/settings';
import { FONTS, HIGHLIGHTS, RADIUS, READER_THEMES, SPACE, useTheme, type HighlightColor } from '@/theme';

const FONT_MIN = 14;
const FONT_MAX = 34;

export default function Leitor() {
  const params = useLocalSearchParams<{ livro: string; capitulo: string }>();
  const book = findBook(params.livro);
  const chapter = Number(params.capitulo) || 1;
  const db = useSQLiteContext();
  const { c, dark: systemDark } = useTheme();
  const reader = useSettings((s) => s.reader);
  const setReader = useSettings((s) => s.setReader);
  const setLastRead = useSettings((s) => s.setLastRead);
  const notesAllowed = useSettings((s) => s.consent?.personalNotes ?? false);
  const v = useDataVersion((s) => s.v);
  const plan = usePlan();
  const checkin = useCheckin();
  const scrollRef = useRef<ScrollViewInstance>(null);

  const [selected, setSelected] = useState<number | null>(null);
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  const palette = READER_THEMES[reader.theme];
  const readerDark = reader.theme === 'noturno';

  const verses = useMemo(() => (book ? getVerses(db, book.id, chapter) : []), [db, book, chapter]);
  const info = useMemo(() => (book ? getChapterInfo(db, book.id, chapter) : null), [db, book, chapter]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const marks = useMemo(() => (book ? getChapterMarks(book.id, chapter) : new Map()), [book, chapter, v]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isRead = useMemo(() => (book ? isChapterRead(book.id, chapter) : false), [book, chapter, v]);

  useEffect(() => {
    if (book) setLastRead(book.id, chapter);
    setSelected(null);
    setCelebrate(null);
    setShowIntro(true);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [book, chapter, setLastRead]);

  if (!book) return null;

  const note = getChapterNote(book.id, chapter);
  const intro = chapter === 1 || !note ? getBookIntro(book.id) : undefined;
  const hasIssues = !info?.reviewed && verses.some((x) => hasVisibleIssue(x.flags));
  const title = chapterLabel(book.id, chapter);
  const selVerse = selected != null ? verses.find((x) => x.verse === selected) : undefined;
  const selMark = selected != null ? marks.get(selected) : undefined;

  // Próximo capítulo: se estiver no plano de hoje, segue o plano; senão, o seguinte do livro.
  const planNext = plan.today?.chapters.find((u) => !plan.read.has(chapterKey(u)) && !(u.bookId === book.id && u.chapter === chapter));
  const nextInBook = chapter < book.chapters ? { bookId: book.id, chapter: chapter + 1 } : null;
  const inTodayPlan = plan.today?.chapters.some((u) => u.bookId === book.id && u.chapter === chapter);
  const next = inTodayPlan && planNext ? planNext : nextInBook;

  const go = (bookId: string, ch: number) =>
    router.replace({ pathname: '/leitor/[livro]/[capitulo]', params: { livro: bookId, capitulo: String(ch) } });

  const toggleRead = () => {
    if (isRead) {
      unmarkChapterRead(book.id, chapter);
      setCelebrate(null);
    } else {
      markChapterRead(book.id, chapter);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setCelebrate(pick(CHAPTER_DONE));
      const r = checkin('leitura');
      if (r.isNew)
        router.push({ pathname: '/checkin', params: { streak: String(r.streak), reward: String(r.reward), bonus: String(r.bonus) } });
    }
  };

  const verseText = (n: number) => verses.find((x) => x.verse === n)?.text ?? '';
  const shareText = (n: number) => `“${verseText(n)}” (${refLabel(book.id, chapter, n)})\n— Bíblia Sagrada, trad. Pe. Antônio Pereira de Figueiredo`;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: palette.bg }}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACE.sm, height: 52 }}>
        <HeaderButton icon="chevron-back" label="Voltar" color={palette.link} onPress={() => (router.canGoBack() ? router.back() : router.replace('/hoje'))} />
        <Pressable
          style={{ flex: 1, alignItems: 'center' }}
          onPress={() => router.push({ pathname: '/livro/[id]', params: { id: book.id } })}
          accessibilityRole="button"
          accessibilityLabel={`${title}. Toque para escolher outro capítulo`}
        >
          <T variant="bodyStrong" color={palette.text}>
            {title}
          </T>
          {info && (
            <T variant="caption" color={palette.muted}>
              {minutesLabel(info.minutes)}
            </T>
          )}
        </Pressable>
        <HeaderButton icon="text" label="Ajustes de leitura" color={palette.link} onPress={() => setShowSettings(true)} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: SPACE.xl, paddingBottom: 160, gap: SPACE.lg }}
      >
        {/* Antes de ler */}
        {(note || intro) && (
          <View style={{ backgroundColor: readerDark ? '#1A1F2A' : systemDark ? c.surfaceAlt : '#00000008', borderRadius: RADIUS.md, padding: SPACE.md, gap: SPACE.xs }}>
            <Pressable
              onPress={() => setShowIntro(!showIntro)}
              accessibilityRole="button"
              accessibilityState={{ expanded: showIntro }}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}
            >
              <T variant="label" color={palette.verseNumber}>
                Antes de ler
              </T>
              <Ionicons name={showIntro ? 'chevron-up' : 'chevron-down'} size={18} color={palette.muted} />
            </Pressable>
            {showIntro && (
              <>
                {intro && <T color={palette.text}>{intro.esperar}</T>}
                {note && <T color={palette.text}>{note.texto}</T>}
                <ReviewTag status={(note ?? intro)!.status} />
              </>
            )}
          </View>
        )}

        {hasIssues && (
          <Pressable onPress={() => router.push('/sobre-o-texto')} accessibilityRole="link">
            <T variant="caption" color={palette.muted}>
              ⓘ Este capítulo ainda está em revisão e pode ter pequenos erros de digitalização. Saiba mais ›
            </T>
          </Pressable>
        )}

        <T variant="display" color={palette.text} style={{ fontSize: 26, marginTop: SPACE.sm }}>
          {book.id === 'salmos' ? title : `${book.shortName} ${chapter}`}
        </T>

        <Passage
          bookId={book.id}
          verses={verses}
          palette={palette}
          fontSize={reader.fontSize}
          dark={readerDark}
          showNumbers={reader.showVerseNumbers}
          marks={marks}
          selected={selected}
          onSelectVerse={(n) => setSelected(selected === n ? null : n)}
          onTerm={setTerm}
        />

        {/* Fim do capítulo */}
        <View style={{ gap: SPACE.md, marginTop: SPACE.xl }}>
          {celebrate && <AngelSays text={celebrate} mood="festa" size={64} />}
          <Button
            title={isRead ? 'Lido ✓  (toque para desmarcar)' : 'Marcar como lido'}
            kind={isRead ? 'secondary' : 'primary'}
            icon={isRead ? undefined : 'checkmark-circle-outline'}
            onPress={toggleRead}
          />
          {isRead && notesAllowed && (
            <Button
              title="O que este trecho falou comigo?"
              kind="ghost"
              icon="create-outline"
              onPress={() =>
                router.push({
                  pathname: '/diario/editar',
                  params: { ref: `${book.id} ${chapter}`, prompt: 'O que este trecho falou comigo hoje?' },
                })
              }
            />
          )}
          {next && (
            <Button
              title={`Próximo: ${chapterLabel(next.bookId, next.chapter)}`}
              kind="ghost"
              icon="arrow-forward"
              onPress={() => go(next.bookId, next.chapter)}
            />
          )}
          <T variant="caption" color={palette.muted} style={{ textAlign: 'center' }}>
            Bíblia Sagrada · tradução do Pe. Antônio Pereira de Figueiredo (domínio público)
          </T>
        </View>
      </ScrollView>

      {/* Barra de ações do versículo selecionado */}
      {selVerse && (
        <View
          style={{
            position: 'absolute',
            left: SPACE.md,
            right: SPACE.md,
            bottom: SPACE.xl,
            backgroundColor: c.surface,
            borderRadius: RADIUS.lg,
            padding: SPACE.md,
            gap: SPACE.md,
            borderWidth: 1,
            borderColor: c.border,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <T variant="bodyStrong">{refLabel(book.id, chapter, selVerse.verse)}</T>
            <HeaderButton icon="close" label="Fechar" color={c.textMuted} onPress={() => setSelected(null)} />
          </View>
          <View style={{ flexDirection: 'row', gap: SPACE.sm, alignItems: 'center' }}>
            {(Object.keys(HIGHLIGHTS) as HighlightColor[]).map((k) => (
              <Pressable
                key={k}
                onPress={() => setHighlight(book.id, chapter, selVerse.verse, selMark?.color === k ? null : k)}
                accessibilityRole="button"
                accessibilityLabel={`Destacar em ${HIGHLIGHTS[k].label}`}
                accessibilityState={{ selected: selMark?.color === k }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: HIGHLIGHTS[k].light,
                  borderWidth: selMark?.color === k ? 3 : 1,
                  borderColor: selMark?.color === k ? c.primary : c.border,
                }}
              />
            ))}
            {selMark?.color && (
              <HeaderButton icon="close-circle-outline" label="Remover destaque" color={c.textMuted} onPress={() => setHighlight(book.id, chapter, selVerse.verse, null)} />
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Action
              icon={selMark?.favorite ? 'star' : 'star-outline'}
              label={selMark?.favorite ? 'Favorito' : 'Favoritar'}
              onPress={() => setFavorite(book.id, chapter, selVerse.verse, !selMark?.favorite)}
            />
            <Action
              icon="create-outline"
              label={selMark?.note ? 'Ver nota' : 'Nota'}
              onPress={() => setNoteDraft(selMark?.note ?? '')}
            />
            <Action
              icon="copy-outline"
              label="Copiar"
              onPress={() => {
                Clipboard.setStringAsync(shareText(selVerse.verse)).catch(() => {});
                Haptics.selectionAsync().catch(() => {});
              }}
            />
            <Action icon="share-outline" label="Compartilhar" onPress={() => Share.share({ message: shareText(selVerse.verse) })} />
          </View>
        </View>
      )}

      <GlossarySheet term={term} onClose={() => setTerm(null)} />

      {/* Ajustes de leitura */}
      <Sheet visible={showSettings} onClose={() => setShowSettings(false)} title="Ajustes de leitura">
        <T variant="label" muted>
          Tamanho da letra
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md }}>
          <Chip label="A−" onPress={() => setReader({ fontSize: Math.max(FONT_MIN, reader.fontSize - 1) })} />
          <T style={{ flex: 1, textAlign: 'center', fontFamily: FONTS.scripture, fontSize: reader.fontSize }}>
            {reader.fontSize} pt
          </T>
          <Chip label="A+" onPress={() => setReader({ fontSize: Math.min(FONT_MAX, reader.fontSize + 1) })} />
        </View>
        <T variant="label" muted>
          Fundo
        </T>
        <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
          <Chip label="Claro" selected={reader.theme === 'claro'} onPress={() => setReader({ theme: 'claro' })} />
          <Chip label="Sépia" selected={reader.theme === 'sepia'} onPress={() => setReader({ theme: 'sepia' })} />
          <Chip label="Noturno" selected={reader.theme === 'noturno'} onPress={() => setReader({ theme: 'noturno' })} />
        </View>
        <T variant="label" muted>
          Números dos versículos
        </T>
        <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
          <Chip label="Mostrar" selected={reader.showVerseNumbers} onPress={() => setReader({ showVerseNumbers: true })} />
          <Chip label="Esconder" selected={!reader.showVerseNumbers} onPress={() => setReader({ showVerseNumbers: false })} />
        </View>
      </Sheet>

      {/* Nota no versículo */}
      <Sheet
        visible={noteDraft !== null}
        onClose={() => setNoteDraft(null)}
        title={selVerse ? `Nota em ${refLabel(book.id, chapter, selVerse.verse)}` : 'Nota'}
      >
        {notesAllowed ? (
          <>
            <TextInput
              value={noteDraft ?? ''}
              onChangeText={setNoteDraft}
              multiline
              autoFocus
              placeholder="Escreva o que esse versículo despertou em você…"
              placeholderTextColor={c.textMuted}
              accessibilityLabel="Texto da nota"
              style={{
                minHeight: 120,
                textAlignVertical: 'top',
                fontFamily: FONTS.ui,
                fontSize: 16,
                color: c.text,
                backgroundColor: c.bg,
                borderRadius: RADIUS.md,
                padding: SPACE.md,
              }}
            />
            <Button
              title="Salvar nota"
              onPress={() => {
                if (selVerse) setNote(book.id, chapter, selVerse.verse, noteDraft ?? '');
                setNoteDraft(null);
              }}
            />
          </>
        ) : (
          <>
            <T>
              Para guardar notas pessoais, o Verbum precisa da sua permissão (é um dado sensível pela LGPD). Elas ficam só
              no seu celular.
            </T>
            <Button
              title="Ir para Privacidade e dados"
              kind="secondary"
              onPress={() => {
                setNoteDraft(null);
                router.push('/privacidade');
              }}
            />
          </>
        )}
      </Sheet>
    </SafeAreaView>
  );
}

function HeaderButton({ icon, label, color, onPress }: { icon: IconName; label: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={icon} size={24} color={color} />
    </Pressable>
  );
}

function Action({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ alignItems: 'center', minWidth: 64, minHeight: 48, justifyContent: 'center', gap: 2 }}
    >
      <Ionicons name={icon} size={22} color={c.primary} />
      <T variant="caption">{label}</T>
    </Pressable>
  );
}
