/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  adventStart,
  baptismOfTheLord,
  easter,
  epiphany,
  isReginaCaeliTime,
  liturgicalDay,
  liturgicalYear,
  nextSeasonStart,
  yearDates,
} from './liturgy.ts';

describe('datas móveis', () => {
  it('calcula a Páscoa', () => {
    assert.equal(easter(2024), '2024-03-31');
    assert.equal(easter(2025), '2025-04-20');
    assert.equal(easter(2026), '2026-04-05');
    assert.equal(easter(2027), '2027-03-28');
    assert.equal(easter(2038), '2038-04-25');
  });

  it('calcula o 1º Domingo do Advento', () => {
    assert.equal(adventStart(2025), '2025-11-30');
    assert.equal(adventStart(2026), '2026-11-29');
    assert.equal(adventStart(2027), '2027-11-28');
    assert.equal(adventStart(2028), '2028-12-03');
  });

  it('Epifania e Batismo do Senhor (regra do Brasil)', () => {
    assert.equal(epiphany(2026), '2026-01-04');
    assert.equal(baptismOfTheLord(2026), '2026-01-11');
    assert.equal(epiphany(2023), '2023-01-08');
    assert.equal(baptismOfTheLord(2023), '2023-01-09'); // segunda-feira
  });

  it('Cinzas e Pentecostes', () => {
    const y = yearDates(2027);
    assert.equal(y.ashWednesday, '2027-02-10');
    assert.equal(y.pentecost, '2027-05-16');
  });
});

describe('tempo litúrgico do dia', () => {
  it('reconhece os tempos', () => {
    assert.equal(liturgicalDay('2026-11-05').season, 'comum');
    assert.equal(liturgicalDay('2026-11-29').season, 'advento');
    assert.equal(liturgicalDay('2026-12-25').season, 'natal');
    assert.equal(liturgicalDay('2027-01-05').season, 'natal');
    assert.equal(liturgicalDay('2027-02-10').season, 'quaresma');
    assert.equal(liturgicalDay('2027-03-26').season, 'triduo');
    assert.equal(liturgicalDay('2027-04-10').season, 'pascoa');
  });

  it('cores e dias especiais', () => {
    assert.deepEqual(liturgicalDay('2026-12-13'), { season: 'advento', color: 'rosa', special: '3º Domingo do Advento (Gaudete)' });
    assert.equal(liturgicalDay('2027-03-26').color, 'vermelho'); // Sexta-feira Santa
    assert.equal(liturgicalDay('2027-05-16').color, 'vermelho'); // Pentecostes
    assert.equal(liturgicalDay('2026-11-05').color, 'verde');
  });

  it('Regina Caeli da Páscoa a Pentecostes', () => {
    assert.equal(isReginaCaeliTime('2027-03-27'), false);
    assert.equal(isReginaCaeliTime('2027-03-28'), true);
    assert.equal(isReginaCaeliTime('2027-05-16'), true);
    assert.equal(isReginaCaeliTime('2027-05-17'), false);
  });

  it('próximo tempo forte', () => {
    assert.deepEqual(nextSeasonStart('2026-11-05'), { season: 'advento', start: '2026-11-29', inDays: 24 });
    assert.equal(nextSeasonStart('2026-12-01').season, 'quaresma');
  });
});

describe('ano litúrgico', () => {
  it('2025–2026: tempos em sequência, do Advento ao sábado antes do Advento seguinte', () => {
    const y = liturgicalYear('2026-11-06');
    assert.equal(y.label, '2025–2026');
    assert.equal(y.nextAdvent, '2026-11-29');
    const by = Object.fromEntries(y.periods.map((p) => [p.id, p]));
    assert.equal(by.advento.start, '2025-11-30');
    assert.equal(by.natal.end, '2026-01-11');
    assert.equal(by['comum-1'].end, '2026-02-17');
    assert.equal(by.quaresma.start, '2026-02-18');
    assert.equal(by.pascoa.start, '2026-04-05');
    assert.equal(by.pascoa.end, '2026-05-24');
    assert.equal(by['comum-2'].end, '2026-11-28');
  });
  it('a partir do 1º Domingo do Advento, já é o ano seguinte', () => {
    assert.equal(liturgicalYear('2026-11-29').label, '2026–2027');
  });
});
