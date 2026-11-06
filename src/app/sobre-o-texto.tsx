import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { Linking } from 'react-native';

import { Card, Screen, T } from '@/components/ui';
import { useTheme } from '@/theme';
import { getMeta } from '@/db/bible';

const SOURCES = [
  { label: 'github.com/ronaldomelofz/abibliasagrada', url: 'https://github.com/ronaldomelofz/abibliasagrada' },
  { label: 'github.com/gpadova/biblia-chat-server', url: 'https://github.com/gpadova/biblia-chat-server' },
];

export default function SobreOTexto() {
  const { c } = useTheme();
  const db = useSQLiteContext();
  const stats = useMemo(() => {
    const r = db.getFirstSync<{ total: number; revisar: number; ausentes: number; revisados: number }>(`
      SELECT SUM(verse_count) AS total, SUM(suspect_count) AS revisar,
             SUM(missing_count) AS ausentes, SUM(reviewed) AS revisados
      FROM chapters`); // totais por capítulo: rápido também na web
    return { ...r!, meta: getMeta(db) };
  }, [db]);

  return (
    <Screen edges={['bottom']}>
      <T variant="title">Bíblia Sagrada — tradução de Figueiredo</T>
      <T>
        O Pe. Antônio Pereira de Figueiredo (1725–1797) traduziu a Bíblia inteira da Vulgata latina para o português. Foi
        a Bíblia católica mais lida no Brasil por mais de um século. Como ele faleceu há mais de 200 anos, a tradução está
        em domínio público.
      </T>
      <T>
        Atualizamos apenas a ortografia (por exemplo, "êle" virou "ele"), sem mudar a tradução. O estilo é mais solene que
        o das Bíblias atuais — por isso o glossário explica as palavras antigas.
      </T>
      <Card>
        <T variant="heading">Numeração dos Salmos</T>
        <T>
          Esta tradução segue a numeração antiga (grega/latina). Mostramos sempre as duas: "Salmo 23 (22)" quer dizer Salmo
          23 nas Bíblias atuais e 22 nesta tradução.
        </T>
      </Card>
      <Card>
        <T variant="heading">Texto em revisão</T>
        <T>
          O texto foi recuperado de digitalizações (OCR) de uma edição de 1950, combinando duas leituras independentes para
          corrigir erros. Ainda assim, alguns trechos podem ter pequenas falhas, e alguns versículos aparecem como […] até
          serem recuperados. Estamos revisando tudo, começando pelos textos das trilhas.
        </T>
        <T variant="caption" muted>
          {stats.total.toLocaleString('pt-BR')} versículos · {stats.revisar.toLocaleString('pt-BR')} marcados para revisão ·{' '}
          {stats.ausentes} ainda em recuperação · {stats.revisados} capítulos já revisados à mão.
        </T>
      </Card>
      <Card>
        <T variant="heading">Créditos</T>
        <T>
          <T variant="bodyStrong">Tradução: </T>
          Pe. Antônio Pereira de Figueiredo (1725–1797), a partir da Vulgata latina. Domínio público.
        </T>
        <T>
          <T variant="bodyStrong">Texto digital: </T>
          duas digitalizações independentes da edição de 1950, publicadas no GitHub. Nosso muito obrigado a quem as compartilhou:
        </T>
        {SOURCES.map((s) => (
          <T key={s.url} color={c.primary} onPress={() => Linking.openURL(s.url)} accessibilityRole="link" style={{ textDecorationLine: 'underline' }}>
            {s.label}
          </T>
        ))}
        <T variant="caption" muted>
          As notas e introduções da edição de 1950 não foram usadas: só o texto bíblico.
        </T>
      </Card>
      <T variant="caption" muted>
        Na Missa, as leituras usam a tradução oficial da CNBB; por isso o texto pode soar diferente do que você ouve na
        igreja — o sentido é o mesmo.
      </T>
    </Screen>
  );
}
