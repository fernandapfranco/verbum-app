import { router } from 'expo-router';
import { View } from 'react-native';

import { Angel } from '@/components/Angel';
import { Button, Screen, T } from '@/components/ui';
import { MIN_AGE } from '@/content/legal';
import { SPACE } from '@/theme';

export default function Menor() {
  return (
    <Screen edges={['top', 'bottom']} contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', gap: SPACE.lg }}>
        <Angel size={120} mood="sereno" />
        <T variant="title" style={{ textAlign: 'center' }}>
          Que alegria ver você buscando a Palavra!
        </T>
        <T style={{ textAlign: 'center' }}>
          Por enquanto, o Verbum é feito para quem tem {MIN_AGE} anos ou mais. Enquanto isso, que tal ler a Bíblia junto
          com sua família, seu catequista ou o grupo de jovens da sua paróquia?
        </T>
        <T muted style={{ textAlign: 'center' }}>
          Deus te abençoe — estaremos aqui quando chegar a hora. 💛
        </T>
        <Button title="Voltar" kind="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
