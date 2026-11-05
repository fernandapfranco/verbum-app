/**
 * Preferências e respostas do onboarding. Ficam no aparelho (kv-store do
 * expo-sqlite), com leitura síncrona: o app já abre sabendo para onde ir.
 */
import Storage from 'expo-sqlite/kv-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ReaderThemeId } from '@/theme/tokens';
import type { TrailId } from '@/content/trails';

export type ReadBefore = 'nunca' | 'trechos' | 'bastante';
export type FaithMoment = 'comecando' | 'voltando' | 'caminhando';
export type Track = TrailId | 'plano';

export interface ConsentState {
  /** Versão dos Termos/Política aceita. */
  legalVersion: string;
  acceptedAt: string;
  ageConfirmed: boolean;
  /** Consentimento específico (LGPD art. 11) para diário e notas pessoais. */
  personalNotes: boolean;
}

export interface OnboardingState {
  done: boolean;
  readBefore?: ReadBefore;
  faithMoment?: FaithMoment;
  minutesPerDay?: number;
  track?: Track;
}

export interface ReaderPrefs {
  fontSize: number;
  theme: ReaderThemeId;
  showVerseNumbers: boolean;
}

interface SettingsState {
  consent: ConsentState | null;
  onboarding: OnboardingState;
  angelName: string;
  reader: ReaderPrefs;
  /** Último capítulo aberto, para "continuar de onde parou". */
  lastRead: { bookId: string; chapter: number; at: string } | null;
  /** Última vez que o app foi aberto (para o "que bom te ver de novo"). */
  lastOpenedAt: string | null;

  setConsent: (c: ConsentState) => void;
  setPersonalNotesConsent: (granted: boolean) => void;
  setOnboarding: (o: Partial<OnboardingState>) => void;
  setAngelName: (name: string) => void;
  setReader: (r: Partial<ReaderPrefs>) => void;
  setLastRead: (bookId: string, chapter: number) => void;
  touchOpened: () => string | null;
  resetAll: () => void;
}

const initial = {
  consent: null,
  onboarding: { done: false },
  angelName: '',
  reader: { fontSize: 19, theme: 'claro' as ReaderThemeId, showVerseNumbers: true },
  lastRead: null,
  lastOpenedAt: null,
};

const syncStorage = {
  getItem: (k: string) => Storage.getItemSync(k),
  setItem: (k: string, v: string) => Storage.setItemSync(k, v),
  removeItem: (k: string) => {
    Storage.removeItemSync(k);
  },
};

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initial,
      setConsent: (consent) => set({ consent }),
      setPersonalNotesConsent: (granted) => {
        const c = get().consent;
        if (c) set({ consent: { ...c, personalNotes: granted } });
      },
      setOnboarding: (o) => set({ onboarding: { ...get().onboarding, ...o } }),
      setAngelName: (angelName) => set({ angelName }),
      setReader: (r) => set({ reader: { ...get().reader, ...r } }),
      setLastRead: (bookId, chapter) => set({ lastRead: { bookId, chapter, at: new Date().toISOString() } }),
      /** Marca a abertura do app e devolve a abertura anterior. */
      touchOpened: () => {
        const prev = get().lastOpenedAt;
        set({ lastOpenedAt: new Date().toISOString() });
        return prev;
      },
      resetAll: () => set({ ...initial }),
    }),
    {
      name: 'verbum.settings',
      version: 1,
      // Na web (só usada para testes), o SQLite precisa de uma operação
      // assíncrona antes das síncronas: a hidratação é feita em _layout.
      skipHydration: Platform.OS === 'web',
      storage: createJSONStorage(() => syncStorage),
    },
  ),
);
