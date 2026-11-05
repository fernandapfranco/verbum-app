import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AngelSays, Button, ProgressBar, T } from '@/components/ui';
import { MYSTERIES } from '@/content/mysteries';
import { getPrayer } from '@/content/prayers';
import { logPrayer } from '@/db/user';
import { useCheckin } from '@/hooks/useGamification';
import { buildRosary, SET_NAME, SET_ORDER, type MysterySet, type RosaryStep } from '@/lib/rosary';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

const ORDINAL = ['1º', '2º', '3º', '4º', '5º'];
const SINGULAR: Record<MysterySet, string> = { gozosos: 'Gozoso', luminosos: 'Luminoso', dolorosos: 'Doloroso', gloriosos: 'Glorioso' };

function mysteryLabel(set: MysterySet, index: number) {
  return `${ORDINAL[index]} Mistério ${SINGULAR[set]}`;
}

/** Terço guiado: uma tela por oração, com contador de contas. */
export default function RezarTerco() {
  useKeepAwake(); // a tela não apaga no meio do terço
  const { conjunto } = useLocalSearchParams<{ conjunto: string }>();
  const { c } = useTheme();
  const checkin = useCheckin();
  const isRosary = conjunto === 'rosario';
  const sets: MysterySet[] = isRosary ? SET_ORDER : [(conjunto as MysterySet) ?? 'gozosos'];
  const steps = useMemo(() => buildRosary(sets), [conjunto]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const step = steps[i];

  // Leitor de tela: anuncia a conta atual.
  useEffect(() => {
    if (step?.kind === 'ave') AccessibilityInfo.announceForAccessibility(`Ave-Maria, ${step.bead} de ${step.total}`);
  }, [step]);

  const next = () => {
    if (i === steps.length - 1) return finish();
    const nx = steps[i + 1];
    if (step.kind === 'ave' && step.bead === step.total) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    else Haptics.selectionAsync().catch(() => {});
    setI(i + 1);
    if (nx.kind === 'misterio') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const finish = () => {
    logPrayer(isRosary ? 'rosario' : 'terco', conjunto);
    setDone(true);
    const r = checkin('oracao');
    if (r.isNew)
      router.push({ pathname: '/checkin', params: { streak: String(r.streak), reward: String(r.reward), bonus: String(r.bonus) } });
  };

  // Mistério em curso (para o cabeçalho)
  const current = (() => {
    for (let k = i; k >= 0; k--) {
      const s = steps[k];
      if (s.kind === 'misterio') return mysteryLabel(s.set, s.index);
    }
    return 'Abertura';
  })();

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: SPACE.xl, gap: SPACE.lg }}>
          <AngelSays text={`${isRosary ? 'Rosário' : 'Terço'} rezado! Maria leva nossas intenções até Jesus. 💙`} mood="festa" size={96} />
          <Button title="Concluir" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACE.sm, gap: SPACE.sm, minHeight: 52 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Sair do terço" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={26} color={c.textMuted} />
        </Pressable>
        <View style={{ flex: 1, gap: 4 }}>
          <T variant="caption" muted>
            {isRosary ? 'Rosário' : SET_NAME[sets[0]]} · {current}
          </T>
          <ProgressBar value={(i + 1) / steps.length} label="Progresso do terço" />
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACE.xl, gap: SPACE.lg, flexGrow: 1, justifyContent: 'center' }}>
        <StepContent step={step} />
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: SPACE.md, padding: SPACE.lg }}>
        <Button title="Voltar" kind="ghost" onPress={() => setI(Math.max(0, i - 1))} disabled={i === 0} style={{ flex: 1 }} />
        <Button
          title={i === steps.length - 1 ? 'Amém · concluir' : step.kind === 'ave' ? 'Próxima conta' : 'Próxima'}
          onPress={next}
          style={{ flex: 2 }}
        />
      </View>
    </SafeAreaView>
  );
}

function PrayerText({ id }: { id: string }) {
  const p = getPrayer(id);
  if (!p) return null;
  return (
    <T style={{ fontFamily: FONTS.scripture, fontSize: 21, lineHeight: 33, textAlign: 'center' }}>{p.texto.replace(/^[VR]\. /gm, '')}</T>
  );
}

function Beads({ bead, total }: { bead: number; total: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: total }, (_, k) => (
        <View
          key={k}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: k < bead ? c.primary : c.surface,
            borderWidth: 2,
            borderColor: k === bead - 1 ? c.gold : k < bead ? c.primary : c.border,
          }}
        />
      ))}
    </View>
  );
}

function StepContent({ step }: { step: RosaryStep }) {
  const { c } = useTheme();
  if (step.kind === 'misterio') {
    const m = MYSTERIES[step.set][step.index];
    return (
      <View style={{ gap: SPACE.md, alignItems: 'center' }}>
        <T variant="label" color={c.goldText}>
          {mysteryLabel(step.set, step.index)}
        </T>
        <T variant="display" style={{ textAlign: 'center' }}>
          {m.titulo}
        </T>
        <T muted>{m.citacao}</T>
        <T style={{ fontFamily: FONTS.scriptureItalic, fontSize: 19, lineHeight: 29, textAlign: 'center' }}>{m.meditacao}</T>
        <View style={{ backgroundColor: c.primarySoft, borderRadius: RADIUS.pill, paddingHorizontal: SPACE.lg, paddingVertical: SPACE.xs }}>
          <T variant="caption">Pedimos a graça: {m.fruto}</T>
        </View>
        <Button
          title="Ler a passagem"
          kind="ghost"
          icon="book-outline"
          onPress={() => router.push({ pathname: '/leitor/[livro]/[capitulo]', params: { livro: m.ref.bookId, capitulo: String(m.ref.chapter) } })}
        />
      </View>
    );
  }
  if (step.kind === 'ave') {
    return (
      <View style={{ gap: SPACE.lg, alignItems: 'center' }}>
        <T variant="label" color={c.goldText}>
          Ave-Maria · {step.bead} de {step.total}
          {step.intention ? ` · ${step.intention}` : ''}
        </T>
        <Beads bead={step.bead} total={step.total} />
        <PrayerText id="ave-maria" />
      </View>
    );
  }
  return (
    <View style={{ gap: SPACE.lg, alignItems: 'center' }}>
      <T variant="label" color={c.goldText}>
        {step.title}
      </T>
      <PrayerText id={step.prayerId} />
    </View>
  );
}
