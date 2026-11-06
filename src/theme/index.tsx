import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, Platform, StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';

import { useSettings } from '@/store/settings';

import { DARK, LIGHT, type Palette } from './tokens';

export * from './tokens';

interface Theme {
  dark: boolean;
  c: Palette;
}

const ThemeContext = createContext<Theme>({ dark: false, c: LIGHT });

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const pref = useSettings((s) => s.appTheme);
  const scheme = useColorScheme();
  // Também ajusta os elementos do sistema (teclado, alertas, seletores).
  useEffect(() => {
    try {
      Appearance.setColorScheme?.(pref === 'claro' ? 'light' : pref === 'escuro' ? 'dark' : 'unspecified');
    } catch {
      // web ou versão sem suporte: o tema do app continua funcionando
    }
  }, [pref]);
  const dark = pref === 'escuro' || (pref === 'sistema' && scheme === 'dark');
  const value = useMemo<Theme>(() => ({ dark, c: dark ? DARK : LIGHT }), [dark]);
  // Web: a cor de fundo da página acompanha o tema (aparece atrás das barras do navegador).
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const bg = dark ? DARK.bg : LIGHT.bg;
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', bg));
  }, [dark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/** Largura máxima do conteúdo em telas grandes (computador, tablet). */
export const MAX_CONTENT_WIDTH = 720;
const WIDE_FROM = 768;

/**
 * No celular, ocupa a tela inteira. Em telas largas, o app fica numa coluna
 * central, com largura boa para ler, e o resto da tela com um fundo suave.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  if (width < WIDE_FROM) return <>{children}</>;
  return (
    <View style={{ flex: 1, backgroundColor: c.surfaceAlt, alignItems: 'center' }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          backgroundColor: c.bg,
          borderLeftWidth: StyleSheet.hairlineWidth,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderColor: c.border,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}
