/**
 * Sugestão de por onde começar, a partir do questionário.
 * Sempre devolve uma sugestão principal e alternativas — a escolha é da pessoa.
 */
import type { IconName } from '@/components/ui';
import type { TrailId } from '@/content/trails';
import type { FaithMoment, Goal, ReadBefore } from '@/store/settings';

import type { PlanScope } from './plan/engine';

export type Recommendation =
  | { kind: 'trilha'; trail: TrailId; title: string; why: string; icon: IconName }
  | { kind: 'plano'; scope: PlanScope; title: string; why: string; icon: IconName }
  | { kind: 'explorar'; title: string; why: string; icon: IconName };

export interface Answers {
  goals: Goal[];
  readBefore?: ReadBefore;
  moment?: FaithMoment;
  minutes?: number;
  skipped: boolean;
}

const VOLTANDO: Recommendation = {
  kind: 'trilha',
  trail: 'voltando-para-casa',
  title: 'Trilha Voltando para Casa',
  why: '6 lições curtas sobre a misericórdia de Deus, para retomar com leveza.',
  icon: 'home-outline',
};
const PRIMEIROS: Recommendation = {
  kind: 'trilha',
  trail: 'primeiros-passos',
  title: 'Trilha Primeiros Passos',
  why: 'O que é a Bíblia, como ler, orações básicas e o começo de Marcos.',
  icon: 'footsteps-outline',
};
const EVANGELHOS: Recommendation = {
  kind: 'plano',
  scope: { kind: 'evangelhos' },
  title: 'Plano: os quatro Evangelhos',
  why: 'Conhecer Jesus de perto, no seu ritmo diário.',
  icon: 'heart-outline',
};
const BIBLIA: Recommendation = {
  kind: 'plano',
  scope: { kind: 'biblia' },
  title: 'Plano: a Bíblia inteira',
  why: 'Os 73 livros, com um prazo que você escolhe.',
  icon: 'library-outline',
};
const SALMOS: Recommendation = {
  kind: 'plano',
  scope: { kind: 'salmos-proverbios' },
  title: 'Plano: Salmos e Provérbios',
  why: 'Orações e sabedoria em trechos curtos, ótimo para criar o hábito.',
  icon: 'sunny-outline',
};
const EXPLORAR: Recommendation = {
  kind: 'explorar',
  title: 'Explorar o app por conta própria',
  why: 'Ir direto para o início e escolher depois.',
  icon: 'compass-outline',
};

export function recommend(a: Answers): { primary: Recommendation; others: Recommendation[] } {
  let primary: Recommendation;
  if (a.skipped) primary = EVANGELHOS;
  else if (a.moment === 'voltando' || a.goals.includes('voltar')) primary = VOLTANDO;
  else if (a.readBefore === 'nunca' || a.moment === 'comecando' || a.goals.includes('entender-fe')) primary = PRIMEIROS;
  else if (a.goals.includes('biblia-inteira')) primary = BIBLIA;
  else if (a.goals.includes('rezar') || a.goals.includes('paz')) primary = SALMOS;
  else primary = EVANGELHOS;

  const pool = [PRIMEIROS, VOLTANDO, EVANGELHOS, BIBLIA, SALMOS].filter((r) => r !== primary);
  // Duas alternativas mais relevantes + explorar.
  const others = pool.slice(0, 3);
  return { primary, others: [...others, EXPLORAR] };
}
