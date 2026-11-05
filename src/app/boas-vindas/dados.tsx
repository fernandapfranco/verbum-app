import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Checkbox, Screen, T } from '@/components/ui';
import { LEGAL_VERSION } from '@/content/legal';
import { logConsent } from '@/db/user';
import { useSettings } from '@/store/settings';
import { SPACE } from '@/theme';

/**
 * Primeiro acesso, passo 2: consentimento específico para dados sensíveis.
 * Opcional — o app funciona sem ele (só o diário e as notas ficam desligados).
 */
export default function Dados() {
  const { update } = useLocalSearchParams<{ update?: string }>();
  const prev = useSettings((s) => s.consent);
  const setConsent = useSettings((s) => s.setConsent);
  const onboardingDone = useSettings((s) => s.onboarding.done);
  // Caixa desmarcada por padrão: consentimento precisa ser um ato afirmativo.
  const [notes, setNotes] = useState(prev?.personalNotes ?? false);

  const finish = () => {
    const at = new Date().toISOString();
    logConsent('termos', LEGAL_VERSION, true);
    logConsent('idade', LEGAL_VERSION, true);
    logConsent('notas-pessoais', LEGAL_VERSION, notes);
    setConsent({ legalVersion: LEGAL_VERSION, acceptedAt: at, ageConfirmed: true, personalNotes: notes });
    router.replace(update === '1' && onboardingDone ? '/hoje' : '/onboarding');
  };

  return (
    <Screen edges={['bottom']}>
      <T variant="title">Seu diário é só seu</T>
      <T>
        Rezar e escrever sobre a fé é algo muito pessoal. A lei brasileira (LGPD) trata informações sobre convicção
        religiosa como dados sensíveis, então queremos sua permissão específica para isso.
      </T>

      <Card>
        <Checkbox
          label="Permitir que o Verbum guarde meu diário espiritual e minhas notas pessoais neste aparelho"
          checked={notes}
          onChange={setNotes}
        >
          <View style={{ gap: 4 }}>
            <T variant="bodyStrong">Guardar meu diário espiritual e minhas notas nos versículos</T>
            <T variant="caption" muted>
              Ficam apenas neste celular. Nada é enviado para a internet. Você pode mudar isso depois em Perfil →
              Privacidade e dados.
            </T>
          </View>
        </Checkbox>
      </Card>

      {!notes && (
        <T variant="caption" muted>
          Tudo bem! Sem essa permissão, o diário e as notas ficam desligados — o resto do app funciona normalmente.
        </T>
      )}

      <Card tone="alt">
        <T variant="caption" muted>
          Recursos com amigos e pedidos de oração (em uma versão futura) vão pedir uma nova permissão, separada, antes de
          enviar qualquer coisa.
        </T>
      </Card>

      <View style={{ marginTop: SPACE.md }}>
        <Button title="Continuar" onPress={finish} />
      </View>
    </Screen>
  );
}
