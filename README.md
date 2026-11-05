# Verbum

App católico para ler a Bíblia inteira com constância — com trilhas para quem
está começando ou voltando para a fé, plano de leitura que se ajusta sem
cobrar, e (nas próximas fases) gamificação, vida de oração e amigos.

**Fase atual: 1 — onboarding, leitor e plano de leitura.** Decisões do projeto em
[`CLAUDE.md`](CLAUDE.md); plano completo em [`docs/plano.md`](docs/plano.md).

## Testar no celular com o Expo Go

1. Instale o **Expo Go** no celular (App Store ou Google Play). Ele precisa
   suportar o **SDK 58** — se a loja oferecer atualização, atualize.
2. No computador, com o [Node.js](https://nodejs.org) 20 ou mais recente:
   ```bash
   git clone https://github.com/fernandapfranco/verbum-app.git
   cd verbum-app
   git checkout claude/biblia-catolica-app-kyivax
   npm install
   npx expo start
   ```
3. Aparece um **QR code** no terminal.
   - **Android**: abra o Expo Go e toque em "Scan QR code".
   - **iPhone**: abra a câmera e aponte para o QR code.
4. Se o celular e o computador não estiverem na mesma rede Wi-Fi (ou se não
   conectar), use `npx expo start --tunnel`.

Na primeira abertura o app copia a Bíblia (≈10 MB) para o aparelho; leva alguns
segundos. Depois funciona **sem internet**.

### Roteiro de teste sugerido
1. Aceite os termos, confirme a idade e escolha sobre o diário.
2. Responda as 3 perguntas e dê um nome ao anjo. Se disser que está
   "voltando", a trilha sugerida é **Voltando para Casa**.
3. Faça uma lição: toque nas palavras sublinhadas para ver o glossário.
4. Em **Perfil → Plano de leitura**, monte um plano (ex.: Evangelhos em 3 meses).
5. Na aba **Hoje**, toque em "Começar a leitura". No leitor: toque num
   versículo para destacar/favoritar/anotar; em **Aa** mude fonte e fundo
   (claro, sépia, noturno); no fim, "Marcar como lido".
6. Veja **Bíblia** (73 livros, Salmos com dupla numeração), a **busca**, o
   **Diário** e **Perfil → Privacidade e dados** (exportar / apagar).

## Desenvolvimento
```bash
npm test            # testes da lógica (plano, Salmos, limpeza do texto)
npm run typecheck   # TypeScript
```
- Texto bíblico e como regerá-lo: [`docs/texto-biblico.md`](docs/texto-biblico.md)
- Qualidade do texto: [`docs/qualidade-do-texto.md`](docs/qualidade-do-texto.md)
- Revisão doutrinal: [`docs/revisao-doutrinal.md`](docs/revisao-doutrinal.md)

## Créditos
Texto bíblico: tradução do Pe. Antônio Pereira de Figueiredo (domínio público),
recuperado das digitalizações publicadas em
[ronaldomelofz/abibliasagrada](https://github.com/ronaldomelofz/abibliasagrada) e
[gpadova/biblia-chat-server](https://github.com/gpadova/biblia-chat-server).
Fontes Literata e Inter (SIL Open Font License).
