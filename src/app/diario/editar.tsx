import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';

import { Button, Screen, T } from '@/components/ui';
import { deleteJournalEntry, getJournalEntry, saveJournalEntry } from '@/db/user';
import { chapterLabel } from '@/lib/bible/format';
import { findBook } from '@/lib/bible/books';
import { useSettings } from '@/store/settings';
import { FONTS, RADIUS, SPACE, useTheme } from '@/theme';

export default function EditarDiario() {
  const params = useLocalSearchParams<{ id?: string; ref?: string; prompt?: string }>();
  const { c } = useTheme();
  const allowed = useSettings((s) => s.consent?.personalNotes ?? false);
  const existing = params.id ? getJournalEntry(Number(params.id)) : null;
  const [text, setText] = useState(existing?.text ?? '');
  const ref = existing?.ref ?? params.ref ?? null;
  const prompt = existing?.prompt ?? params.prompt ?? null;

  const refMatch = ref?.match(/^(\S+) (\d+)$/);
  const refTitle = refMatch && findBook(refMatch[1]) ? chapterLabel(refMatch[1], Number(refMatch[2])) : ref;

  if (!allowed) {
    return (
      <Screen edges={['bottom']}>
        <T>O diário está desligado. Ative em Perfil → Privacidade e dados.</T>
        <Button title="Abrir Privacidade e dados" onPress={() => router.replace('/privacidade')} />
      </Screen>
    );
  }

  const save = () => {
    if (!text.trim()) return router.back();
    saveJournalEntry({ id: existing?.id, ref, prompt, text: text.trim() });
    router.back();
  };

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: existing ? 'Editar anotação' : 'Nova anotação' }} />
      {refTitle && (
        <T variant="label" color={c.goldText}>
          {refTitle}
        </T>
      )}
      {prompt && <T variant="heading">{prompt}</T>}
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        autoFocus={!existing}
        placeholder="Escreva com liberdade. Só você vai ler."
        placeholderTextColor={c.textMuted}
        accessibilityLabel="Texto da anotação"
        style={{
          minHeight: 220,
          textAlignVertical: 'top',
          fontFamily: FONTS.scripture,
          fontSize: 18,
          lineHeight: 28,
          color: c.text,
          backgroundColor: c.surface,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: c.border,
          padding: SPACE.lg,
        }}
      />
      <View style={{ gap: SPACE.sm }}>
        <Button title="Salvar" onPress={save} />
        {existing && (
          <Button
            title="Apagar anotação"
            kind="danger"
            onPress={() =>
              Alert.alert('Apagar anotação?', 'Isso não pode ser desfeito.', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Apagar',
                  style: 'destructive',
                  onPress: () => {
                    deleteJournalEntry(existing.id);
                    router.back();
                  },
                },
              ])
            }
          />
        )}
      </View>
    </Screen>
  );
}
