import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';

import { Angel } from '@/components/Angel';
import { NotificationOptions } from '@/components/NotificationOptions';
import { AngelSays, Button, Option, Screen, T, type IconName } from '@/components/ui';
import { DEFAULT_ANGEL_NAME } from '@/content/angel';
import { grantWelcomeGift } from '@/db/user';
import { refreshNotifications } from '@/hooks/useGamification';
import { requestPermission } from '@/lib/notifications';
import type { PlanScope } from '@/lib/plan/engine';
import { recommend, type Recommendation } from '@/lib/recommend';
import {
  type BestTime,
  type FaithMoment,
  type Goal,
  type ReadBefore,
  useSettings,
} from '@/store/settings';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

/** Perguntas do questionário (todas podem ser puladas). */
const QUESTIONS = ['nome', 'objetivo', 'leu', 'momento', 'tempo', 'horario'] as const;
type Step = 'ola' | (typeof QUESTIONS)[number] | 'notificacoes' | 'anjo' | 'sugestao';
const ORDER: Step[] = ['ola', ...QUESTIONS, 'notificacoes', 'anjo', 'sugestao'];

const GOALS: { id: Goal; title: string; icon: IconName }[] = [
  { id: 'biblia-inteira', title: 'Ler a Bíblia inteira', icon: 'library-outline' },
  { id: 'conhecer-jesus', title: 'Conhecer melhor Jesus', icon: 'heart-outline' },
  { id: 'rezar', title: 'Criar o hábito de rezar', icon: 'sunny-outline' },
  { id: 'entender-fe', title: 'Entender a fé católica', icon: 'bulb-outline' },
  { id: 'voltar', title: 'Voltar para a Igreja', icon: 'home-outline' },
  { id: 'paz', title: 'Encontrar paz e consolo', icon: 'leaf-outline' },
  { id: 'com-amigos', title: 'Ler junto com amigos', icon: 'people-outline' },
];

const TIME_BY_MOMENT: Record<BestTime, string> = { manha: '07:00', tarde: '12:30', noite: '21:30', varia: '20:00' };

