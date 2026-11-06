import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { AngelSays, Button, Card, ProgressBar, Screen, T } from '@/components/ui';
import { useChapterUnits } from '@/db/bible';
import { endActivePlan, saveActivePlan } from '@/db/user';
import { usePlan } from '@/hooks/usePlan';
import { formatDate, today, WEEKDAYS_SHORT } from '@/lib/dates';
import { extendedEndDate, scopeLabel, unitsForScope } from '@/lib/plan/engine';
import { SPACE, useTheme } from '@/theme';

export default function Plano() {
  const { c } = useTheme();
  const { config, today: t, read } = usePlan();
  const all = useChapterUnits();

  if (!config || !t) {
    return (
      <Screen edges={['bottom']}>
        <AngelSays text="Você ainda não tem um plano. Bora montar um?" />
        <Button title="Montar plano" onPress={() => router.replace('/plano/novo')} />
      </Screen>
    );
  }

  const units = unitsForScope(config.scope, all);
  const days = config.weekdays.length === 7 ? 'todos os dias' : config.weekdays.map((d) => WEEKDAYS_SHORT[d]).join(', ');
  const canExtend = config.mode === 'prazo' && t.status === 'ajustado';
  const newEnd = canExtend ? extendedEndDate(config, units, read, today()) : null;

  return (
    <Screen edges={['bottom']}>
      <T variant="title">{scopeLabel(config.scope)}</T>
      <Card>
        <ProgressBar value={t.readChapters / t.totalChapters} label="Progresso do plano" />
        <T>
          {t.readChapters} de {t.totalChapters} capítulos ({Math.round((t.readChapters / t.totalChapters) * 100)}%)
        </T>
        <T muted>
          {config.mode === 'ritmo' ? `Ritmo: ${config.minutesPerDay} min por dia` : `Prazo: ${formatDate(config.endDate!)}`} · {days}
        </T>
        <T muted>Começou em {formatDate(config.startDate)}</T>
        <T muted>
          No ritmo de hoje (~{Math.max(1, Math.round(t.pace))} min por dia de leitura), termina em {formatDate(t.projectedEnd)}.
        </T>
      </Card>

      {canExtend && newEnd && (
        <Card tone="soft">
          <T variant="heading">Quer ler com mais calma?</T>
          <T>
            Para manter o prazo, seriam ~{Math.round(t.pace)} min por dia. Se preferir continuar com ~
            {Math.max(1, Math.round(t.originalPace))} min, o novo término fica em {formatDate(newEnd)}.
          </T>
          <Button
            title="Seguir no meu ritmo"
            onPress={() => {
              saveActivePlan({ ...config, endDate: newEnd });
              router.back();
            }}
          />
          <T variant="caption" muted>
            As duas opções são ótimas. O importante é continuar caminhando. 💛
          </T>
        </Card>
      )}

      <View style={{ gap: SPACE.sm }}>
        <Button title="Trocar de plano" kind="secondary" onPress={() => router.push('/plano/novo')} />
        <Button
          title="Encerrar este plano"
          kind="ghost"
          onPress={() =>
            Alert.alert('Encerrar plano?', 'Os capítulos que você já leu continuam marcados.', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Encerrar',
                style: 'destructive',
                onPress: () => {
                  endActivePlan();
                  router.back();
                },
              },
            ])
          }
        />
      </View>
      <T variant="caption" muted style={{ color: c.textMuted }}>
        Ao criar um novo plano, os capítulos já lidos contam automaticamente.
      </T>
    </Screen>
  );
}
