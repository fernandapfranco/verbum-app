import { Newsreader_400Regular } from '@expo-google-fonts/newsreader/400Regular';
import { Newsreader_400Regular_Italic } from '@expo-google-fonts/newsreader/400Regular_Italic';
import { Newsreader_600SemiBold } from '@expo-google-fonts/newsreader/600SemiBold';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { useFonts } from 'expo-font';
import { Stack, useRouter, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Cover } from '@/components/Cover';
import { APP_CONFIG } from '@/config';
import { applyStreakProtection, userDb } from '@/db/user';
import { refreshNotifications } from '@/hooks/useGamification';
import { listenNotificationTaps } from '@/lib/notifications';
import { useSession } from '@/store/session';
import { useSettings } from '@/store/settings';
import { AppThemeProvider, FONTS, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // No celular as operações síncronas do SQLite funcionam de imediato. Na web
  // (só para testes) é preciso "acordar" o worker com uma operação assíncrona.
  const [storageReady, setStorageReady] = useState(Platform.OS !== 'web');
  // Capa de abertura, a cada vez que o app é aberto.
  const [showCover, setShowCover] = useState(true);
  useEffect(() => {
    const startup = () => {
      userDb(); // abre o banco do usuário e roda as migrações
      // Acende velas para dias perdidos (se houver) e reagenda lembretes.
      if (useSettings.getState().onboarding.done) {
        const r = applyStreakProtection();
        useSession.getState().set({ protectedNow: r.protect.length, streakBroken: r.broken });
        refreshNotifications();
      }
    };
    if (Platform.OS !== 'web') {
      startup();
      return;
    }
    (async () => {
      await Storage.getItemAsync('verbum.warmup');
      await useSettings.persist.rehydrate();
      startup();
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
        {showCover && <Cover onDone={() => setShowCover(false)} />}
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
  const router = useRouter();
  useEffect(
    () =>
      listenNotificationTaps((url) => {
        if (useSettings.getState().onboarding.done) router.push(url as Href);
      }),
    [router],
  );
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.primary,
          headerTitleStyle: { fontFamily: FONTS.uiBold, color: c.text },
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
        <Stack.Screen name="checkin" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="ofensiva" options={{ title: 'Ofensiva' }} />
        <Stack.Screen name="notificacoes" options={{ title: 'Notificações' }} />
        <Stack.Screen name="oracao/[id]" options={{ title: 'Oração' }} />
        <Stack.Screen name="terco/index" options={{ title: 'Terço' }} />
        <Stack.Screen name="terco/rezar" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </>
  );
}