export default function Onboarding() {
  const { c } = useTheme();
  const s = useSettings();
  const [step, setStep] = useState<Step>('ola');
  const [skipped, setSkipped] = useState(false);
  const [userName, setUserName] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [readBefore, setReadBefore] = useState<ReadBefore>();
  const [moment, setMoment] = useState<FaithMoment>();
  const [minutes, setMinutes] = useState<number>();
  const [bestTime, setBestTime] = useState<BestTime>();
  const [angelName, setAngelName] = useState('');

  const idx = ORDER.indexOf(step);
  const next = () => setStep(ORDER[Math.min(idx + 1, ORDER.length - 1)]);
  const back = () => setStep(ORDER[Math.max(idx - 1, 0)]);
  const skipQuestionnaire = () => {
    setSkipped(true);
    setStep('notificacoes');
  };
  const isQuestion = (QUESTIONS as readonly string[]).includes(step);

  const rec = recommend({ goals, readBefore, moment, minutes, skipped });
  const name = angelName.trim() || DEFAULT_ANGEL_NAME;

  const turnOnNotifications = async () => {
    const ok = await requestPermission();
    s.setNotifications({ enabled: ok, ...(bestTime ? { time: TIME_BY_MOMENT[bestTime] } : {}) });
    next();
  };

  const finish = (choice: Recommendation) => {
    s.setUserName(userName.trim());
    s.setAngelName(name);
    s.setOnboarding({
      done: true,
      skipped,
      goals,
      readBefore,
      faithMoment: moment,
      minutesPerDay: minutes,
      bestTime,
      track: choice.kind === 'trilha' ? choice.trail : choice.kind === 'plano' ? 'plano' : 'explorar',
    });
    grantWelcomeGift();
    refreshNotifications();
    if (choice.kind === 'trilha') router.replace({ pathname: '/trilha/[id]', params: { id: choice.trail } });
    else if (choice.kind === 'plano')
      router.replace({ pathname: '/plano/novo', params: { primeiro: '1', escopo: scopeParam(choice.scope) } });
    else router.replace('/hoje');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACE.sm, minHeight: 44 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 6 }} accessibilityLabel={`Passo ${idx + 1} de ${ORDER.length}`}>
          {ORDER.map((st, i) => (
            <View key={st} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= idx ? c.gold : c.border }} />
          ))}
        </View>
        {isQuestion && (
          <Pressable onPress={next} accessibilityRole="button" accessibilityLabel="Pular esta pergunta" style={{ paddingLeft: SPACE.lg, minHeight: 44, justifyContent: 'center' }}>
            <T variant="bodyStrong" color={c.primary}>
              Pular
            </T>
          </Pressable>
        )}
      </View>

      {step === 'ola' && (
        <View style={{ gap: SPACE.lg, alignItems: 'center', marginTop: SPACE.xl }}>
          <Angel size={140} mood="festa" />
          <T variant="title" style={{ textAlign: 'center' }}>
            Vamos nos conhecer?
          </T>
          <T style={{ textAlign: 'center' }}>
            Eu sou o seu anjo da guarda aqui no Verbum. Com algumas perguntinhas eu monto um começo do seu jeito — sem pressa e
            sem cobrança.
          </T>
          <T muted style={{ textAlign: 'center' }}>
            Leva menos de um minuto. Se preferir, pode pular.
          </T>
          <Button title="Vamos lá" onPress={next} style={{ alignSelf: 'stretch' }} />
          <Button title="Pular questionário" kind="ghost" onPress={skipQuestionnaire} style={{ alignSelf: 'stretch' }} />
        </View>
      )}

      {step === 'nome' && (
        <Question title="Como podemos te chamar?" subtitle="Pode ser seu nome ou um apelido. Fica só no seu celular.">
          <TextField value={userName} onChange={setUserName} placeholder="Seu nome ou apelido" label="Como quer ser chamado" onSubmit={next} />
          <Nav onBack={back} onNext={next} canNext />
        </Question>
      )}

      {step === 'objetivo' && (
        <Question title="O que você busca no Verbum?" subtitle="Escolha quantos quiser.">
          {GOALS.map((g) => {
            const on = goals.includes(g.id);
            return (
              <Option
                key={g.id}
                title={g.title}
                icon={g.icon}
                selected={on}
                onPress={() => setGoals(on ? goals.filter((x) => x !== g.id) : [...goals, g.id])}
              />
            );
          })}
          <Nav onBack={back} onNext={next} canNext={goals.length > 0} />
        </Question>
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
        <Question title="Quanto tempo você tem por dia?" subtitle="Pouco e todo dia vale mais que muito de vez em quando.">
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

      {step === 'horario' && (
        <Question title="Qual o melhor momento para você ler?">
          <Option title="De manhã" subtitle="Começar o dia com a Palavra" icon="partly-sunny-outline" selected={bestTime === 'manha'} onPress={() => setBestTime('manha')} />
          <Option title="No almoço" subtitle="Uma pausa no meio do dia" icon="sunny-outline" selected={bestTime === 'tarde'} onPress={() => setBestTime('tarde')} />
          <Option title="À noite" subtitle="Fechar o dia em paz" icon="moon-outline" selected={bestTime === 'noite'} onPress={() => setBestTime('noite')} />
          <Option title="Varia muito" subtitle="Cada dia é de um jeito" icon="shuffle-outline" selected={bestTime === 'varia'} onPress={() => setBestTime('varia')} />
          <Nav onBack={back} onNext={next} canNext={!!bestTime} />
        </Question>
      )}

      {step === 'notificacoes' && (
        <View style={{ gap: SPACE.lg }}>
          <AngelSays text="Posso te mandar uns lembretes carinhosos? Prometo: nada de cobrança, e você escolhe o quê e quando." size={80} />
          {Platform.OS !== 'web' && (
            <View style={{ backgroundColor: c.surface, borderRadius: RADIUS.lg, padding: SPACE.lg, borderWidth: 1, borderColor: c.border }}>
              <NotificationOptions />
            </View>
          )}
          <Button title="Quero receber" icon="notifications-outline" onPress={turnOnNotifications} />
          <Button
            title="Agora não"
            kind="ghost"
            onPress={() => {
              s.setNotifications({ enabled: false });
              next();
            }}
          />
        </View>
      )}

      {step === 'anjo' && (
        <View style={{ gap: SPACE.lg }}>
          <AngelSays text="Ah, e você pode me dar um nome! Como quer me chamar?" size={84} />
          <TextField value={angelName} onChange={setAngelName} placeholder={`Ex.: ${DEFAULT_ANGEL_NAME}`} label="Nome do seu anjo" onSubmit={next} big />
          <T variant="caption" muted style={{ textAlign: 'center' }}>
            Se preferir, pode deixar em branco: eu me chamo {DEFAULT_ANGEL_NAME}. 😇
          </T>
          <Nav onBack={back} onNext={next} canNext />
        </View>
      )}

      {step === 'sugestao' && (
        <View style={{ gap: SPACE.md }}>
          <T variant="title">{userName.trim() ? `Pronto, ${userName.trim()}!` : 'Tudo pronto!'}</T>
          <T muted>{skipped ? `${name} separou alguns jeitos de começar:` : `Pelo que você contou, ${name} sugere:`}</T>
          <SuggestionCard r={rec.primary} highlight onPress={() => finish(rec.primary)} />
          <T variant="label" muted style={{ marginTop: SPACE.sm }}>
            Ou, se preferir
          </T>
          {rec.others.map((r) => (
            <SuggestionCard key={r.title} r={r} onPress={() => finish(r)} />
          ))}
          <T variant="caption" muted style={{ textAlign: 'center', marginTop: SPACE.sm }}>
            🎁 Presente de boas-vindas: 1 vela de proteção para a sua ofensiva.
          </T>
        </View>
      )}
    </Screen>
  );
}

function scopeParam(scope: PlanScope): string {
  return scope.kind === 'livro' ? `livro:${scope.bookId}` : scope.kind;
}

function SuggestionCard({ r, highlight, onPress }: { r: Recommendation; highlight?: boolean; onPress: () => void }) {
  return (
    <Option title={r.title} subtitle={r.why} icon={r.icon} selected={!!highlight} onPress={onPress} />
  );
}

function Question({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <View style={{ gap: SPACE.md }}>
      <T variant="title">{title}</T>
      {subtitle ? <T muted>{subtitle}</T> : null}
      <View style={{ gap: SPACE.md, marginTop: SPACE.sm }}>{children}</View>
    </View>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  label,
  onSubmit,
  big,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  onSubmit: () => void;
  big?: boolean;
}) {
  const { c } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={c.textMuted}
      maxLength={24}
      autoCapitalize="words"
      accessibilityLabel={label}
      returnKeyType="done"
      onSubmitEditing={onSubmit}
      style={{
        fontFamily: FONTS.uiSemiBold,
        fontSize: big ? 20 : 18,
        color: c.text,
        backgroundColor: c.surface,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: c.border,
        padding: SPACE.lg,
        textAlign: big ? 'center' : 'left',
      }}
    />
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
