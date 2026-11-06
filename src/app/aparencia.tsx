import { View } from 'react-native';

import { Option, Screen, T } from '@/components/ui';
import { useSettings } from '@/store/settings';
import { READER_THEMES, resolveReaderTheme, SPACE, useTheme, type AppThemePref, type ReaderThemeId } from '@/theme';

const APP_OPTIONS: { id: AppThemePref; title: string; subtitle: string; icon: 'phone-portrait-outline' | 'sunny-outline' | 'moon-outline' }[] = [
  { id: 'sistema', title: 'Automático', subtitle: 'Segue o tema do celular', icon: 'phone-portrait-outline' },
  { id: 'claro', title: 'Claro', subtitle: 'Sempre claro', icon: 'sunny-outline' },
  { id: 'escuro', title: 'Escuro', subtitle: 'Sempre escuro, melhor à noite', icon: 'moon-outline' },
];

const READER_OPTIONS: { id: ReaderThemeId; title: string; subtitle: string }[] = [
  { id: 'auto', title: 'Igual ao app', subtitle: 'Claro ou noturno, conforme o tema acima' },
  { id: 'claro', title: 'Claro', subtitle: 'Fundo branco' },
  { id: 'sepia', title: 'Sépia', subtitle: 'Tom de papel, cansa menos a vista' },
  { id: 'noturno', title: 'Noturno', subtitle: 'Fundo escuro' },
];

export default function Aparencia() {
  const { c, dark } = useTheme();
  const appTheme = useSettings((s) => s.appTheme);
  const setAppTheme = useSettings((s) => s.setAppTheme);
  const reader = useSettings((s) => s.reader);
  const setReader = useSettings((s) => s.setReader);
  const preview = READER_THEMES[resolveReaderTheme(reader.theme, dark)];

  return (
    <Screen>
      <View style={{ gap: SPACE.sm }} accessibilityRole="radiogroup">
        <T variant="label" color={c.goldText}>
          Tema do app
        </T>
        {APP_OPTIONS.map((o) => (
          <Option key={o.id} title={o.title} subtitle={o.subtitle} icon={o.icon} selected={appTheme === o.id} onPress={() => setAppTheme(o.id)} />
        ))}
      </View>

      <View style={{ gap: SPACE.sm }} accessibilityRole="radiogroup">
        <T variant="label" color={c.goldText}>
          Fundo da leitura
        </T>
        <T variant="caption" muted>
          Vale para a Bíblia, o Evangelho do dia e as leituras das trilhas.
        </T>
        {READER_OPTIONS.map((o) => (
          <Option key={o.id} title={o.title} subtitle={o.subtitle} selected={reader.theme === o.id} onPress={() => setReader({ theme: o.id })} />
        ))}
        <View style={{ backgroundColor: preview.bg, borderRadius: 18, padding: SPACE.lg, borderWidth: 1, borderColor: c.border }} accessibilityLabel="Prévia do fundo da leitura">
          <T style={{ color: preview.text, fontFamily: 'Newsreader_400Regular', fontSize: reader.fontSize, lineHeight: reader.fontSize * 1.55 }}>
            <T style={{ color: preview.verseNumber, fontSize: reader.fontSize * 0.7 }}>1{"\u00A0"}</T>
            O Senhor me governa, e nada me faltará.
          </T>
        </View>
      </View>
    </Screen>
  );
}
