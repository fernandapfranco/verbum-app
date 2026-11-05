import { useCallback, useMemo } from 'react';

import { getBalance, getStreakInput, recordActivity, useDataVersion } from '@/db/user';
import { today, weekday } from '@/lib/dates';
import { rescheduleAll } from '@/lib/notifications';
import { currentStreak, weekView } from '@/lib/streak';
import { useSettings } from '@/store/settings';

export function useGamification() {
  const v = useDataVersion((s) => s.v);
  return useMemo(() => {
    const input = getStreakInput();
    const d = today();
    return {
      streak: currentStreak(input, d),
      checkedInToday: input.checkins.has(d),
      week: weekView(input, d, weekday(d)),
      ...getBalance(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);
}

/** Reagenda as notificações com o estado atual. */
export async function refreshNotifications() {
  const s = useSettings.getState();
  const input = getStreakInput();
  const d = today();
  try {
    await rescheduleAll({
      prefs: s.notifications,
      angelName: s.angelName || 'Seu anjo',
      userName: s.userName,
      checkedInToday: input.checkins.has(d),
      streak: currentStreak(input, d),
    });
  } catch {
    // notificações são um extra: uma falha aqui não pode travar o app
  }
}

/**
 * Registra a atividade e devolve os parâmetros da tela de comemoração do
 * check-in, se este foi o primeiro do dia.
 */
export function useCheckin() {
  return useCallback((source: 'leitura' | 'licao') => {
    const r = recordActivity(source);
    if (r.isNew) refreshNotifications();
    return r;
  }, []);
}
