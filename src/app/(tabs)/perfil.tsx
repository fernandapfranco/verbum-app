import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Angel } from '@/components/Angel';
import { Sheet } from '@/components/Sheet';
import { Button, Card, Divider, Row, Screen, T } from '@/components/ui';
import { DEFAULT_ANGEL_NAME } from '@/content/angel';
import { TRAILS } from '@/content/trails';
import { usePlan } from '@/hooks/usePlan';
import { scopeLabel } from '@/lib/plan/engine';
import { useSettings } from '@/store/settings';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

export default function Perfil() {
  const { c } = useTheme();
  const angelName = useSettings((s) => s.angelName) || DEFAULT_ANGEL_NAME;
  const setAngelName = useSettings((s) => s.setAngelName);
  const { config, read } = usePlan();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(angelName);

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: SPACE.sm, marginTop: SPACE.md }}>
        <Angel size={110} />
        <T variant="title">{angelName}</T>
        <T variant="caption" muted onPress={() => setEditing(true)} accessibilityRole="button">
          seu anjo da guarda · trocar nome
        </T>
      </View>

      <Card>
        <T variant="label" color={c.goldText}>
          Sua caminhada
        </T>
        <T>
          {read.size} {read.size === 1 ? 'capítulo lido' : 'capítulos lidos'}
        </T>
        <T variant="caption" muted>
          Na próxima fase: XP, níveis e conquistas.
        </T>
      </Card>

      <Card>
        <Row
          icon="calendar-outline"
          title="Plano de leitura"
          subtitle={config ? scopeLabel(config.scope) : 'Nenhum plano ativo'}
          onPress={() => router.push(config ? '/plano' : '/plano/novo')}
        />
        <Divider />
        {TRAILS.map((t) => (
          <View key={t.id}>
            <Row
              icon={t.id === 'primeiros-passos' ? 'footsteps-outline' : 'home-outline'}
              title={`Trilha ${t.titulo}`}
              subtitle={t.subtitulo}
              onPress={() => router.push({ pathname: '/trilha/[id]', params: { id: t.id } })}
            />
            <Divider />
          </View>
        ))}
        <Row icon="flame-outline" title="Ofensiva e talentos" subtitle="Velas de proteção" onPress={() => router.push('/ofensiva')} />
        <Divider />
        <Row icon="notifications-outline" title="Notificações" subtitle="Lembretes do anjo, ofensiva, Angelus" onPress={() => router.push('/notificacoes')} />
        <Divider />
        <Row icon="bookmark-outline" title="Versículos salvos" onPress={() => router.push('/salvos')} />
        <Divider />
        <Row icon="library-outline" title="Glossário" subtitle="Termos da fé e palavras antigas" onPress={() => router.push('/glossario')} />
      </Card>

      <Card>
        <Row icon="information-circle-outline" title="Sobre o texto bíblico" onPress={() => router.push('/sobre-o-texto')} />
        <Divider />
        <Row icon="shield-checkmark-outline" title="Privacidade e dados" onPress={() => router.push('/privacidade')} />
        <Divider />
        <Row icon="document-text-outline" title="Termos de Uso" onPress={() => router.push('/legal/termos')} />
      </Card>

      <T variant="caption" muted style={{ textAlign: 'center' }}>
        Verbum · versão 1.0 (fase 1)
      </T>

      <Sheet visible={editing} onClose={() => setEditing(false)} title="Nome do seu anjo">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          maxLength={20}
          autoFocus
          accessibilityLabel="Nome do anjo"
          style={{
            fontFamily: FONTS.uiSemiBold,
            fontSize: 18,
            color: c.text,
            backgroundColor: c.bg,
            borderRadius: RADIUS.md,
            padding: SPACE.md,
          }}
        />
        <Button
          title="Salvar"
          onPress={() => {
            setAngelName(draft.trim() || DEFAULT_ANGEL_NAME);
            setEditing(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}
