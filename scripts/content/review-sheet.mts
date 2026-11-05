/// <reference types="node" />
/**
 * Gera a planilha de revisão doutrinal com todo o conteúdo explicativo do app.
 *
 *   npm run content:review-sheet
 *
 * Saída: content/revisao-doutrinal/planilha.csv (abre no Excel/Google Planilhas).
 * O revisor preenche as colunas "parecer" (aprovado / ajustar / reprovar) e
 * "comentario". Depois, os status são atualizados nos arquivos de src/content/.
 */
import fs from 'node:fs';
import path from 'node:path';

import { BOOK_INTROS } from '../../src/content/bookIntros.ts';
import { CHAPTER_NOTES } from '../../src/content/chapterNotes.ts';
import { GLOSSARY } from '../../src/content/glossary.ts';
import { PRAYERS } from '../../src/content/prayers.ts';
import { SERIES, TRAILS } from '../../src/content/trails.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const cell = (s: unknown) => `"${String(s ?? '').replace(/"/g, '""')}"`;

const rows: string[][] = [];
const add = (tipo: string, id: string, arquivo: string, texto: string, fontes: string[] | undefined, status: string) =>
  rows.push([tipo, id, arquivo, texto, (fontes ?? []).join('; '), status, '', '']);

for (const i of BOOK_INTROS)
  add('Introdução de livro', i.bookId, 'src/content/bookIntros.ts', `QUEM: ${i.quem}\nCONTEXTO: ${i.contexto}\nO QUE ESPERAR: ${i.esperar}`, i.fontes, i.status);
for (const n of CHAPTER_NOTES)
  add('Nota de capítulo', `${n.bookId} ${n.chapter}`, 'src/content/chapterNotes.ts', n.texto, n.fontes, n.status);
for (const g of GLOSSARY)
  add(g.antiga ? 'Glossário (palavra antiga)' : 'Glossário', g.id, 'src/content/glossary.ts', `${g.termo}: ${g.definicao}`, g.fontes, g.status);
for (const p of PRAYERS)
  add('Oração', p.id, 'src/content/prayers.ts', `${p.titulo}\n${p.texto}\n\nSOBRE: ${p.sobre}`, p.fontes, p.status);
for (const t of [...TRAILS, ...SERIES])
  for (const l of t.licoes) {
    const corpo = l.passos
      .map((s) =>
        s.kind === 'texto'
          ? `${s.titulo ? s.titulo.toUpperCase() + ': ' : ''}${s.corpo}`
          : s.kind === 'leitura'
            ? `[LEITURA ${s.ref.bookId} ${s.ref.chapter},${s.ref.from ?? ''}-${s.ref.to ?? ''}] ${s.antes ?? ''}`
            : s.kind === 'oracao'
              ? `[ORAÇÃO ${s.prayerId}]`
              : `[REFLEXÃO] ${s.pergunta}`,
      )
      .join('\n\n');
    add(`Trilha ${t.titulo}`, l.id, 'src/content/trails.ts', `${l.titulo}\n\n${corpo}`, l.fontes, l.status);
  }

const header = ['tipo', 'id', 'arquivo', 'texto', 'fontes', 'status_atual', 'parecer', 'comentario'];
const out = path.join(ROOT, 'content/revisao-doutrinal/planilha.csv');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, '﻿' + [header, ...rows].map((r) => r.map(cell).join(',')).join('\n') + '\n');
const pend = rows.filter((r) => r[5] !== 'aprovado').length;
console.log(`Planilha gerada: ${out} (${rows.length} itens, ${pend} aguardando revisão)`);
