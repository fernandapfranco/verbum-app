import { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';

import { NotificationOptions } from '@/components/NotificationOptions';
import { Button, Card, Screen, T } from '@/components/ui';
import { refreshNotifications } from '@/hooks/useGamification';
import { getPermission, requestPermission } from '@/lib/notifications';
import { useSettings } from '@/store/settings';

export default function Notificacoes() {
  const prefs = useSettings((s) => s.notifications);
  const set = useSettings((s) => s.setNotifications);
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    getPermission().then(setGranted);
  }, []);

  // Qualquer mudança nas preferências reagenda os lembretes.
  useEffect(() => {
    refreshNotifications();
  }, [prefs]);

  const enable = async () => {
    const ok = await requestPermission();
    setGranted(ok);
    set({ enabled: ok });
  };

  return (
    <Screen edges={['bottom']}>
      {Platform.OS === 'web' ? (
        <T muted>Notificações só funcionam no celular.</T>
      ) : !prefs.enabled || granted === false ? (
        <Card tone="soft">
          <T variant="heading">Notificações desligadas</T>
          <T>Seu anjo só manda o que você escolher, e você pode mudar quando quiser.</T>
          <Button title="Ativar notificações" onPress={enable} />
          {granted === false && (
            <Button title="Abrir ajustes do celular" kind="ghost" onPress={() => Linking.openSettings()} />
          )}
        </Card>
      ) : (
        <>
          <Card>
            <NotificationOptions />
          </Card>
          <Button title="Desligar todas" kind="ghost" onPress={() => set({ enabled: false })} />
        </>
      )}
    </Screen>
  );
}
