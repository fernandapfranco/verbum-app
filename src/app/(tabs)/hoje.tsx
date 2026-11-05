import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { AngelSays, Button, Card, ProgressBar, Screen, T } from '@/components/ui';
import { DEFAULT_ANGEL_NAME, greeting, pick, PLAN_ADJUSTED, WELCOME_BACK } from '@/content/angel';
import { getTrail, TRAILS } from '@/content/trails';
import { getCompletedLessons, useDataVersion } from '@/db/user';
import { usePlan } from '@/hooks/usePlan';
import { chapterLabel, minutesLabel } from '@/lib/bible/format';
import { formatDate, today as todayISO } from '@/lib/dates';
import { chapterKey, scopeLabel } from '@/lib/plan/engine';
import { useSettings } from '@/store/settings';
import { SPACE, useTheme } from '@/theme';

const DAY = 86_400_000;

export default function Hoje() {
  const { c } = useTheme();
  const angelName = useSettings((s) => s.angelName) || DEFAULT_ANGEL_NAME;
  const track = useSettings((s) => s.onboarding.track);
  const lastRead = useSettings((s) => s.lastRead);
  const touchOpened = useSettings((s) => s.touchOpened);
  const bump = useDataVersion((s) => s.bump);
  const plan = usePlan();
  const v = useDataVersion((s) => s.v);

  // "Que bom te ver de novo!" quando a pessoa some por 3 dias ou mais — sem cobrança.
  const [welcomeBack, setWelcomeBack] = useState(false);
  const checked = useRef(false);
  useFocusEffect(
    useCallback(() => {
      bump(); // recalcula "hoje" (a data pode ter mudado com o app aberto)
      if (!checked.current) {
        checked.current = true;
        const prev = touchOpened();
        if (prev && Date.now() - new Date(prev).getTime() > 3 * DAY) setWelcomeBack(true);
      }
    }, [bump, touchOpened]),
  );

  const hour = new Date().getHours();
  const message = welcomeBack
    ? pick(WELCOME_BACK)
    : plan.today?.status === 'ajustado'
      ? pick(PLAN_ADJUSTED, hour)
      : greeting(hour, '');

  // Trilha em andamento: a escolhida no onboarding, ou a que tiver progresso.
  const trailCard = useMemo(() => {
    const candidates = TRAILS.map((t) => ({ t, done: getCompletedLessons(t.id) }));
    const active =
      candidates.find((x) => x.t.id === track && x.done.size < x.t.licoes.length) ??
      candidates.find((x) => x.done.size > 0 && x.done.size < x.t.licoes.length);
    if (!active) return null;
    const nextLesson = active.t.licoes.find((l) => !active.done.has(l.id));
    return { trail: active.t, done: active.done.size, next: nextLesson };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, v]);

  const today = plan.today;
  const nextToRead = today?.chapters.find((u) => !plan.read.has(chapterKey(u)));

  return (
    <Screen>
      <T variant="label" muted style={{ marginTop: SPACE.sm }}>
        {formatDate(todayISO())}
      </T>
      <AngelSays text={message} mood={welcomeBack ? 'festa' : 'feliz'} />
      <T variant="caption" muted style={{ marginTop: -SPACE.sm, marginLeft: 84 }}>
        — {angelName}
      </T>

      {plan.config && today ? (
        <Card>
          <T variant="label" color={c.goldText}>
            Sua leitura de hoje
          </T>
          {today.status === 'concluido' ? (
            <>
              <T variant="heading">Plano concluído! 🎉</T>
              <T muted>Você leu {scopeLabel(plan.config.scope)} inteiro. Que tal escolher o próximo?</T>
              <Button title="Novo plano" onPress={() => router.push('/plano/novo')} />
            </>
          ) : today.status === 'dia-livre' ? (
            <>
              <T variant="heading">Hoje é dia livre 🌿</T>
              <T muted>Seu plano não tem leitura para hoje. Se quiser, pode adiantar um capítulo.</T>
              <Button title="Ver plano" kind="secondary" onPress={() => router.push('/plano')} />
            </>
          ) : (
            <>
              <T variant="heading">
                {today.chapters.map((u) => chapterLabel(u.bookId, u.chapter)).join(' · ')}
              </T>
              <T muted>
                {minutesLabel(today.minutes)}
                {today.doneToday > 0 ? ` · ${today.doneToday} de ${today.chapters.length} lido(s)` : ''}
              </T>
              {nextToRead ? (
                <Button
                  title={today.doneToday > 0 ? 'Continuar' : 'Começar a leitura'}
                  icon="book-outline"
                  onPress={() =>
                    router.push({
                      pathname: '/leitor/[livro]/[capitulo]',
                      params: { livro: nextToRead.bookId, capitulo: String(nextToRead.chapter) },
                    })
                  }
                />
              ) : (
                <T color={c.success} variant="bodyStrong">
                  Leitura de hoje concluída ✨
                </T>
              )}
            </>
          )}
          <View style={{ gap: SPACE.xs, marginTop: SPACE.sm }}>
            <ProgressBar value={today.readChapters / today.totalChapters} label="Progresso do plano" />
            <T variant="caption" muted onPress={() => router.push('/plano')} accessibilityRole="link">
              {scopeLabel(plan.config.scope)} · {today.readChapters} de {today.totalChapters} capítulos · ver plano ›
            </T>
          </View>
        </Card>
      ) : (
        <Card tone="soft" onPress={() => router.push('/plano/novo')} accessibilityLabel="Montar um plano de leitura">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md }}>
            <Ionicons name="calendar-outline" size={28} color={c.primary} />
            <View style={{ flex: 1 }}>
              <T variant="heading">Monte seu plano de leitura</T>
              <T muted>Bíblia inteira, Evangelhos, Salmos… no seu ritmo.</T>
            </View>
          </View>
        </Card>
      )}

      {trailCard && (
        <Card
          onPress={() =>
            trailCard.next
              ? router.push({ pathname: '/licao/[trilha]/[licao]', params: { trilha: trailCard.trail.id, licao: trailCard.next.id } })
              : router.push({ pathname: '/trilha/[id]', params: { id: trailCard.trail.id } })
          }
          accessibilityLabel={`Continuar a trilha ${trailCard.trail.titulo}`}
        >
          <T variant="label" color={c.goldText}>
            Trilha {trailCard.trail.titulo}
          </T>
          <T variant="heading">{trailCard.next?.titulo ?? 'Ver trilha'}</T>
          {trailCard.next && <T muted>{trailCard.next.resumo}</T>}
          <ProgressBar value={trailCard.done / trailCard.trail.licoes.length} label="Progresso da trilha" />
          <T variant="caption" muted>
            {trailCard.done} de {trailCard.trail.licoes.length} lições
          </T>
        </Card>
      )}

      {lastRead && (
        <Card
          tone="alt"
          onPress={() =>
            router.push({
              pathname: '/leitor/[livro]/[capitulo]',
              params: { livro: lastRead.bookId, capitulo: String(lastRead.chapter) },
            })
          }
          accessibilityLabel="Continuar de onde parou"
        >
          <T variant="label" muted>
            Continuar de onde parou
          </T>
          <T variant="bodyStrong">{chapterLabel(lastRead.bookId, lastRead.chapter)}</T>
        </Card>
      )}

      <View style={{ gap: SPACE.sm }}>
        <T variant="label" muted>
          Trilhas
        </T>
        {TRAILS.map((t) => (
          <Card key={t.id} onPress={() => router.push({ pathname: '/trilha/[id]', params: { id: t.id } })} accessibilityLabel={`Trilha ${t.titulo}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md }}>
              <Ionicons name={t.id === 'primeiros-passos' ? 'footsteps-outline' : 'home-outline'} size={24} color={c.primary} />
              <View style={{ flex: 1 }}>
                <T variant="bodyStrong">{getTrail(t.id)!.titulo}</T>
                <T variant="caption" muted>
                  {t.subtitulo}
                </T>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {plan.config && today?.status === 'ajustado' && (
        <T variant="caption" muted style={{ textAlign: 'center' }}>
          No ritmo atual, você termina em {formatDate(today.projectedEnd)}. Se preferir ler menos por dia, dá para
          estender o prazo em "ver plano".
        </T>
      )}
    </Screen>
  );
}
