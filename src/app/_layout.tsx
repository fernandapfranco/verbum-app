import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Literata_400Regular } from '@expo-google-fonts/literata/400Regular';
import { Literata_400Regular_Italic } from '@expo-google-fonts/literata/400Regular_Italic';
import { Literata_600SemiBold } from '@expo-google-fonts/literata/600SemiBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_CONFIG } from '@/config';
import { userDb } from '@/db/user';
import { useSettings } from '@/store/settings';
import { AppThemeProvider, FONTS, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Literata_400Regular,
    Literata_400Regular_Italic,
    Literata_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // No celular as operações síncronas do SQLite funcionam de imediato. Na web
  // (só para testes) é preciso "acordar" o worker com uma operação assíncrona.
  const [storageReady, setStorageReady] = useState(Platform.OS !== 'web');
  useEffect(() => {
    if (Platform.OS !== 'web') {
      userDb(); // abre o banco do usuário e roda as migrações
      return;
    }
    (async () => {
      await Storage.getItemAsync('verbum.warmup');
      await useSettings.persist.rehydrate();
      userDb();
      setStorageReady(true);
    })();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if ((!fontsLoaded && !fontError) || !storageReady) return null;

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider
            databaseName={APP_CONFIG.bibleDbName}
            assetSource={{ assetId: require('../../assets/db/bible.db') }}
            useSuspense
          >
            <RootStack />
          </SQLiteProvider>
        </Suspense>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

function Loading() {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
      <ActivityIndicator color={c.primary} accessibilityLabel="Preparando a Bíblia" />
    </View>
  );
}

function RootStack() {
  const { c, dark } = useTheme();
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.primary,
          headerTitleStyle: { fontFamily: FONTS.uiSemiBold, color: c.text },
          headerShadowVisible: false,
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: c.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Início' }} />
        <Stack.Screen name="boas-vindas/index" options={{ headerShown: false }} />
        <Stack.Screen name="boas-vindas/dados" options={{ title: 'Seus dados' }} />
        <Stack.Screen name="boas-vindas/menor" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="leitor/[livro]/[capitulo]" options={{ headerShown: false }} />
        <Stack.Screen name="licao/[trilha]/[licao]" options={{ headerShown: false }} />
        <Stack.Screen name="legal/[doc]" options={{ title: '' }} />
        <Stack.Screen name="livro/[id]" options={{ title: '' }} />
        <Stack.Screen name="trilha/[id]" options={{ title: '' }} />
        <Stack.Screen name="plano/novo" options={{ title: 'Novo plano' }} />
        <Stack.Screen name="plano/index" options={{ title: 'Seu plano' }} />
        <Stack.Screen name="diario/editar" options={{ title: 'Diário', presentation: 'modal' }} />
        <Stack.Screen name="busca" options={{ title: 'Buscar na Bíblia' }} />
        <Stack.Screen name="salvos" options={{ title: 'Versículos salvos' }} />
        <Stack.Screen name="glossario" options={{ title: 'Glossário' }} />
        <Stack.Screen name="privacidade" options={{ title: 'Privacidade e dados' }} />
        <Stack.Screen name="sobre-o-texto" options={{ title: 'Sobre o texto bíblico' }} />
      </Stack>
    </>
  );
}
