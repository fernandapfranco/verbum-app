/**
 * Preferências e respostas do onboarding. Ficam no aparelho (kv-store do
 * expo-sqlite), com leitura síncrona: o app já abre sabendo para onde ir.
 */
import Storage from 'expo-sqlite/kv-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppThemePref, ReaderThemeId } from '@/theme/tokens';
import type { TrailId } from '@/content/trails';

export type ReadBefore = 'nunca' | 'trechos' | 'bastante';
export type FaithMoment = 'comecando' | 'voltando' | 'caminhando';
export type Track = TrailId | 'plano' | 'explorar';
export type Goal = 'biblia-inteira' | 'conhecer-jesus' | 'rezar' | 'entender-fe' | 'voltar' | 'paz' | 'com-amigos';
export type BestTime = 'manha' | 'tarde' | 'noite' | 'varia';

export interface NotificationPrefs {
  /** A pessoa autorizou e quer receber notificações. */
  enabled: boolean;
  /** Lembrete diário de leitura, enviado pelo anjo. */
  daily: boolean;
  /** Horário do lembrete, "HH:MM". */
  time: string;
  /** Aviso gentil quando a ofensiva está em risco (20h30, se ainda não fez check-in). */
  streakRisk: boolean;
  /** Lembrete do Angelus (6h, 12h, 18h). */
  angelus: boolean;
}

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
  /** Pulou o questionário. */
  skipped?: boolean;
  goals?: Goal[];
  bestTime?: BestTime;
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
  /** Como a pessoa quer ser chamada (opcional). */
  userName: string;
  /** Tema do app: seguir o celular, claro ou escuro. */
  appTheme: AppThemePref;
  reader: ReaderPrefs;
  notifications: NotificationPrefs;
  /** Último capítulo aberto, para "continuar de onde parou". */
  lastRead: { bookId: string; chapter: number; at: string } | null;
  /** Última vez que o app foi aberto (para o "que bom te ver de novo"). */
  lastOpenedAt: string | null;

  setConsent: (c: ConsentState) => void;
  setPersonalNotesConsent: (granted: boolean) => void;
  setOnboarding: (o: Partial<OnboardingState>) => void;
  setAngelName: (name: string) => void;
  setUserName: (name: string) => void;
  setNotifications: (n: Partial<NotificationPrefs>) => void;
  setReader: (r: Partial<ReaderPrefs>) => void;
  setAppTheme: (t: AppThemePref) => void;
  setLastRead: (bookId: string, chapter: number) => void;
  touchOpened: () => string | null;
  resetAll: () => void;
}

const initial = {
  consent: null,
  onboarding: { done: false },
  angelName: '',
  userName: '',
  notifications: { enabled: false, daily: true, time: '20:00', streakRisk: true, angelus: false } as NotificationPrefs,
  appTheme: 'sistema' as AppThemePref,
  reader: { fontSize: 19, theme: 'auto' as ReaderThemeId, showVerseNumbers: true },
  lastRead: null,
  lastOpenedAt: null,
};

/**
 * Leitura síncrona (o app abre já sabendo para onde ir). Escrita:
 * - no celular, síncrona (é instantânea);
 * - na web, em segundo plano: lá cada operação síncrona trava a tela até o
 *   SQLite responder, e o questionário grava a cada toque. O valor mais recente
 *   de cada chave é gravado logo em seguida (e ao esconder a página).
 */
const pendingWrites = new Map<string, string | null>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
function flushWrites() {
  flushTimer = null;
  for (const [k, v] of pendingWrites) {
    (v === null ? Storage.removeItemAsync(k) : Storage.setItemAsync(k, v)).catch(() => {});
  }
  pendingWrites.clear();
}
function queueWrite(k: string, v: string | null) {
  pendingWrites.set(k, v);
  if (!flushTimer) flushTimer = setTimeout(flushWrites, 0);
}
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushWrites();
  });
}

const syncStorage = {
  getItem: (k: string) => (pendingWrites.has(k) ? pendingWrites.get(k)! : Storage.getItemSync(k)),
  setItem: (k: string, v: string) => (Platform.OS === 'web' ? queueWrite(k, v) : Storage.setItemSync(k, v)),
  removeItem: (k: string) => {
    if (Platform.OS === 'web') queueWrite(k, null);
    else Storage.removeItemSync(k);
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
      setUserName: (userName) => set({ userName }),
      setNotifications: (n) => set({ notifications: { ...get().notifications, ...n } }),
      setReader: (r) => set({ reader: { ...get().reader, ...r } }),
      setAppTheme: (appTheme) => set({ appTheme }),
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
      version: 3,
      migrate: (persisted, version) => {
        const s = { ...initial, ...(persisted as object) } as SettingsState;
        // v3: o fundo "claro" era o padrão; passa a seguir o tema do app.
        if (version < 3 && s.reader?.theme === 'claro') s.reader = { ...s.reader, theme: 'auto' };
        return s;
      },
      // Na web (só usada para testes), o SQLite precisa de uma operação
      // assíncrona antes das síncronas: a hidratação é feita em _layout.
      skipHydration: Platform.OS === 'web',
      storage: createJSONStorage(() => syncStorage),
    },
  ),
);
