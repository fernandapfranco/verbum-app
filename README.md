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
1. No computador, instale o **Node.js** (versão "LTS") em https://nodejs.org —
   aceite as opções padrão do instalador.
2. No celular, instale o **Expo Go** (App Store ou Google Play) e mantenha atualizado.

**Baixar o app (sem precisar de Git):**
1. Abra no computador:
   https://github.com/fernandapfranco/verbum-app/archive/refs/heads/claude/biblia-catolica-app-kyivax.zip
2. Salve o arquivo e **extraia** (Windows: clique com o botão direito → "Extrair
   tudo…"). Vai surgir uma pasta chamada `verbum-app-claude-biblia-catolica-app-kyivax`.

**Rodar:**
1. Abra a pasta extraída. **Windows:** clique na barra de endereço da janela,
   apague o que estiver escrito, digite `cmd` e aperte Enter — abre um Prompt de
   Comando já dentro da pasta. **Mac:** clique com o botão direito na pasta →
   "Novo Terminal na Pasta".
2. Digite e aperte Enter (demora alguns minutos na primeira vez):
   ```
   npm install
   ```
3. Deixe o **celular no mesmo Wi-Fi do computador** e rode:
   ```
   npx expo start
   ```
   Se o Windows perguntar sobre o **Firewall**, clique em **Permitir acesso**
   (marque também "Redes privadas").
   - Celular em outra rede (ou o app não carrega)? Use o túnel:
     `npx expo start --tunnel ngrok` — se perguntar se pode instalar
     `@expo/ngrok`, digite `y` e Enter. (Só `--tunnel`, sem `ngrok`, agora
     exige login numa conta Expo.)
4. Vai aparecer um **QR code**.
   - **iPhone**: abra a câmera, aponte para o QR code e toque no aviso do Expo Go.
   - **Android**: abra o Expo Go → "Scan QR code".
5. Para parar: `Ctrl + C`. (No PowerShell, se pedir confirmação, digite `S` ou `Y`.) Para pegar uma versão nova, baixe o ZIP de novo,
   extraia e repita os passos.

**Erro "You're signed in to Expo Go as …, but not signed in to Expo CLI"?**
O Expo Go do celular está com uma conta Expo e o computador não. Rode
`npx expo login` e entre com a **mesma conta** (ou saia da conta no Expo Go:
aba Settings → Sign out). Depois rode `npx expo start` de novo.

**Erro "'npm' não é reconhecido…"?** O Node.js não foi instalado (ou o Prompt
foi aberto antes da instalação). Instale e abra um Prompt de Comando novo.

**Prefere Git?** Instale em https://git-scm.com, abra um Prompt **novo** e use
`git clone https://github.com/fernandapfranco/verbum-app.git`, `cd verbum-app` e
`git checkout claude/biblia-catolica-app-kyivax`.

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

## Compartilhar com outras pessoas
Link no navegador (iPhone e Android), instalador Android e TestFlight: veja
[`docs/compartilhar.md`](docs/compartilhar.md).

## Especificação técnica
Veja [`docs/especificacao-tecnica.md`](docs/especificacao-tecnica.md).

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
