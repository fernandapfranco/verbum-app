import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Share, Switch, View } from 'react-native';

import { Button, Card, Divider, Row, Screen, T } from '@/components/ui';
import { LEGAL_VERSION } from '@/content/legal';
import { deletePersonalNotes, exportAllData, listConsentLog, logConsent, wipeAllData } from '@/db/user';
import { formatDate } from '@/lib/dates';
import { useSettings } from '@/store/settings';
import { SPACE, useTheme } from '@/theme';

const KIND_LABEL: Record<string, string> = {
  termos: 'Termos e Política',
  idade: 'Confirmação de idade',
  'notas-pessoais': 'Diário e notas pessoais',
};

export default function Privacidade() {
  const { c } = useTheme();
  const consent = useSettings((s) => s.consent);
  const setPersonal = useSettings((s) => s.setPersonalNotesConsent);
  const resetAll = useSettings((s) => s.resetAll);
  const [refresh, setRefresh] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const log = useMemo(() => listConsentLog().slice(0, 10), [refresh]);

  const togglePersonal = (on: boolean) => {
    if (on) {
      setPersonal(true);
      logConsent('notas-pessoais', LEGAL_VERSION, true);
      setRefresh((x) => x + 1);
      return;
    }
    Alert.alert(
      'Desligar diário e notas?',
      'Ao retirar a permissão, seu diário e suas notas nos versículos serão apagados deste aparelho. Se quiser guardar uma cópia, exporte seus dados antes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desligar e apagar',
          style: 'destructive',
          onPress: () => {
            deletePersonalNotes();
            setPersonal(false);
            logConsent('notas-pessoais', LEGAL_VERSION, false);
            setRefresh((x) => x + 1);
          },
        },
      ],
    );
  };

  const exportData = async () => {
    const s = useSettings.getState();
    const data = exportAllData({
      consentimento: s.consent,
      onboarding: s.onboarding,
      nomeDoAnjo: s.angelName,
      leitura: s.reader,
    });
    const json = JSON.stringify(data, null, 2);
    try {
      const file = new File(Paths.cache, `verbum-meus-dados-${new Date().toISOString().slice(0, 10)}.json`);
      file.create({ overwrite: true });
      file.write(json);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Exportar meus dados' });
        return;
      }
    } catch {
      // cai no compartilhamento de texto abaixo
    }
    await Share.share({ message: json });
  };

  const wipe = () =>
    Alert.alert(
      'Apagar todos os dados?',
      'Progresso, plano, destaques, notas, diário e preferências serão apagados deste aparelho. Isso não pode ser desfeito.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: () => {
            wipeAllData();
            resetAll();
            router.replace('/');
          },
        },
      ],
    );

  return (
    <Screen edges={['bottom']}>
      <Card tone="soft">
        <T variant="heading">Seus dados ficam com você</T>
        <T>Nesta versão, nada sai do seu celular: não há conta, servidor nem anúncios.</T>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md }}>
          <View style={{ flex: 1 }}>
            <T variant="bodyStrong">Diário e notas pessoais</T>
            <T variant="caption" muted>
              Consentimento específico (LGPD, art. 11). Desligar apaga diário e notas.
            </T>
          </View>
          <Switch
            value={consent?.personalNotes ?? false}
            onValueChange={togglePersonal}
            accessibilityLabel="Permitir diário e notas pessoais"
            trackColor={{ true: c.primary, false: c.border }}
          />
        </View>
      </Card>

      <Card>
        <Row icon="download-outline" title="Exportar meus dados" subtitle="Um arquivo com tudo o que o app guarda" onPress={exportData} />
        <Divider />
        <Row icon="document-text-outline" title="Política de Privacidade" onPress={() => router.push('/legal/privacidade')} />
        <Divider />
        <Row icon="reader-outline" title="Termos de Uso" onPress={() => router.push('/legal/termos')} />
      </Card>

      <Card tone="alt">
        <T variant="label" muted>
          Histórico de consentimentos
        </T>
        {consent && (
          <T variant="caption" muted>
            Termos aceitos em {new Date(consent.acceptedAt).toLocaleString('pt-BR')} (versão {formatDate(consent.legalVersion)}).
          </T>
        )}
        {log.map((l, i) => (
          <T key={i} variant="caption" muted>
            {new Date(l.at).toLocaleString('pt-BR')} · {KIND_LABEL[l.kind] ?? l.kind}: {l.granted ? 'concedido' : 'retirado'}
          </T>
        ))}
      </Card>

      <Button title="Apagar todos os meus dados" kind="danger" icon="trash-outline" onPress={wipe} />
    </Screen>
  );
}
