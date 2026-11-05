/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildRosary, countAves, mysteriesForDate, SET_ORDER } from './rosary.ts';

describe('mistérios do dia', () => {
  it('segue a semana', () => {
    assert.equal(mysteriesForDate('2026-11-02'), 'gozosos'); // segunda
    assert.equal(mysteriesForDate('2026-11-03'), 'dolorosos'); // terça
    assert.equal(mysteriesForDate('2026-11-04'), 'gloriosos'); // quarta
    assert.equal(mysteriesForDate('2026-11-05'), 'luminosos'); // quinta
    assert.equal(mysteriesForDate('2026-11-06'), 'dolorosos'); // sexta
    assert.equal(mysteriesForDate('2026-11-07'), 'gozosos'); // sábado
    assert.equal(mysteriesForDate('2026-11-08'), 'gloriosos'); // domingo comum
  });

  it('domingos do Advento/Natal e da Quaresma', () => {
    assert.equal(mysteriesForDate('2026-11-29'), 'gozosos'); // 1º domingo do Advento
    assert.equal(mysteriesForDate('2027-02-14'), 'dolorosos'); // 1º domingo da Quaresma
    assert.equal(mysteriesForDate('2027-04-04'), 'gloriosos'); // domingo do Tempo Pascal
  });
});

describe('sequência', () => {
  it('terço tem 53 Ave-Marias e 5 mistérios', () => {
    const t = buildRosary(['gozosos']);
    assert.equal(countAves(t), 53);
    assert.equal(t.filter((s) => s.kind === 'misterio').length, 5);
    assert.equal(t[0].kind, 'oracao');
    assert.deepEqual(t[t.length - 2], { kind: 'oracao', prayerId: 'salve-rainha', title: 'Salve Rainha' });
  });

  it('Rosário completo tem 203 Ave-Marias e 20 mistérios', () => {
    const r = buildRosary(SET_ORDER);
    assert.equal(countAves(r), 203);
    assert.equal(r.filter((s) => s.kind === 'misterio').length, 20);
  });
});
