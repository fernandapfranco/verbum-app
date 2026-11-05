import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { TextInput, View } from 'react-native';

import { Angel } from '@/components/Angel';
import { AngelSays, Button, Option, Screen, T } from '@/components/ui';
import { DEFAULT_ANGEL_NAME, ONBOARDING } from '@/content/angel';
import { TRAILS } from '@/content/trails';
import { type FaithMoment, type ReadBefore, type Track, useSettings } from '@/store/settings';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

type Step = 'ola' | 'leu' | 'momento' | 'tempo' | 'nome' | 'trilha';
const ORDER: Step[] = ['ola', 'leu', 'momento', 'tempo', 'nome', 'trilha'];

function recommendTrack(readBefore?: ReadBefore, moment?: FaithMoment): Track {
  if (moment === 'voltando') return 'voltando-para-casa';
  if (moment === 'comecando' || readBefore === 'nunca') return 'primeiros-passos';
  return 'plano';
}

export default function Onboarding() {
  const { c } = useTheme();
  const setOnboarding = useSettings((s) => s.setOnboarding);
  const setAngelName = useSettings((s) => s.setAngelName);
  const [step, setStep] = useState<Step>('ola');
  const [readBefore, setReadBefore] = useState<ReadBefore>();
  const [moment, setMoment] = useState<FaithMoment>();
  const [minutes, setMinutes] = useState<number>();
  const [name, setName] = useState('');
  const [track, setTrack] = useState<Track>();

  const idx = ORDER.indexOf(step);
  const next = () => setStep(ORDER[Math.min(idx + 1, ORDER.length - 1)]);
  const back = () => setStep(ORDER[Math.max(idx - 1, 0)]);
  const recommended = recommendTrack(readBefore, moment);
  const chosen = track ?? recommended;
  const angelName = name.trim() || DEFAULT_ANGEL_NAME;

  const finish = () => {
    setAngelName(angelName);
    setOnboarding({ done: true, readBefore, faithMoment: moment, minutesPerDay: minutes, track: chosen });
    if (chosen === 'plano') router.replace({ pathname: '/plano/novo', params: { primeiro: '1' } });
    else router.replace({ pathname: '/trilha/[id]', params: { id: chosen } });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View
        style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: SPACE.sm }}
        accessibilityLabel={`Passo ${idx + 1} de ${ORDER.length}`}
      >
        {ORDER.map((s, i) => (
          <View
            key={s}
            style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: i <= idx ? c.gold : c.border }}
          />
        ))}
      </View>

      {step === 'ola' && (
        <View style={{ gap: SPACE.lg, alignItems: 'center', marginTop: SPACE.xl }}>
          <Angel size={140} mood="festa" />
          <T variant="title" style={{ textAlign: 'center' }}>
            Oi! 👋
          </T>
          <T style={{ textAlign: 'center' }}>{ONBOARDING.hello}</T>
          <T muted style={{ textAlign: 'center' }}>
            {ONBOARDING.questions}
          </T>
          <Button title="Vamos lá" onPress={next} style={{ alignSelf: 'stretch' }} />
        </View>
      )}

      {step === 'leu' && (
        <Question title="Você já leu a Bíblia antes?">
          <Option title="Nunca li" subtitle="Vamos começar do começo, com calma" icon="leaf-outline" selected={readBefore === 'nunca'} onPress={() => setReadBefore('nunca')} />
          <Option title="Já li alguns trechos" subtitle="Na Missa, na catequese, aqui e ali" icon="book-outline" selected={readBefore === 'trechos'} onPress={() => setReadBefore('trechos')} />
          <Option title="Já li bastante" subtitle="Quero ler com mais constância" icon="library-outline" selected={readBefore === 'bastante'} onPress={() => setReadBefore('bastante')} />
          <Nav onBack={back} onNext={next} canNext={!!readBefore} />
        </Question>
      )}

      {step === 'momento' && (
        <Question title="Como está sua caminhada de fé?" subtitle="Não existe resposta certa. Aqui ninguém está atrasado.">
          <Option title="Estou começando" subtitle="Conhecendo agora a fé católica" icon="sunny-outline" selected={moment === 'comecando'} onPress={() => setMoment('comecando')} />
          <Option title="Estou voltando" subtitle="Fiquei um tempo longe e quero retomar" icon="home-outline" selected={moment === 'voltando'} onPress={() => setMoment('voltando')} />
          <Option title="Já caminho há um tempo" subtitle="Quero aprofundar" icon="walk-outline" selected={moment === 'caminhando'} onPress={() => setMoment('caminhando')} />
          <Nav onBack={back} onNext={next} canNext={!!moment} />
        </Question>
      )}

      {step === 'tempo' && (
        <Question title="Quanto tempo você tem por dia?" subtitle="Dá para mudar depois. Pouco e todo dia vale mais que muito de vez em quando.">
          {[5, 10, 15, 20].map((m) => (
            <Option
              key={m}
              title={m === 20 ? '20 minutos ou mais' : `${m} minutos`}
              subtitle={m === 5 ? 'Um cafezinho com Deus' : m === 10 ? 'O ponto de partida ideal' : undefined}
              icon="time-outline"
              selected={minutes === m}
              onPress={() => setMinutes(m)}
            />
          ))}
          <Nav onBack={back} onNext={next} canNext={!!minutes} />
        </Question>
      )}

      {step === 'nome' && (
        <View style={{ gap: SPACE.lg }}>
          <AngelSays text={ONBOARDING.name} size={84} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={`Ex.: ${DEFAULT_ANGEL_NAME}`}
            placeholderTextColor={c.textMuted}
            maxLength={20}
            autoCapitalize="words"
            accessibilityLabel="Nome do seu anjo"
            returnKeyType="done"
            onSubmitEditing={next}
            style={{
              fontFamily: FONTS.uiSemiBold,
              fontSize: 20,
              color: c.text,
              backgroundColor: c.surface,
              borderRadius: RADIUS.md,
              borderWidth: 1.5,
              borderColor: c.border,
              padding: SPACE.lg,
              textAlign: 'center',
            }}
          />
          <T variant="caption" muted style={{ textAlign: 'center' }}>
            Se preferir, pode deixar em branco: eu me chamo {DEFAULT_ANGEL_NAME}. 😇
          </T>
          <Nav onBack={back} onNext={next} canNext />
        </View>
      )}

      {step === 'trilha' && (
        <Question title="Por onde começamos?" subtitle={`${angelName} sugere o caminho marcado, mas a escolha é sua.`}>
          {TRAILS.map((t) => (
            <Option
              key={t.id}
              title={`${t.titulo}${recommended === t.id ? ' · sugerido' : ''}`}
              subtitle={t.paraQuem}
              icon={t.id === 'primeiros-passos' ? 'footsteps-outline' : 'home-outline'}
              selected={chosen === t.id}
              onPress={() => setTrack(t.id)}
            />
          ))}
          <Option
            title={`Ir direto para um plano de leitura${recommended === 'plano' ? ' · sugerido' : ''}`}
            subtitle="Bíblia inteira, Novo Testamento, Evangelhos, Salmos… no seu ritmo."
            icon="calendar-outline"
            selected={chosen === 'plano'}
            onPress={() => setTrack('plano')}
          />
          <View style={{ flexDirection: 'row', gap: SPACE.md, marginTop: SPACE.md }}>
            <Button title="Voltar" kind="ghost" onPress={back} style={{ flex: 1 }} />
            <Button title="Começar" onPress={finish} style={{ flex: 2 }} />
          </View>
        </Question>
      )}
    </Screen>
  );
}

function Question({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <View style={{ gap: SPACE.md }}>
      <T variant="title">{title}</T>
      {subtitle ? <T muted>{subtitle}</T> : null}
      <View style={{ gap: SPACE.md, marginTop: SPACE.sm }} accessibilityRole="radiogroup">
        {children}
      </View>
    </View>
  );
}

function Nav({ onBack, onNext, canNext }: { onBack: () => void; onNext: () => void; canNext: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: SPACE.md, marginTop: SPACE.md }}>
      <Button title="Voltar" kind="ghost" onPress={onBack} style={{ flex: 1 }} />
      <Button title="Continuar" onPress={onNext} disabled={!canNext} style={{ flex: 2 }} />
    </View>
  );
}
