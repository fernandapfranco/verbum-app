import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONTS, useTheme } from '@/theme';

export default function TabsLayout() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  // Altura explícita: a padrão (49) cortava os nomes das abas.
  const bottom = Math.max(insets.bottom, 8);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        // ícone (28) + nome (16) + respiro do item (5+5) = 54; com folga, 58 de conteúdo
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border, height: 62 + bottom, paddingTop: 4, paddingBottom: bottom },
        tabBarLabelStyle: { fontFamily: FONTS.uiMedium, fontSize: 12, lineHeight: 16 },
        sceneStyle: { backgroundColor: c.bg },
      }}
    >
      <Tabs.Screen
        name="hoje"
        options={{ title: 'Hoje', tabBarIcon: ({ color, size }) => <Ionicons name="sunny-outline" color={color as string} size={size} /> }}
      />
      <Tabs.Screen
        name="biblia"
        options={{ title: 'Bíblia', tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color as string} size={size} /> }}
      />
      <Tabs.Screen
        name="orar"
        options={{ title: 'Orar', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="church-outline" color={color as string} size={size} /> }}
      />
      <Tabs.Screen
        name="diario"
        options={{ title: 'Diário', tabBarIcon: ({ color, size }) => <Ionicons name="create-outline" color={color as string} size={size} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color as string} size={size} /> }}
      />
    </Tabs>
  );
}
