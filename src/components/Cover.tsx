/**
 * Capa de abertura: aparece por alguns segundos sempre que o app é aberto,
 * depois da tela de carregamento nativa (que usa o mesmo azul, para a
 * transição ficar contínua). Toque em qualquer lugar para pular.
 * Respeita "Reduzir movimento" do sistema.
 */
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS, SPACE } from '@/theme';

import { Angel } from './Angel';
import { T } from './ui';

const BLUE = '#2F45D6';
const SHOW_MS = 2200;

export function Cover({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(16)).current;
  const content = useRef(new Animated.Value(0)).current;
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    Animated.timing(opacity, { toValue: 0, duration: 380, useNativeDriver: true }).start(() => onDone());
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (reduce) {
          content.setValue(1);
          rise.setValue(0);
        } else {
          Animated.parallel([
            Animated.timing(content, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(rise, { toValue: 0, duration: 700, useNativeDriver: true }),
          ]).start();
        }
        timer = setTimeout(finish, SHOW_MS);
      });
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: BLUE, opacity, zIndex: 100 }]}>
      <Pressable
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom + SPACE.xl }}
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel="Verbum. Toque para entrar"
      >
        <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACE.lg, opacity: content, transform: [{ translateY: rise }] }}>
          <View style={{ width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Angel size={180} onPrimary />
          </View>
          <T color="#FFFFFF" style={{ fontFamily: FONTS.uiExtraBold, fontSize: 44, lineHeight: 52, letterSpacing: -1.2 }}>
            Verbum
          </T>
          <T color="#E6EAFF" style={{ fontSize: 17, textAlign: 'center' }}>
            A Palavra, um dia de cada vez.
          </T>
        </Animated.View>
        <Animated.View style={{ opacity: content, paddingHorizontal: SPACE.xxl, alignItems: 'center', gap: SPACE.xs }}>
          <T color="#FFFFFF" style={{ fontFamily: FONTS.scriptureItalic, fontSize: 17, lineHeight: 26, textAlign: 'center' }}>
            “Tocha resplandecente para os meus pés é a tua palavra, e luz para os meus caminhos.”
          </T>
          <T variant="caption" color="#C9D2FF">
            Salmo 119 (118), 105
          </T>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
