# Texto bíblico

## Tradução escolhida
**Bíblia Sagrada, tradução do Pe. Antônio Pereira de Figueiredo** (1725–1797),
feita a partir da Vulgata latina, com os 73 livros do cânon católico. O tradutor
faleceu há mais de 70 anos: a tradução está em **domínio público** no Brasil
(Lei 9.610/98, art. 41).

### Por que não CNBB, Ave-Maria, Jerusalém, Pastoral…
Todas as traduções católicas modernas em português são protegidas por direitos
autorais. Para usá-las é preciso licença da editora (Edições CNBB, Editora
Ave-Maria etc.). O app foi feito para trocar ou adicionar traduções sem
retrabalho: basta gerar outro banco com a mesma estrutura.

### Alternativa futura
A tradução do Pe. Manuel de **Matos Soares** (católica, linguagem do século XX)
deve entrar em domínio público em 1º/1/2028 (autor falecido em 1957). Confirmar
a data de falecimento antes de usar.

## De onde vem o texto
Não existe uma versão digital limpa da Figueiredo. Usamos duas digitalizações
por OCR **independentes** da mesma edição impressa de 1950, publicadas em
repositórios públicos do GitHub:

| Leitura | Repositório | Formato |
|---|---|---|
| A | `github.com/ronaldomelofz/abibliasagrada` (`web/data/livros`) | versículos numerados, com notas separadas |
| B | `github.com/gpadova/biblia-chat-server` (`corpus/`) | arrays posicionais + contagem de versículos |

Nenhum dos dois repositórios declara licença para os arquivos. O texto em si é
domínio público e a transcrição por OCR não cria obra nova; ainda assim,
**recomendamos contatar os autores** para agradecer e pedir autorização
expressa antes da publicação nas lojas, e citá-los nos créditos do app.

### O que descartamos de propósito
Notas de rodapé, introduções e títulos de capítulo da edição de 1950 são de
autores modernos (ex.: Liga de Estudos Bíblicos) e **não entram no app**.

## Pipeline (`scripts/bible/`)
1. **Separar versículos grudados** (`clean.ts › splitMergedVerses`): o OCR às
   vezes junta "…caminho. R 4 Estava João…"; reconhecemos o número (inclusive
   erros como "IO" = 10).
2. **Limpar cada leitura** (`cleanVerseText`): juntar palavras partidas
   ("cami nho"), separar palavras grudadas ("logo.que"), tirar ruído, e
   **atualizar a ortografia** de 1943 para a atual ("êle" → "ele",
   "Judéia" → "Judeia") e repor acentos perdidos — só quando o dicionário
   pt-BR confirma uma única forma correta.
3. **Ancorar versículos sem número**: se uma leitura tem o versículo 6 vazio e
   a outra não, usamos o começo do versículo 6 da outra para achá-lo dentro do 5.
4. **Combinar as duas leituras** (`merge.ts`): o que as duas concordam fica;
   diferenças curtas são decididas pelo dicionário/frequência; trechos longos
   que só uma leitura tem (notas de rodapé vazadas) são descartados.
5. **Marcar suspeitas** para revisão humana (ver `docs/qualidade-do-texto.md`).
6. **Correções manuais** de `content/bible/correcoes.json` têm a palavra final.

Rodar:
```bash
git clone --depth 1 https://github.com/ronaldomelofz/abibliasagrada ../abibliasagrada
git clone --depth 1 https://github.com/gpadova/biblia-chat-server ../biblia-chat-server
npm run bible:build -- ../abibliasagrada/web/data/livros ../biblia-chat-server/corpus
```
Depois, aumente `bibleDbName` em `src/config.ts`.

## Qualidade e revisão
- Estado atual em `docs/qualidade-do-texto.md` (gerado).
- Lista completa de versículos para revisar: `content/bible/revisao/suspeitos.csv`.
- Revisados à mão (contra as duas leituras): Marcos 1, Lucas 15, Lucas 19,
  Salmos 22(23), 50(51) e 102(103), além de versículos usados nas trilhas.
- No app, capítulos com problemas visíveis mostram um aviso discreto; versículos
  que nenhuma leitura recuperou aparecem como […].

### Como corrigir um versículo
1. Confira na digitalização (as duas leituras + PDF da edição, se disponível).
2. Acrescente em `content/bible/correcoes.json` → `versiculos`:
   `"marcos 1:35": "texto corrigido"`. Só corrija OCR; nunca "melhore" a tradução.
3. Se reconstruiu uma palavra que nenhuma leitura trazia, registre em `conferir`.
4. Quando um capítulo inteiro estiver conferido, inclua-o em `revisados`.
5. Rode `npm run bible:build -- …` e aumente `bibleDbName`.

**Próximo passo recomendado:** obter os PDFs da edição (ou uma edição do século
XIX, como a de 1864) e revisar começando pelos Evangelhos, Salmos e textos da
liturgia dominical. Voluntários podem trabalhar direto na planilha de suspeitos.
