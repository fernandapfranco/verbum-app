import { useMemo } from 'react';

import { useChapterUnits } from '@/db/bible';
import { getActivePlan, getReadLog, useDataVersion } from '@/db/user';
import { today } from '@/lib/dates';
import { chapterKey, planForDay, unitsForScope, type PlanConfig, type TodayPlan } from '@/lib/plan/engine';

export interface PlanState {
  config: PlanConfig | null;
  today: TodayPlan | null;
  /** Todos os capítulos lidos (chapterKey), em qualquer data. */
  read: Set<string>;
}

/** Plano ativo + leitura de hoje, recalculados sempre que algo é salvo. */
export function usePlan(): PlanState {
  const v = useDataVersion((s) => s.v);
  const all = useChapterUnits();
  return useMemo(() => {
    const log = getReadLog();
    const read = new Set(log.map(chapterKey));
    const config = getActivePlan();
    if (!config) return { config: null, today: null, read };
    const d = today();
    const before = new Set(log.filter((e) => e.readOn < d).map(chapterKey));
    const todays = new Set(log.filter((e) => e.readOn === d).map(chapterKey));
    const units = unitsForScope(config.scope, all);
    return { config, today: planForDay(config, units, before, todays, d), read };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, all]);
}

/** Capítulos lidos (chapterKey). */
export function useReadSet(): Set<string> {
  const v = useDataVersion((s) => s.v);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => new Set(getReadLog().map(chapterKey)), [v]);
}
