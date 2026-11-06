import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { SacredIcon, type SacredIconName } from '@/components/SacredIcon';
import { Card, ReviewTag, Screen, T } from '@/components/ui';
import { SEASONS_INFO, YEAR_INTRO, type SeasonPart } from '@/content/liturgicalSeasons';
import { formatDate, parseISODate, today } from '@/lib/dates';
import { COLOR_HEX, liturgicalDay, liturgicalYear, type Season } from '@/lib/liturgy';
import { SPACE, useTheme } from '@/theme';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const short = (iso: string) => {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const SEASON_ICON: Record<SeasonPart, SacredIconName> = {
  advento: 'coroa-advento',
  natal: 'estrela',
  'comum-1': 'trigo',
  quaresma: 'cruz',
  triduo: 'calvario',
  pascoa: 'cirio',
  'comum-2': 'trigo',
};

function currentPart(season: Season, date: string, comum1End: string): SeasonPart {
  if (season === 'comum') return date <= comum1End ? 'comum-1' : 'comum-2';
  return season;
}

export default function TemposLiturgicos() {
  const { c } = useTheme();
  const date = today();
  const year = liturgicalYear(date);
  const period = Object.fromEntries(year.periods.map((p) => [p.id, p]));
  const now = currentPart(liturgicalDay(date).season, date, period['comum-1'].end);
  const [open, setOpen] = useState<SeasonPart | null>(now);

  return (
    <Screen>
      <T variant="title" style={{ marginTop: SPACE.sm }}>
        Tempos litúrgicos
      </T>
      <T muted>{YEAR_INTRO}</T>
      <T variant="label" color={c.goldText}>
        Ano litúrgico {year.label}
      </T>

      {SEASONS_INFO.map((s) => {
        const p = period[s.id];
        const isNow = s.id === now;
        const expanded = open === s.id;
        return (
          <Card key={s.id} style={isNow ? { borderWidth: 2, borderColor: c.primary } : undefined}>
            <Pressable
              onPress={() => setOpen(expanded ? null : s.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              accessibilityLabel={`${s.nome}${isNow ? ', tempo atual' : ''}, de ${formatDate(p.start)} a ${formatDate(p.end)}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.md, minHeight: 44 }}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: COLOR_HEX[s.cor] + '2E', alignItems: 'center', justifyContent: 'center' }}>
                <SacredIcon name={SEASON_ICON[s.id]} size={28} color={c.text} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.sm, flexWrap: 'wrap' }}>
                  <T variant="heading">{s.nome}</T>
                  {isNow && (
                    <T variant="caption" color={c.primary} style={{ fontWeight: '700' }}>
                      AGORA
                    </T>
                  )}
                </View>
                <T variant="caption" muted>
                  {short(p.start)} → {short(p.end)}
                </T>
              </View>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={c.textMuted} />
            </Pressable>

            {expanded && (
              <View style={{ gap: SPACE.sm }}>
                <T>{s.sentido}</T>
                <Info label="Começa" text={s.comeca} />
                <Info label="Termina" text={s.termina} />
                <Info label="Cor" text={`${s.cor}${s.outrasCores ? `; ${s.outrasCores}` : ''}`} />

                <T variant="label" color={c.goldText} style={{ marginTop: SPACE.sm }}>
                  O que se vive
                </T>
                {s.vive.map((v) => (
                  <View key={v.titulo} style={{ backgroundColor: c.surfaceAlt, borderRadius: 16, padding: SPACE.md, gap: 4 }}>
                    <T variant="bodyStrong">{v.titulo}</T>
                    <T>{v.texto}</T>
                  </View>
                ))}

                <T variant="label" color={c.goldText} style={{ marginTop: SPACE.sm }}>
                  Dias marcantes
                </T>
                {s.destaques.map((d) => (
                  <T key={d}>• {d}</T>
                ))}

                <T variant="label" color={c.goldText} style={{ marginTop: SPACE.sm }}>
                  Para viver na prática
                </T>
                {s.praticas.map((d) => (
                  <T key={d}>• {d}</T>
                ))}
                <ReviewTag status={s.status} />
              </View>
            )}
          </Card>
        );
      })}

      <T variant="caption" muted style={{ textAlign: 'center' }}>
        O próximo ano litúrgico começa em {formatDate(year.nextAdvent)}, com o 1º Domingo do Advento.
      </T>
    </Screen>
  );
}

function Info({ label, text }: { label: string; text: string }) {
  return (
    <T>
      <T variant="bodyStrong">{label}: </T>
      {text}
    </T>
  );
}
