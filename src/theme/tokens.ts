/**
 * Identidade visual: creme, azul mariano e dourado; serifada (Literata) para o
 * texto bíblico e sem serifa (Inter) para a interface.
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
  bg: '#FBF7EF',
  surface: '#FFFFFF',
  surfaceAlt: '#F3ECDD',
  border: '#E4D9C4',
  text: '#1F2430',
  textMuted: '#585E6B',
  primary: '#1E3A6E',
  onPrimary: '#FFFFFF',
  primarySoft: '#E3EAF6',
  gold: '#C9A04A',
  goldText: '#7D5A12',
  success: '#2F6B4F',
  danger: '#A23B3B',
  overlay: 'rgba(16, 20, 31, 0.45)',
};

export const DARK: Palette = {
  bg: '#10141F',
  surface: '#1A2030',
  surfaceAlt: '#222A3D',
  border: '#2E3850',
  text: '#EDE8DD',
  textMuted: '#A9AFBD',
  primary: '#9DB8EA',
  onPrimary: '#0E1525',
  primarySoft: '#23324F',
  gold: '#D9AE5C',
  goldText: '#E2BD72',
  success: '#7CC4A0',
  danger: '#E58A8A',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type ReaderThemeId = 'claro' | 'sepia' | 'noturno';

export interface ReaderPalette {
  bg: string;
  text: string;
  muted: string;
  verseNumber: string;
  link: string;
}

export const READER_THEMES: Record<ReaderThemeId, ReaderPalette> = {
  claro: { bg: '#FFFDF8', text: '#1F2430', muted: '#5D6370', verseNumber: '#8A6A2A', link: '#1E3A6E' },
  sepia: { bg: '#F4ECD8', text: '#3D3020', muted: '#6B5A40', verseNumber: '#8A5A1E', link: '#5A3A10' },
  noturno: { bg: '#0F1218', text: '#DDD6C8', muted: '#9AA0AC', verseNumber: '#C9A04A', link: '#9DB8EA' },
};

export type HighlightColor = 'amarelo' | 'verde' | 'azul' | 'rosa';

export const HIGHLIGHTS: Record<HighlightColor, { light: string; dark: string; label: string }> = {
  amarelo: { light: 'rgba(250, 214, 92, 0.45)', dark: 'rgba(214, 178, 60, 0.35)', label: 'Amarelo' },
  verde: { light: 'rgba(140, 205, 150, 0.45)', dark: 'rgba(90, 160, 110, 0.38)', label: 'Verde' },
  azul: { light: 'rgba(140, 180, 240, 0.45)', dark: 'rgba(90, 130, 210, 0.40)', label: 'Azul' },
  rosa: { light: 'rgba(240, 160, 190, 0.45)', dark: 'rgba(200, 110, 150, 0.40)', label: 'Rosa' },
};

export const FONTS = {
  scripture: 'Literata_400Regular',
  scriptureItalic: 'Literata_400Regular_Italic',
  scriptureBold: 'Literata_600SemiBold',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemiBold: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
} as const;

export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const RADIUS = { sm: 8, md: 14, lg: 20, pill: 999 } as const;
