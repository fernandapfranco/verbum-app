# Verbum

App católico para ler a Bíblia inteira com constância — com trilhas para quem
está começando ou voltando para a fé, plano de leitura que se ajusta sem
cobrar, e (nas próximas fases) gamificação, vida de oração e amigos.

**Fase atual: 1 — onboarding, leitor e plano de leitura.** Decisões do projeto em
[`CLAUDE.md`](CLAUDE.md); plano completo em [`docs/plano.md`](docs/plano.md).

## Testar no celular com o Expo Go

O app roda a partir do **seu computador** (Windows, Mac ou Linux) e aparece no
celular pelo Expo Go. O computador e o celular precisam estar ligados durante o
teste.

**Uma vez só (preparação):**
1. No computador, instale o **Node.js** (versão "LTS") em https://nodejs.org.
2. Instale o **Git** em https://git-scm.com (no Mac ele já costuma vir instalado).
3. No celular, instale o **Expo Go** (App Store ou Google Play) e mantenha atualizado.

**Para rodar:**
1. Abra o **Terminal** (Mac) ou o **Prompt de Comando** (Windows).
2. Copie e cole, uma linha por vez, apertando Enter:
   ```bash
   git clone https://github.com/fernandapfranco/verbum-app.git
   cd verbum-app
   git checkout claude/biblia-catolica-app-kyivax
   npm install
   npx expo start --tunnel
   ```
   (`npm install` demora alguns minutos na primeira vez. Se perguntar se pode
   instalar algo, responda `y` e Enter.)
3. Vai aparecer um **QR code** no terminal.
   - **iPhone**: abra a câmera, aponte para o QR code e toque no aviso do Expo Go.
   - **Android**: abra o Expo Go → "Scan QR code".
4. Para atualizar depois de novas mudanças: pare com `Ctrl + C`, rode
   `git pull` e de novo `npx expo start --tunnel`.

Na primeira abertura o app copia a Bíblia (≈10 MB) para o aparelho; leva alguns
segundos. Depois funciona **sem internet**. Para recomeçar do zero (ver o
onboarding de novo): Perfil → Privacidade e dados → Apagar todos os meus dados.

### Roteiro de teste sugerido
1. Aceite os termos, confirme a idade e escolha sobre o diário.
2. Responda o questionário (ou toque em "Pular"), escolha as notificações,
   dê um nome ao anjo e veja a sugestão de começo.
3. Faça uma lição: toque nas palavras sublinhadas para ver o glossário.
4. Em **Perfil → Plano de leitura**, monte um plano (ex.: Evangelhos em 3 meses).
5. Na aba **Hoje**, toque em "Começar a leitura". No leitor: toque num
   versículo para destacar/favoritar/anotar; em **Aa** mude fonte e fundo
   (claro, sépia, noturno); no fim, "Marcar como lido" — a primeira leitura do
   dia é o **check-in** (+10 talentos).
6. Toque no foguinho na aba Hoje para ver a **ofensiva** e comprar velas.
7. Veja **Bíblia** (73 livros, Salmos com dupla numeração), a **busca**, o
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
