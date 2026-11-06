/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { cleanVerseText, findVerseStart, makeChecker, modernizeWord, splitMergedVerses } from './clean.ts';
import { mergeReadings } from './merge.ts';

const WORDS = new Set(
  `ele deste toda sábios caminho conheceu logo que tem trazia ovelhas noventa nove comigo
   vai a buscar e é o de do da as os no em se não perdendo uma deixa Senhor preparai
   purificado serei revelaste me suas redes lançavam viu Simão maldades nossas pecados`
    .split(/\s+/)
    .filter(Boolean),
);
const valid = makeChecker({ has: (w) => WORDS.has(w) });

describe('findVerseStart / splitMergedVerses', () => {
  it('separa versículo grudado com número', () => {
    assert.deepEqual(findVerseStart('Voz do que clama. R 4 Estava João batizando', 4), [
      'Voz do que clama.',
      'Estava João batizando',
    ]);
  });

  it('entende OCR "IO" como 10 e "33.E" sem espaço', () => {
    assert.ok(findVerseStart('pereceram. IO Nem murmureis', 10));
    assert.ok(findVerseStart('e possessos: 33.E toda a cidade', 33));
  });

  it('não confunde "S. Paulo" com o versículo 5', () => {
    assert.equal(findVerseStart('diz S. Paulo aos fiéis', 5), null);
  });

  it('reconstrói a sequência e informa números perdidos', () => {
    const r = splitMergedVerses([
      { n: 1, t: 'Primeiro. 2 Segundo texto aqui' },
      { n: 3, t: 'Terceiro' },
      { n: 5, t: 'Quinto' },
    ]);
    assert.deepEqual(
      r.verses.map((v) => v.n),
      [1, 2, 3, 5],
    );
    assert.deepEqual(r.missing, [4]);
  });
});

describe('modernizeWord', () => {
  it('retira acentos diferenciais de 1943', () => {
    assert.equal(modernizeWord('êle', valid), 'ele');
    assert.equal(modernizeWord('dêste', valid), 'deste');
    assert.equal(modernizeWord('Tôda', valid), 'Toda');
  });
  it('repõe acento perdido pelo OCR', () => {
    assert.equal(modernizeWord('sabios', valid), 'sábios');
  });
  it('não mexe em palavra válida nem em nome desconhecido', () => {
    assert.equal(modernizeWord('caminho', valid), 'caminho');
    assert.equal(modernizeWord('Zebedeu', valid), 'Zebedeu');
  });
});

describe('cleanVerseText', () => {
  const freq = (w: string) => (['noventa', 'ovelhas', 'comigo', 'vaia', 'buscara'].includes(w) ? 10 : 0);
  const clean = (t: string) => cleanVerseText(t, { valid, corpusFreq: freq }).text;

  it('junta palavras partidas no fim de linha', () => {
    assert.equal(clean('tem cem ove lhas'), 'tem cem ovelhas');
    assert.equal(clean('deixa as no venta e nove'), 'deixa as noventa e nove');
    assert.equal(clean('Congratulai-vos co migo'), 'Congratulai-vos comigo');
  });

  it('não junta duas palavras comuns ("vai a" ≠ "vaia")', () => {
    assert.equal(clean('e vai a buscar a que'), 'e vai a buscar a que');
  });

  it('desfaz hifenização com ponto ("purifi-. cado")', () => {
    assert.equal(clean('e serei purifi-. cado'), 'e serei purificado');
  });

  it('separa palavras grudadas por ponto', () => {
    assert.equal(clean('E logo.que saiu'), 'E logo que saiu');
  });

  it('remove lixo no fim do versículo', () => {
    assert.equal(clean('segundo as nossas maldades. li'), 'segundo as nossas maldades.');
  });

  it("converte E' em É", () => {
    assert.equal(clean("E' benigno"), 'É benigno');
  });
});

describe('mergeReadings', () => {
  it('escolhe a forma válida numa troca curta', () => {
    const r = mergeReadings('que lançavam saás redes', 'que lançavam suas redes', valid);
    assert.equal(r.text, 'que lançavam suas redes');
  });

  it('descarta trecho longo presente só numa leitura (nota de rodapé)', () => {
    const r = mergeReadings(
      'Preparai o caminho do Senhor. Sacy diz que este lugar se entende de outra maneira',
      'Preparai o caminho do Senhor.',
      valid,
    );
    assert.equal(r.text, 'Preparai o caminho do Senhor.');
    assert.deepEqual(r.flags, ['vazamento']);
  });

  it('usa a leitura disponível quando a outra falta', () => {
    assert.deepEqual(mergeReadings('', 'texto', valid), { text: 'texto', flags: ['fonte-unica'] });
    assert.deepEqual(mergeReadings(undefined, undefined, valid), { text: '', flags: ['ausente'] });
  });
});
