import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

import { Card, Screen, T } from '@/components/ui';
import { getMeta } from '@/db/bible';

export default function SobreOTexto() {
  const db = useSQLiteContext();
  const stats = useMemo(() => {
    const r = db.getFirstSync<{ total: number; revisar: number; ausentes: number; revisados: number }>(`
      SELECT (SELECT COUNT(*) FROM verses) AS total,
             (SELECT COUNT(*) FROM verses WHERE flags <> '') AS revisar,
             (SELECT COUNT(*) FROM verses WHERE text = '') AS ausentes,
             (SELECT COUNT(*) FROM chapters WHERE reviewed = 1) AS revisados`);
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
      <T variant="caption" muted>
        Fonte: {stats.meta.source}.
      </T>
      <T variant="caption" muted>
        Na Missa, as leituras usam a tradução oficial da CNBB; por isso o texto pode soar diferente do que você ouve na
        igreja — o sentido é o mesmo.
      </T>
    </Screen>
  );
}
