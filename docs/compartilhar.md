# Como compartilhar o Verbum para outras pessoas testarem

| Caminho | iPhone | Android | Custo | Esforço |
|---|---|---|---|---|
| **1. Link no navegador** (versão web) | ✅ | ✅ | grátis | baixo |
| **2. Instalador Android (APK)** | — | ✅ | grátis | médio |
| **3. TestFlight (app de verdade no iPhone)** | ✅ | — | Apple Developer: US$ 99/ano | médio |

## 1. Link no navegador (mais rápido, serve para todos)
O app roda no navegador do celular. Limitações: sem notificações, busca mais
lenta e os dados ficam no navegador (não no app). Bom para mostrar o visual,
o questionário, as trilhas e o leitor.

1. Gere a versão web: `npm run web:build` (cria a pasta `dist/`, já com os
   cabeçalhos necessários em `dist/_headers`).
2. Entre em https://app.netlify.com/drop (crie uma conta grátis se pedir).
3. Arraste a pasta `dist` para a página. Em segundos aparece um link
   (ex.: `https://nome-aleatorio.netlify.app`) — é só mandar para as pessoas.
4. Para atualizar: gere de novo e, no site da Netlify, abra o projeto →
   **Deploys** → arraste a pasta nova.

### Alternativa: Vercel (atualiza sozinho a cada push)
O `vercel.json` na raiz já traz o comando de build, a pasta `dist`, o
redirecionamento das rotas e os cabeçalhos COOP/COEP.
1. Em https://vercel.com → **Add New… › Project** → importe o repositório
   `verbum-app` do GitHub. Não mude nada em Build & Output Settings.
2. **Importante:** o app está no ramo `claude/biblia-catolica-app-kyivax`, e o
   `main` só tem o README. Em **Settings › Git › Production Branch**, escreva
   `claude/biblia-catolica-app-kyivax` e salve (ou junte o ramo ao `main`).
3. Em **Deployments**, clique nos três pontinhos do último → **Redeploy**.
   O link fica em **Domains** (ex.: `verbum-app.vercel.app`).

Dica para quem recebe: no iPhone, abra no **Safari** → Compartilhar →
"Adicionar à Tela de Início" para ficar com cara de app.

## 2. Android: instalador APK (app de verdade)
1. Na pasta do projeto, com o login do Expo ativo (`npx expo whoami`), rode:
   `npm run android:apk`
   - Na primeira vez ele pergunta se pode criar o projeto no Expo (`y`) e se
     pode gerar a chave do Android (`y`).
2. O build roda na nuvem do Expo (grátis, ~15–20 min). No fim aparece um link
   e um QR code.
3. Mande o link: a pessoa abre no Android, baixa e instala (o celular pede
   para "permitir instalar apps desta fonte").

## 3. iPhone: TestFlight
A Apple não permite instalar apps fora da App Store sem uma conta de
desenvolvedor (Apple Developer Program, US$ 99/ano, em developer.apple.com).
Com a conta:
1. `npx eas-cli@latest build --platform ios --profile production`
2. `npx eas-cli@latest submit --platform ios`
3. No App Store Connect → TestFlight, crie um **link público de teste** e
   mande para as pessoas (elas instalam o app TestFlight e entram pelo link).

## Por que não pelo Expo Go?
O Expo Go só abre o projeto enquanto o seu computador está ligado rodando
`npx expo start`, e as versões novas exigem que cada pessoa esteja logada na
conta do projeto. Serve para você testar, não para distribuir.
