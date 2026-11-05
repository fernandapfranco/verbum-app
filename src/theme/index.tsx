import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { DARK, LIGHT, type Palette } from './tokens';

export * from './tokens';

interface Theme {
  dark: boolean;
  c: Palette;
}

const ThemeContext = createContext<Theme>({ dark: false, c: LIGHT });

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const value = useMemo<Theme>(
    () => ({ dark: scheme === 'dark', c: scheme === 'dark' ? DARK : LIGHT }),
    [scheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
