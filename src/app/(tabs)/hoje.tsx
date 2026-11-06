import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AngelSays, Button, Card, ProgressBar, Screen, T } from '@/components/ui';
import { DEFAULT_ANGEL_NAME, greeting, pick, PLAN_ADJUSTED, WELCOME_BACK } from '@/content/angel';
import { getSeriesFor, TRAILS } from '@/content/trails';
import { LiturgyChip } from '@/components/LiturgyChip';
import { SacredIcon } from '@/components/SacredIcon';
import { liturgicalDay, nextSeasonStart } from '@/lib/liturgy';
import { gospelOfDay } from '@/lib/lectionary';
import { TalentIcon } from '@/components/TalentIcon';
import { WeekStrip } from '@/components/WeekStrip';
import { getCompletedLessons, useDataVersion } from '@/db/user';
import { useGamification } from '@/hooks/useGamification';
import { usePlan } from '@/hooks/usePlan';
import { REWARDS } from '@/lib/streak';
import { useSession } from '@/store/session';
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
  const g = useGamification();
  const userName = useSettings((s) => s.userName);
  const session = useSession();

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
  const message =
    session.protectedNow > 0
      ? `Acendi ${session.protectedNow === 1 ? 'uma vela' : `${session.protectedNow} velas`} para guardar sua ofensiva enquanto você esteve fora. 🕯️ Que bom te ver!`
      : welcomeBack || session.streakBroken
        ? pick(WELCOME_BACK)
        : plan.today?.status === 'ajustado'
          ? pick(PLAN_ADJUSTED, hour)
          : greeting(hour, userName);

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

  // Trilha do tempo litúrgico (série): em destaque durante o tempo e nos 30 dias antes.
  const lit = liturgicalDay(todayISO());
  const gospel = gospelOfDay(todayISO());
  const upcoming = nextSeasonStart(todayISO());
  const seriesInfo = (() => {
    if (lit.season === 'advento') return { s: getSeriesFor('advento'), line: 'Estamos no Advento. Prepare o coração para o Natal.' };
    if (upcoming.season === 'advento' && upcoming.inDays <= 30)
      return {
        s: getSeriesFor('advento'),
        line: `O Advento começa em ${formatDate(upcoming.start)} (faltam ${upcoming.inDays} dias). A trilha já está disponível.`,
      };
    return null;
  })();
  const nextToRead = today?.chapters.find((u) => !plan.read.has(chapterKey(u)));

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACE.sm }}>
        <T variant="label" muted>
          {formatDate(todayISO())}
        </T>
        <Pressable
          onPress={() => router.push('/ofensiva')}
          accessibilityRole="button"
          accessibilityLabel={`Ofensiva de ${g.streak} dias, ${g.talentos} talentos, ${g.velas} velas`}
          style={{ flexDirection: 'row', gap: SPACE.sm }}
        >
          <Pill icon="flame" value={g.streak} />
          <Pill icon="talento" value={g.talentos} />
        </Pressable>
      </View>
      <LiturgyChip />
      <AngelSays text={message} mood={welcomeBack ? 'festa' : 'feliz'} />
      <T variant="caption" muted style={{ marginTop: -SPACE.sm, marginLeft: 84 }}>
        — {angelName}
      </T>

      <Card onPress={() => router.push('/ofensiva')} accessibilityLabel="Ver ofensiva e velas">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T variant="heading">Sua ofensiva</T>
          <T variant="caption" muted>
            {g.velas} {g.velas === 1 ? 'vela' : 'velas'} de proteção
          </T>
        </View>
        <WeekStrip week={g.week} />
      </Card>

      {/* Cartão principal (azul): o check-in de hoje, ligado à leitura do plano */}
      <Card tone="primary">
        <T variant="label" color={c.onPrimary} style={{ opacity: 0.85 }}>
          {g.checkedInToday ? 'Check-in feito ✓' : 'Check-in de hoje'}
        </T>
        {plan.config && today && today.status !== 'concluido' && today.status !== 'dia-livre' && nextToRead ? (
          <>
            <T variant="title" color={c.onPrimary}>
              {g.checkedInToday
                ? `Leitura de hoje: ${today.chapters.map((u) => chapterLabel(u.bookId, u.chapter)).join(' · ')}`
                : `Leia ${today.chapters.map((u) => chapterLabel(u.bookId, u.chapter)).join(' e ')} e ganhe +${REWARDS.checkin} talentos`}
            </T>
            <T color={c.onPrimary} style={{ opacity: 0.85 }}>
              {minutesLabel(today.minutes)}
              {today.doneToday > 0 ? ` · ${today.doneToday} de ${today.chapters.length} lido(s)` : ''}
            </T>
            <OnPrimaryButton
              title={today.doneToday > 0 ? 'Continuar' : 'Começar'}
              onPress={() =>
                router.push({
                  pathname: '/leitor/[livro]/[capitulo]',
                  params: { livro: nextToRead.bookId, capitulo: String(nextToRead.chapter) },
                })
              }
            />
          </>
        ) : plan.config && today?.status === 'concluido' ? (
          <>
            <T variant="title" color={c.onPrimary}>
              Plano concluído! 🎉
            </T>
            <T color={c.onPrimary} style={{ opacity: 0.85 }}>
              Você leu {scopeLabel(plan.config.scope)} inteiro. Que tal escolher o próximo?
            </T>
            <OnPrimaryButton title="Novo plano" onPress={() => router.push('/plano/novo')} />
          </>
        ) : plan.config && today && (today.status === 'dia-livre' || !nextToRead) ? (
          <>
            <T variant="title" color={c.onPrimary}>
              {today.status === 'dia-livre' ? 'Hoje é dia livre 🌿' : 'Leitura de hoje concluída ✨'}
            </T>
            <T color={c.onPrimary} style={{ opacity: 0.85 }}>
              {g.checkedInToday ? 'Até amanhã! Se quiser, pode adiantar um capítulo.' : 'Leia qualquer capítulo ou faça uma lição para o check-in.'}
            </T>
            <OnPrimaryButton title="Ver plano" onPress={() => router.push('/plano')} />
          </>
        ) : (
          <>
            <T variant="title" color={c.onPrimary}>
              {g.checkedInToday ? 'Que tal montar seu plano de leitura?' : `Leia um capítulo ou faça uma lição e ganhe +${REWARDS.checkin} talentos`}
            </T>
            <T color={c.onPrimary} style={{ opacity: 0.85 }}>
              Bíblia inteira, Evangelhos, Salmos… no seu ritmo.
            </T>
            <OnPrimaryButton title="Montar plano" onPress={() => router.push('/plano/novo')} />
          </>
        )}
        {plan.config && today && (
          <T variant="caption" color={c.onPrimary} style={{ opacity: 0.85 }} onPress={() => router.push('/plano')} accessibilityRole="link">
            {scopeLabel(plan.config.scope)} · {today.readChapters} de {today.totalChapters} capítulos · ver plano ›
          </T>
        )}
      </Card>

      {gospel && (
        <Card onPress={() => router.push('/evangelho')} accessibilityLabel={`Evangelho do dia: ${gospel.ref}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm }}>
            <SacredIcon name="biblia" size={20} color={c.goldText} />
            <T variant="label" color={c.goldText}>
              Evangelho do dia
            </T>
          </View>
          <T variant="heading">{gospel.ref}</T>
          <T variant="caption" muted>
            {gospel.title}
          </T>
        </Card>
      )}


      {seriesInfo?.s && (
        <Card
          onPress={() => router.push({ pathname: '/trilha/[id]', params: { id: seriesInfo.s!.id } })}
          accessibilityLabel={`Trilha ${seriesInfo.s.titulo}`}
          style={{ borderLeftWidth: 0 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm }}>
            <SacredIcon name="coroa-advento" size={22} color="#6B3FA0" />
            <T variant="label" color="#6B3FA0">
              Trilha do tempo litúrgico
            </T>
          </View>
          <T variant="heading">{seriesInfo.s.titulo}</T>
          <T muted>{seriesInfo.line}</T>
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

      <Pressable onPress={() => router.push('/orar')} accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center' }}>
        <T variant="bodyStrong" color={c.primary}>
          Ver todas as trilhas em Orar ›
        </T>
      </Pressable>

      {plan.config && today?.status === 'ajustado' && (
        <T variant="caption" muted style={{ textAlign: 'center' }}>
          No ritmo atual, você termina em {formatDate(today.projectedEnd)}. Se preferir ler menos por dia, dá para
          estender o prazo em "ver plano".
        </T>
      )}
    </Screen>
  );
}

function Pill({ icon, value }: { icon: 'flame' | 'talento'; value: number }) {
  const { c, dark } = useTheme();
  const flame = icon === 'flame';
  const bg = flame ? (dark ? '#3A2A10' : '#FFF1D6') : dark ? '#33290F' : '#FFF6E0';
  const fg = dark ? '#F5C76A' : '#7A4A06';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: bg, borderRadius: 999, paddingHorizontal: 12, minHeight: 36 }}>
      {flame ? <Ionicons name="flame" size={16} color="#E8902A" /> : <TalentIcon size={18} />}
      <T variant="bodyStrong" color={fg}>
        {value}
      </T>
    </View>
  );
}

/** Botão branco usado sobre o cartão azul. */
function OnPrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  const { c, dark } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        minHeight: 52,
        borderRadius: 999,
        backgroundColor: dark ? c.onPrimary : '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACE.xs,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <T variant="bodyStrong" color={dark ? c.text : '#1F2FA0'}>
        {title}
      </T>
    </Pressable>
  );
}
