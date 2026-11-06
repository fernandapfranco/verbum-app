import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

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
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
