import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Angel } from '@/components/Angel';
import { Button, Card, Checkbox, Screen, T } from '@/components/ui';
import { LEGAL_VERSION, MIN_AGE } from '@/content/legal';
import { useSettings } from '@/store/settings';
import { SPACE, useTheme } from '@/theme';

/**
 * Primeiro acesso, passo 1: apresentação + Termos/Política + idade mínima.
 * O consentimento para dados sensíveis vem no passo seguinte, separado
 * (LGPD art. 11 exige consentimento específico e destacado).
 */
export default function BoasVindas() {
  const { c } = useTheme();
  const previous = useSettings((s) => s.consent);
  const isUpdate = !!previous && previous.legalVersion !== LEGAL_VERSION;
  const [terms, setTerms] = useState(false);
  const [age, setAge] = useState<boolean | null>(null);

  const canContinue = terms && age === true;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ alignItems: 'center', gap: SPACE.md, marginTop: SPACE.lg }}>
        <Angel size={120} mood="feliz" />
        <T variant="display" style={{ textAlign: 'center' }}>
          {isUpdate ? 'Atualizamos nossos termos' : 'Boas-vindas ao Verbum'}
        </T>
        <T muted style={{ textAlign: 'center' }}>
          {isUpdate
            ? 'Fizemos mudanças nos Termos de Uso ou na Política de Privacidade. Dá uma olhadinha antes de continuar?'
            : 'Um companheiro para ler a Bíblia inteira com constância e crescer na oração — no seu ritmo, sem cobrança.'}
        </T>
      </View>

      <Card tone="soft">
        <T variant="heading">Antes de começar, o essencial</T>
        <T>• Seu progresso, notas e diário ficam só no seu celular.</T>
        <T>• Não pedimos conta, não vendemos dados, não temos anúncios.</T>
        <T>• Você pode exportar ou apagar tudo quando quiser.</T>
      </Card>

      <View style={{ gap: SPACE.sm }}>
        <Checkbox label="Li e concordo com os Termos de Uso e a Política de Privacidade" checked={terms} onChange={setTerms}>
          <T>
            Li e concordo com os{' '}
            <T color={c.primary} style={{ textDecorationLine: 'underline' }} onPress={() => router.push('/legal/termos')} accessibilityRole="link">
              Termos de Uso
            </T>{' '}
            e a{' '}
            <T color={c.primary} style={{ textDecorationLine: 'underline' }} onPress={() => router.push('/legal/privacidade')} accessibilityRole="link">
              Política de Privacidade
            </T>
            .
          </T>
        </Checkbox>

        <T variant="bodyStrong" style={{ marginTop: SPACE.md }}>
          Você tem {MIN_AGE} anos ou mais?
        </T>
        <View style={{ flexDirection: 'row', gap: SPACE.md }}>
          <Button title="Sim, tenho" kind={age === true ? 'primary' : 'ghost'} onPress={() => setAge(true)} style={{ flex: 1 }} />
          <Button
            title="Ainda não"
            kind={age === false ? 'primary' : 'ghost'}
            onPress={() => {
              setAge(false);
              router.push('/boas-vindas/menor');
            }}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <Button
        title="Continuar"
        disabled={!canContinue}
        onPress={() => router.push({ pathname: '/boas-vindas/dados', params: { update: isUpdate ? '1' : '0' } })}
        accessibilityHint={canContinue ? undefined : 'Aceite os termos e confirme a idade para continuar'}
      />
    </Screen>
  );
}
