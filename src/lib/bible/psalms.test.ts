/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { hebrewToVulgate, psalmLabel, vulgateToHebrew } from './psalms.ts';
import { BOOKS, findBookByAbbrev } from './books.ts';

describe('numeração dos Salmos', () => {
  it('converte casos conhecidos', () => {
    assert.equal(vulgateToHebrew(22), '23'); // O Senhor é meu pastor
    assert.equal(vulgateToHebrew(50), '51'); // Miserere
    assert.equal(vulgateToHebrew(9), '9–10');
    assert.equal(vulgateToHebrew(113), '114–115');
    assert.equal(vulgateToHebrew(150), '150');
    assert.equal(hebrewToVulgate(23), 22);
    assert.equal(hebrewToVulgate(103), 102);
    assert.equal(hebrewToVulgate(116), 114);
    assert.equal(hebrewToVulgate(147), 146);
  });

  it('ida e volta é consistente', () => {
    for (let v = 1; v <= 150; v++) {
      const h = Number(vulgateToHebrew(v).split('–')[0]);
      const back = hebrewToVulgate(h);
      assert.ok(back === v || (v === 115 && back === 114) || (v === 147 && back === 146), `Sl ${v}`);
    }
  });

  it('formata o rótulo com hebraico primeiro', () => {
    assert.equal(psalmLabel(22), 'Salmo 23 (22)');
    assert.equal(psalmLabel(5), 'Salmo 5');
  });
});

describe('cânon', () => {
  it('tem 73 livros, 46 + 27, em ordem', () => {
    assert.equal(BOOKS.length, 73);
    assert.equal(BOOKS.filter((b) => b.testament === 'AT').length, 46);
    assert.equal(BOOKS.filter((b) => b.testament === 'NT').length, 27);
    BOOKS.forEach((b, i) => assert.equal(b.order, i + 1));
    assert.equal(BOOKS.filter((b) => b.deuterocanonical).length, 7);
  });

  it('distingue Jó de João pela sigla', () => {
    assert.equal(findBookByAbbrev('Jó')?.id, 'jo');
    assert.equal(findBookByAbbrev('Jo')?.id, 'joao');
    assert.equal(findBookByAbbrev('1Cor')?.id, '1-corintios');
  });
});
