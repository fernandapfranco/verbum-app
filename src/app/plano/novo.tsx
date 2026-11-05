import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Sheet } from '@/components/Sheet';
import { AngelSays, Button, Card, Chip, Option, Screen, T } from '@/components/ui';
import { useChapterUnits } from '@/db/bible';
import { saveActivePlan } from '@/db/user';
import { BOOKS } from '@/lib/bible/books';
import { addMonths, formatDate, today, WEEKDAYS_SHORT } from '@/lib/dates';
import { previewPlan, scopeLabel, type PlanMode, type PlanScope } from '@/lib/plan/engine';
import { useSettings } from '@/store/settings';
import { SPACE, useTheme } from '@/theme';

const SCOPES: { scope: PlanScope; subtitle: string }[] = [
  { scope: { kind: 'evangelhos' }, subtitle: 'Mateus, Marcos, Lucas e João — o coração da Bíblia' },
  { scope: { kind: 'nt' }, subtitle: '27 livros: Jesus e a Igreja nascente' },
  { scope: { kind: 'salmos-proverbios' }, subtitle: 'Oração e sabedoria, intercalados' },
  { scope: { kind: 'biblia' }, subtitle: 'Os 73 livros, do Gênesis ao Apocalipse' },
  { scope: { kind: 'at' }, subtitle: '46 livros: a história da Aliança' },
];

const DEADLINES = [
  { months: 1, label: '1 mês' },
  { months: 3, label: '3 meses' },
  { months: 6, label: '6 meses' },
  { months: 12, label: '1 ano' },
  { months: 24, label: '2 anos' },
];

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export default function NovoPlano() {
  const { primeiro } = useLocalSearchParams<{ primeiro?: string }>();
  const { c } = useTheme();
  const all = useChapterUnits();
  const minutesPref = useSettings((s) => s.onboarding.minutesPerDay) ?? 10;

  const [scope, setScope] = useState<PlanScope>({ kind: 'evangelhos' });
  const [mode, setMode] = useState<PlanMode>('ritmo');
  const [months, setMonths] = useState(3);
  const [minutes, setMinutes] = useState(minutesPref);
  const [weekdays, setWeekdays] = useState<number[]>(ALL_DAYS);
  const [pickBook, setPickBook] = useState(false);

  const start = today();
  const config = useMemo(
    () => ({
      scope,
      mode,
      startDate: start,
      endDate: mode === 'prazo' ? addMonths(start, months) : undefined,
      minutesPerDay: mode === 'ritmo' ? minutes : undefined,
      weekdays,
    }),
    [scope, mode, start, months, minutes, weekdays],
  );
  const preview = useMemo(() => (weekdays.length ? previewPlan(config, all) : null), [config, all, weekdays.length]);

  const toggleDay = (d: number) =>
    setWeekdays((w) => (w.includes(d) ? w.filter((x) => x !== d) : [...w, d].sort()));

  const create = () => {
    saveActivePlan({ id: `plano-${Date.now()}`, ...config });
    router.replace('/hoje');
  };

  const isBook = scope.kind === 'livro';

  return (
    <Screen edges={['bottom']}>
      {primeiro === '1' && <AngelSays text="Vamos montar seu plano? Escolha o que ler e o seu ritmo — eu cuido das contas." />}

      <T variant="heading">1. O que você quer ler?</T>
      <View style={{ gap: SPACE.sm }} accessibilityRole="radiogroup">
        {SCOPES.map(({ scope: s, subtitle }) => (
          <Option key={s.kind} title={scopeLabel(s)} subtitle={subtitle} selected={scope.kind === s.kind} onPress={() => setScope(s)} />
        ))}
        <Option
          title={isBook ? `Um livro: ${scopeLabel(scope)}` : 'Um livro específico'}
          subtitle="Escolha qualquer um dos 73 livros"
          selected={isBook}
          onPress={() => setPickBook(true)}
        />
      </View>

      <T variant="heading">2. Como prefere organizar?</T>
      <View style={{ flexDirection: 'row', gap: SPACE.sm }}>
        <Chip label="Minutos por dia" selected={mode === 'ritmo'} onPress={() => setMode('ritmo')} />
        <Chip label="Terminar até…" selected={mode === 'prazo'} onPress={() => setMode('prazo')} />
      </View>

      {mode === 'ritmo' ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm }}>
          {[5, 10, 15, 20, 30].map((m) => (
            <Chip key={m} label={`${m} min`} selected={minutes === m} onPress={() => setMinutes(m)} />
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm }}>
          {DEADLINES.map((d) => (
            <Chip key={d.months} label={d.label} selected={months === d.months} onPress={() => setMonths(d.months)} />
          ))}
        </View>
      )}

      <T variant="heading">3. Em quais dias?</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm }}>
        {WEEKDAYS_SHORT.map((d, i) => (
          <Chip key={d} label={d} selected={weekdays.includes(i)} onPress={() => toggleDay(i)} />
        ))}
      </View>

      {preview ? (
        <Card tone="soft">
          <T variant="label" color={c.goldText}>
            Seu plano
          </T>
          <T variant="heading">{scopeLabel(scope)}</T>
          <T>
            {preview.totalChapters} capítulos · cerca de {Math.max(1, Math.round(preview.dailyMinutes))} min por dia de leitura
          </T>
          <T>Término previsto: {formatDate(preview.endDate)}</T>
          {preview.dailyMinutes > 40 && (
            <T variant="caption" muted>
              É bastante leitura por dia. Que tal um prazo mais longo? Constância vale mais que pressa. 😉
            </T>
          )}
          <T variant="caption" muted>
            Se algum dia não der, tudo bem: o plano se reorganiza sozinho, sem "atraso".
          </T>
        </Card>
      ) : (
        <T color={c.danger}>Escolha pelo menos um dia da semana.</T>
      )}

      <Button title="Criar plano" onPress={create} disabled={!preview} />

      <Sheet visible={pickBook} onClose={() => setPickBook(false)} title="Escolha um livro">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm }}>
          {BOOKS.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => {
                setScope({ kind: 'livro', bookId: b.id });
                setPickBook(false);
              }}
              accessibilityRole="button"
              accessibilityLabel={b.name}
              style={{
                paddingHorizontal: SPACE.md,
                minHeight: 40,
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: c.surfaceAlt,
              }}
            >
              <T variant="caption">{b.shortName}</T>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </Screen>
  );
}
