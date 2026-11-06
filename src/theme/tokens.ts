/**
 * Identidade visual "Luz": minimalista, clara e arejada. Azul mariano vivo,
 * dourado como luz, cantos bem arredondados. Newsreader (serifada) para o
 * texto bíblico e Plus Jakarta Sans para a interface.
 *
 * Contraste: todas as combinações de texto abaixo foram escolhidas para atingir
 * WCAG AA (4,5:1) sobre o fundo correspondente. O dourado `gold` é decorativo;
 * para texto dourado use `goldText`.
 *
 * Fase 3: as cores de destaque (`accent`) passarão a seguir o tempo litúrgico.
 */

export interface Palette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  gold: string;
  goldText: string;
  success: string;
  danger: string;
  overlay: string;
}

export const LIGHT: Palette = {
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F6',
  border: '#E1E4EE',
  text: '#12142B',
  textMuted: '#4A4E6A',
  primary: '#2F45D6',
  onPrimary: '#FFFFFF',
  primarySoft: '#E6EAFF',
  gold: '#F2B544',
  goldText: '#8A5A00',
  success: '#1F7A55',
  danger: '#B42335',
  overlay: 'rgba(18, 20, 43, 0.45)',
};

export const DARK: Palette = {
  bg: '#0E1022',
  surface: '#181B33',
  surfaceAlt: '#20243F',
  border: '#2C3152',
  text: '#EEF0FF',
  textMuted: '#A7ABC8',
  primary: '#8C9BFF',
  onPrimary: '#0E1022',
  primarySoft: '#232A5C',
  gold: '#F2B544',
  goldText: '#F5C76A',
  success: '#7CC4A0',
  danger: '#F08A8A',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

/** Tema do app: seguir o celular, ou fixo. */
export type AppThemePref = 'sistema' | 'claro' | 'escuro';

/** Fundo da leitura. `auto` = igual ao tema do app (claro ou noturno). */
export type ReaderThemeId = 'auto' | 'claro' | 'sepia' | 'noturno';
export type ConcreteReaderTheme = Exclude<ReaderThemeId, 'auto'>;

export interface ReaderPalette {
  bg: string;
  text: string;
  muted: string;
  verseNumber: string;
  link: string;
}

export const READER_THEMES: Record<ConcreteReaderTheme, ReaderPalette> = {
  claro: { bg: '#FFFFFF', text: '#12142B', muted: '#4A4E6A', verseNumber: '#2F45D6', link: '#2F45D6' },
  sepia: { bg: '#F4ECD8', text: '#3D3020', muted: '#6B5A40', verseNumber: '#8A5A1E', link: '#5A3A10' },
  noturno: { bg: '#0E1022', text: '#E3E5F5', muted: '#A7ABC8', verseNumber: '#F2B544', link: '#8C9BFF' },
};

/** Fundo efetivo da leitura, dado o tema do app. */
export function resolveReaderTheme(theme: ReaderThemeId, appDark: boolean): ConcreteReaderTheme {
  if (theme === 'auto') return appDark ? 'noturno' : 'claro';
  return theme;
}

export type HighlightColor = 'amarelo' | 'verde' | 'azul' | 'rosa';

export const HIGHLIGHTS: Record<HighlightColor, { light: string; dark: string; label: string }> = {
  amarelo: { light: 'rgba(250, 214, 92, 0.45)', dark: 'rgba(214, 178, 60, 0.35)', label: 'Amarelo' },
  verde: { light: 'rgba(140, 205, 150, 0.45)', dark: 'rgba(90, 160, 110, 0.38)', label: 'Verde' },
  azul: { light: 'rgba(140, 180, 240, 0.45)', dark: 'rgba(90, 130, 210, 0.40)', label: 'Azul' },
  rosa: { light: 'rgba(240, 160, 190, 0.45)', dark: 'rgba(200, 110, 150, 0.40)', label: 'Rosa' },
};

export const FONTS = {
  scripture: 'Newsreader_400Regular',
  scriptureItalic: 'Newsreader_400Regular_Italic',
  scriptureBold: 'Newsreader_600SemiBold',
  ui: 'PlusJakartaSans_400Regular',
  uiMedium: 'PlusJakartaSans_500Medium',
  uiSemiBold: 'PlusJakartaSans_600SemiBold',
  uiBold: 'PlusJakartaSans_700Bold',
  uiExtraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const RADIUS = { sm: 12, md: 18, lg: 28, pill: 999 } as const;
