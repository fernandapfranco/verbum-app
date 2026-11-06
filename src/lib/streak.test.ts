/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { checkinReward, currentStreak, reconcile, weekView } from './streak.ts';

const S = (checkins: string[], prot: string[] = []) => ({ checkins: new Set(checkins), protectedDays: new Set(prot) });

describe('ofensiva', () => {
  it('conta dias seguidos até hoje', () => {
    assert.equal(currentStreak(S(['2026-11-03', '2026-11-04', '2026-11-05']), '2026-11-05'), 3);
  });

  it('se hoje ainda não teve check-in, vale a sequência até ontem', () => {
    assert.equal(currentStreak(S(['2026-11-03', '2026-11-04']), '2026-11-05'), 2);
  });

  it('dias protegidos contam', () => {
    assert.equal(currentStreak(S(['2026-11-02', '2026-11-04'], ['2026-11-03']), '2026-11-04'), 3);
  });

  it('quebra quando falta um dia sem proteção', () => {
    assert.equal(currentStreak(S(['2026-11-01', '2026-11-03']), '2026-11-05'), 0);
    assert.equal(currentStreak(S([]), '2026-11-05'), 0);
  });
});

describe('velas de proteção', () => {
  it('usa uma vela para um dia perdido', () => {
    const r = reconcile(S(['2026-11-03']), 2, '2026-11-05');
    assert.deepEqual(r, { protect: ['2026-11-04'], broken: false, missed: 1 });
  });

  it('usa duas velas para dois dias', () => {
    const r = reconcile(S(['2026-11-02']), 2, '2026-11-05');
    assert.deepEqual(r.protect, ['2026-11-03', '2026-11-04']);
  });

  it('sem velas suficientes, a ofensiva recomeça e nenhuma vela é gasta', () => {
    const r = reconcile(S(['2026-11-01']), 2, '2026-11-05');
    assert.deepEqual(r, { protect: [], broken: true, missed: 3 });
  });

  it('não faz nada se não houve lacuna ou se já foi protegido', () => {
    assert.equal(reconcile(S(['2026-11-04']), 1, '2026-11-05').protect.length, 0);
    assert.equal(reconcile(S(['2026-11-03'], ['2026-11-04']), 1, '2026-11-05').protect.length, 0);
    assert.equal(reconcile(S([]), 1, '2026-11-05').protect.length, 0);
  });
});

describe('recompensas e semana', () => {
  it('bônus a cada 7 dias', () => {
    assert.deepEqual(checkinReward(6), { base: 10, bonus: 0 });
    assert.deepEqual(checkinReward(7), { base: 10, bonus: 30 });
    assert.deepEqual(checkinReward(14), { base: 10, bonus: 30 });
  });

  it('monta a semana', () => {
    // 2026-11-05 é quinta (4)
    const w = weekView(S(['2026-11-02', '2026-11-03'], ['2026-11-04']), '2026-11-05', 4);
    assert.deepEqual(
      w.map((d) => d.state),
      ['vazio', 'checkin', 'checkin', 'protegido', 'hoje', 'futuro', 'futuro'],
    );
  });
});
