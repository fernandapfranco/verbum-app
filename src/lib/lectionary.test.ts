/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { gospelOfDay, sundayCycle } from './lectionary.ts';
import { parseRef } from './bible/refs.ts';
import { GOSPELS } from '../content/lectionary.ts';

const g = (d: string) => gospelOfDay(d);

describe('referências', () => {
  it('lê trechos simples, compostos e entre capítulos', () => {
    assert.deepEqual(parseRef('Mc 1,14-20'), { bookId: 'marcos', spans: [{ chapter: 1, from: 14, to: 20 }] });
    assert.deepEqual(parseRef('Jo 13,31-33a.34-35').spans, [
      { chapter: 13, from: 31, to: 33 },
      { chapter: 13, from: 34, to: 35 },
    ]);
    assert.deepEqual(parseRef('Mt 9,35–10,1.5a.6-8').spans, [
      { chapter: 9, from: 35, to: null },
      { chapter: 10, from: 1, to: 1 },
      { chapter: 10, from: 5, to: 5 },
      { chapter: 10, from: 6, to: 8 },
    ]);
    assert.equal(parseRef('Jo 18,1–19,42').spans.length, 2);
    assert.equal(parseRef('Mt 26,14–27,66').bookId, 'mateus');
  });

  it('todas as referências da tabela são legíveis', () => {
    for (const [k, r] of Object.entries(GOSPELS)) assert.doesNotThrow(() => parseRef(r), `${k}: ${r}`);
  });
});

describe('ciclo dominical', () => {
  it('A/B/C pelo ano litúrgico', () => {
    assert.equal(sundayCycle('2026-11-06'), 'A'); // ano litúrgico 2025-2026
    assert.equal(sundayCycle('2026-11-29'), 'B'); // Advento 2026 abre o ano B
    assert.equal(sundayCycle('2027-12-05'), 'C');
  });
});

describe('Evangelho do dia', () => {
  it('dias de semana do Tempo Comum', () => {
    const d = g('2026-11-06')!; // sexta-feira, 31ª semana
    assert.equal(d.key, 'sem:comum-31-sex');
    assert.equal(d.title, 'Sexta-feira da 31ª Semana do Tempo Comum');
    assert.equal(d.ref, 'Lc 16,1-8');
  });

  it('Todos os Santos e Cristo Rei (Brasil)', () => {
    assert.equal(g('2026-11-01')!.key, 'fixo:11-01'); // 1º/11/2026 é domingo
    assert.equal(g('2026-11-02')!.key, 'fixo:11-02');
    assert.equal(g('2026-11-22')!.key, 'festa:cristo-rei:A');
    assert.equal(g('2026-11-22')!.ref, 'Mt 25,31-46');
  });

  it('Advento e Natal', () => {
    assert.equal(g('2026-11-29')!.ref, 'Mc 13,33-37'); // 1º Domingo do Advento, ano B
    assert.equal(g('2026-12-08')!.key, 'fixo:12-08');
    assert.equal(g('2026-12-17')!.ref, 'Mt 1,1-17');
    assert.equal(g('2027-11-29')!.key, 'sem:advento-1-seg'); // novembro, não confundir com 17-24/12
    assert.equal(g('2026-12-25')!.ref, 'Jo 1,1-18');
    assert.equal(g('2026-12-26')!.key, 'fixo:12-26');
    assert.equal(g('2026-12-27')!.key, 'festa:sagrada-familia:B'); // domingo na oitava
  });

  it('Epifania, Batismo, Quaresma e Páscoa', () => {
    assert.equal(g('2027-01-03')!.key, 'festa:epifania');
    assert.equal(g('2027-01-10')!.key, 'festa:batismo:B');
    assert.equal(g('2027-02-10')!.key, 'festa:cinzas');
    assert.equal(g('2027-02-14')!.ref, 'Mc 1,12-15'); // 1º Domingo da Quaresma B
    assert.equal(g('2027-03-27'), null); // Sábado Santo
    assert.equal(g('2027-03-28')!.key, 'festa:pascoa');
    assert.equal(g('2027-05-09')!.key, 'festa:ascensao:B'); // Brasil: 7º domingo
    assert.equal(g('2027-05-16')!.key, 'festa:pentecostes');
    assert.equal(g('2027-05-27')!.key, 'festa:corpus-christi:B');
  });

  it('Aparecida e transferências', () => {
    assert.equal(g('2026-10-12')!.title, 'Nossa Senhora da Conceição Aparecida');
    assert.equal(g('2027-08-15')!.key, 'fixo:08-15'); // domingo
    assert.equal(g('2026-08-16')!.key, 'fixo:08-15'); // 15/8/2026 é sábado → domingo 16
  });
});
