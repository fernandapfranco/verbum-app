/**
 * Componentes básicos de interface. Acessibilidade: alvos de toque ≥ 44pt,
 * rótulos e papéis para leitores de tela, e respeito ao tamanho de fonte do
 * sistema (limitado em 1,6× nos elementos de interface para não quebrar layout).
 */
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

import { Angel, type AngelMood } from './Angel';

export type IconName = ComponentProps<typeof Ionicons>['name'];

const UI_MAX_SCALE = 1.6;

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'caption' | 'label' | 'scripture';

const VARIANTS: Record<Variant, TextStyle> = {
  display: { fontFamily: FONTS.uiExtraBold, fontSize: 32, lineHeight: 38, letterSpacing: -0.8 },
  title: { fontFamily: FONTS.uiExtraBold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  heading: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: FONTS.ui, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: FONTS.uiSemiBold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: FONTS.uiBold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase' },
  scripture: { fontFamily: FONTS.scripture, fontSize: 19, lineHeight: 31 },
};

export function T({
  variant = 'body',
  muted,
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; muted?: boolean; color?: string }) {
  const { c } = useTheme();
  const heading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <Text
      maxFontSizeMultiplier={variant === 'scripture' ? undefined : UI_MAX_SCALE}
      accessibilityRole={heading ? 'header' : undefined}
      style={[VARIANTS[variant], { color: color ?? (muted ? c.textMuted : c.text) }, style]}
      {...rest}
    />
  );
}

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom')[];
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 2, gap: SPACE.lg }, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, padding: SPACE.lg, gap: SPACE.lg }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
  tone = 'surface',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  tone?: 'surface' | 'soft' | 'alt' | 'primary';
}) {
  const { c, dark } = useTheme();
  const bg =
    tone === 'soft' ? c.primarySoft : tone === 'alt' ? c.surfaceAlt : tone === 'primary' ? c.primary : c.surface;
  const base: ViewStyle = {
    backgroundColor: bg,
    borderRadius: RADIUS.lg,
    padding: SPACE.lg + 4,
    // Estilo Luz: cartões sem contorno no claro; no escuro, um contorno sutil separa as camadas.
    borderWidth: dark && tone === 'surface' ? StyleSheet.hairlineWidth : 0,
    borderColor: c.border,
    gap: SPACE.sm,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}
    >
      {children}
    </Pressable>
  );
}

export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  disabled,
  accessibilityHint,
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const bg = kind === 'primary' ? c.primary : kind === 'secondary' ? c.primarySoft : 'transparent';
  const fg = kind === 'primary' ? c.onPrimary : kind === 'danger' ? c.danger : c.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: RADIUS.pill,
          backgroundColor: bg,
          paddingHorizontal: SPACE.xl,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACE.sm,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
          borderWidth: kind === 'ghost' || kind === 'danger' ? 1 : 0,
          borderColor: kind === 'danger' ? c.danger : c.border,
        },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={20} color={fg} />}
      <T variant="bodyStrong" color={fg} style={{ fontFamily: FONTS.uiBold }}>
        {title}
      </T>
    </Pressable>
  );
}

/** Opção selecionável (perguntas do onboarding, escolha de plano…). */
export function Option({
  title,
  subtitle,
  selected,
  onPress,
  icon,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        borderRadius: RADIUS.md + 2,
        borderWidth: 2,
        borderColor: selected ? c.primary : 'transparent',
        backgroundColor: selected ? c.primarySoft : c.surface,
        padding: SPACE.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACE.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {icon && <Ionicons name={icon} size={24} color={selected ? c.primary : c.textMuted} />}
      <View style={{ flex: 1, gap: 2 }}>
        <T variant="bodyStrong">{title}</T>
        {subtitle ? <T variant="caption" muted>{subtitle}</T> : null}
      </View>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? c.primary : c.textMuted}
      />
    </Pressable>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  children,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: ReactNode;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={{ flexDirection: 'row', gap: SPACE.md, alignItems: 'flex-start', paddingVertical: SPACE.sm }}
    >
      <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={26} color={checked ? c.primary : c.textMuted} />
      <View style={{ flex: 1 }}>{children ?? <T>{label}</T>}</View>
    </Pressable>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const { c } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{ height: 8, borderRadius: 4, backgroundColor: c.surfaceAlt, overflow: 'hidden' }}
    >
      <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: c.gold, borderRadius: 4 }} />
    </View>
  );
}

/** O anjo falando, com balão. */
export function AngelSays({ text, mood = 'feliz', size = 72 }: { text: string; mood?: AngelMood; size?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md }} accessible accessibilityLabel={`Seu anjo diz: ${text}`}>
      <Angel size={size} mood={mood} />
      <View
        style={{
          flex: 1,
          backgroundColor: c.surface,
          borderRadius: RADIUS.lg,
          borderTopLeftRadius: 6,
          padding: SPACE.md + 2,
        }}
      >
        <T>{text}</T>
      </View>
    </View>
  );
}

export function Row({
  icon,
  leading,
  title,
  subtitle,
  onPress,
  right,
}: {
  icon?: IconName;
  /** Ícone próprio (ex.: SacredIcon), no lugar de `icon`. */
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACE.md,
        minHeight: 52,
        paddingVertical: SPACE.sm,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {leading ?? (icon && <Ionicons name={icon} size={22} color={c.primary} />)}
      <View style={{ flex: 1 }}>
        <T variant="bodyStrong">{title}</T>
        {subtitle ? <T variant="caption" muted>{subtitle}</T> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={20} color={c.textMuted} /> : null)}
    </Pressable>
  );
}

export function Divider() {
  const { c } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }} />;
}

/** Etiqueta "em revisão" para conteúdos ainda não aprovados pelo revisor doutrinal. */
export function ReviewTag({ status }: { status: string }) {
  const { c } = useTheme();
  if (status === 'aprovado') return null;
  return (
    <View
      style={{ alignSelf: 'flex-start', borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: c.surfaceAlt }}
      accessibilityLabel="Conteúdo em revisão doutrinal"
    >
      <T variant="caption" muted>
        em revisão
      </T>
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        minHeight: 44,
        minWidth: 44,
        paddingHorizontal: SPACE.md,
        borderRadius: RADIUS.pill,
        borderWidth: 1.5,
        borderColor: selected ? c.primary : 'transparent',
        backgroundColor: selected ? c.primary : c.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T variant="bodyStrong" color={selected ? c.onPrimary : c.text}>
        {label}
      </T>
    </Pressable>
  );
}
