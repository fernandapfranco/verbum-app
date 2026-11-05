/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  chapterKey,
  extendedEndDate,
  nthReadingDay,
  planForDay,
  previewPlan,
  readingDaysBetween,
  takeForTarget,
  unitsForScope,
  type ChapterUnit,
  type PlanConfig,
} from './engine.ts';
import { BOOKS } from '../bible/books.ts';

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

/** Bíblia sintética: cada capítulo leva 4 minutos. */
const ALL: ChapterUnit[] = BOOKS.flatMap((b) =>
  Array.from({ length: b.chapters }, (_, i) => ({ bookId: b.id, chapter: i + 1, minutes: 4 })),
);
const MARCOS = ALL.filter((u) => u.bookId === 'marcos'); // 16 capítulos

const keys = (us: ChapterUnit[]) => new Set(us.map(chapterKey));

describe('datas de leitura', () => {
  it('conta dias de leitura por dia da semana', () => {
    // 2026-11-02 é segunda-feira
    assert.equal(readingDaysBetween(ALL_DAYS, '2026-11-02', '2026-11-08'), 7);
    assert.equal(readingDaysBetween([1, 3, 5], '2026-11-02', '2026-11-15'), 6);
    assert.equal(readingDaysBetween([0], '2026-11-02', '2026-11-07'), 0);
  });

  it('acha o n-ésimo dia de leitura', () => {
    assert.equal(nthReadingDay([1, 3, 5], '2026-11-02', 1), '2026-11-02');
    assert.equal(nthReadingDay([1, 3, 5], '2026-11-02', 4), '2026-11-09');
  });
});

describe('escopos', () => {
  it('tem os tamanhos certos', () => {
    assert.equal(unitsForScope({ kind: 'biblia' }, ALL).length, ALL.length);
    assert.equal(unitsForScope({ kind: 'evangelhos' }, ALL).length, 28 + 16 + 24 + 21);
    assert.equal(unitsForScope({ kind: 'livro', bookId: 'marcos' }, ALL).length, 16);
  });

  it('intercala Salmos e Provérbios', () => {
    const u = unitsForScope({ kind: 'salmos-proverbios' }, ALL);
    assert.equal(u.length, 150 + 31);
    assert.equal(u[0].bookId, 'salmos');
    assert.ok(u.slice(0, 10).some((x) => x.bookId === 'proverbios'));
    assert.equal(u.filter((x) => x.bookId === 'proverbios')[30].chapter, 31);
  });

  it('segue a ordem canônica', () => {
    const nt = unitsForScope({ kind: 'nt' }, ALL);
    assert.equal(nt[0].bookId, 'mateus');
    assert.equal(nt[nt.length - 1].bookId, 'apocalipse');
  });
});

describe('takeForTarget', () => {
  it('pega pelo menos um capítulo e se aproxima do alvo', () => {
    const us = [5, 5, 5, 5].map((m, i) => ({ bookId: 'x', chapter: i + 1, minutes: m }));
    assert.equal(takeForTarget(us, 1).length, 1);
    assert.equal(takeForTarget(us, 10).length, 2);
    assert.equal(takeForTarget(us, 12).length, 2);
    assert.equal(takeForTarget(us, 13).length, 3);
  });
});

describe('planForDay', () => {
  const marcosEm16Dias: PlanConfig = {
    id: 'p',
    scope: { kind: 'livro', bookId: 'marcos' },
    mode: 'prazo',
    startDate: '2026-11-01',
    endDate: '2026-11-16',
    weekdays: ALL_DAYS,
  };

  it('no primeiro dia sugere um capítulo por dia', () => {
    const p = planForDay(marcosEm16Dias, MARCOS, new Set(), new Set(), '2026-11-01');
    assert.equal(p.status, 'em-dia');
    assert.deepEqual(p.chapters.map((c) => c.chapter), [1]);
    assert.equal(p.projectedEnd, '2026-11-16');
  });

  it('atrasou? redistribui sem marcar "atraso"', () => {
    // Dia 9 e só leu 4 capítulos: faltam 12 capítulos em 8 dias.
    const read = keys(MARCOS.slice(0, 4));
    const p = planForDay(marcosEm16Dias, MARCOS, read, new Set(), '2026-11-09');
    assert.equal(p.status, 'ajustado');
    assert.ok(p.chapters.length >= 1 && p.chapters.length <= 2);
    assert.ok(Math.abs(p.pace - 6) < 0.01);
  });

  it('a leitura de hoje não muda depois de ler', () => {
    const before = planForDay(marcosEm16Dias, MARCOS, new Set(), new Set(), '2026-11-01');
    const after = planForDay(marcosEm16Dias, MARCOS, new Set(), keys(before.chapters), '2026-11-01');
    assert.deepEqual(after.chapters, before.chapters);
    assert.equal(after.doneToday, before.chapters.length);
  });

  it('passou do prazo: segue no ritmo original e projeta nova data', () => {
    const read = keys(MARCOS.slice(0, 10));
    const p = planForDay(marcosEm16Dias, MARCOS, read, new Set(), '2026-11-20');
    assert.equal(p.pastDeadline, true);
    assert.equal(p.status, 'ajustado');
    assert.equal(p.chapters.length, 1);
    assert.equal(p.projectedEnd, '2026-11-25'); // 6 capítulos restantes, 1 por dia
  });

  it('respeita os dias livres', () => {
    const cfg: PlanConfig = { ...marcosEm16Dias, weekdays: [1, 2, 3, 4, 5] };
    const sabado = planForDay(cfg, MARCOS, new Set(), new Set(), '2026-11-07');
    assert.equal(sabado.status, 'dia-livre');
    assert.equal(sabado.chapters.length, 0);
  });

  it('conclui', () => {
    const p = planForDay(marcosEm16Dias, MARCOS, keys(MARCOS), new Set(), '2026-11-10');
    assert.equal(p.status, 'concluido');
    assert.equal(p.readChapters, 16);
  });

  it('modo ritmo: minutos por dia definem a data final', () => {
    const cfg: PlanConfig = {
      id: 'r',
      scope: { kind: 'livro', bookId: 'marcos' },
      mode: 'ritmo',
      minutesPerDay: 8,
      startDate: '2026-11-01',
      weekdays: ALL_DAYS,
    };
    const p = planForDay(cfg, MARCOS, new Set(), new Set(), '2026-11-01');
    assert.equal(p.chapters.length, 2);
    assert.equal(p.projectedEnd, '2026-11-08');
  });
});

describe('extendedEndDate / previewPlan', () => {
  it('estende mantendo o ritmo original', () => {
    const cfg: PlanConfig = {
      id: 'p',
      scope: { kind: 'livro', bookId: 'marcos' },
      mode: 'prazo',
      startDate: '2026-11-01',
      endDate: '2026-11-16',
      weekdays: ALL_DAYS,
    };
    const end = extendedEndDate(cfg, MARCOS, keys(MARCOS.slice(0, 4)), '2026-11-09');
    assert.equal(end, '2026-11-20'); // 12 capítulos, 1 por dia a partir do dia 9
  });

  it('prévia de um ano de Bíblia', () => {
    const p = previewPlan(
      { scope: { kind: 'biblia' }, mode: 'prazo', startDate: '2027-01-01', endDate: '2027-12-31', weekdays: ALL_DAYS },
      ALL,
    );
    assert.equal(p.readingDays, 365);
    assert.equal(p.totalChapters, ALL.length);
    assert.ok(Math.abs(p.dailyMinutes - (ALL.length * 4) / 365) < 0.001);
  });
});
