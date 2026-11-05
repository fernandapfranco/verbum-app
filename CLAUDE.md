# Verbum — contexto e decisões do projeto

App mobile (iOS/Android) para católicos lerem a Bíblia inteira com constância,
com gamificação no estilo Duolingo e vida de oração. Público principal: jovens
adultos (18–35) que estão começando ou voltando para a fé. Tudo em **português
do Brasil**. Leia também `AGENTS.md` (regras do Expo) e `docs/plano.md`.

## Fases
1. **Onboarding, leitor e plano de leitura** ← concluída (ver "Estado atual")
2. Anjo animado, gamificação (streak, XP, níveis, talentos, conquistas, baú, quiz, mapa), notificações locais
3. Orações e liturgia (calendário litúrgico por algoritmo, Evangelho e santo do dia, terço, Angelus/Regina Caeli)
4. Social (Supabase: amigos, incentivos, pedidos de oração, ligas, grupos, push remoto)

Ao fim de cada fase: mostrar o que foi feito e como testar no Expo Go.

## Decisões tomadas (não reabrir sem a dona do projeto)
- **Stack**: Expo SDK 58 + TypeScript + Expo Router (rotas em `src/app/`). Tudo da Fase 1–3 roda no **Expo Go** — não adicionar módulo nativo fora do Expo Go sem combinar (push remoto da Fase 4 vai exigir development build).
- **Local-first**: nada sai do aparelho até a Fase 4. Sem conta, sem servidor, sem analytics.
- **Backend (Fase 4)**: Supabase, região São Paulo (sa-east-1), RLS em todas as tabelas.
- **Texto bíblico**: tradução do **Pe. Antônio Pereira de Figueiredo** (domínio público), ortografia atualizada automaticamente. A arquitetura permite trocar/adicionar tradução (ex.: Matos Soares, que deve entrar em domínio público em 1º/1/2028 — confirmar antes; ou CNBB/Ave-Maria se licenciadas). Ver `docs/texto-biblico.md`.
- **Notas, introduções e títulos da edição de 1950 NÃO entram no app** (autores modernos, protegidos). Só o texto bíblico.
- **Liturgia diária**: calcular referências por algoritmo; exibir o texto da nossa tradução, com aviso de que a Missa usa a tradução da CNBB.
- **Numeração dos Salmos**: o banco usa a da Vulgata (da tradução). Exibir "Salmo 23 (22)" — hebraica primeiro, Vulgata entre parênteses (`src/lib/bible/psalms.ts`).
- **Nomes dos livros**: modernos (1 Samuel, Crônicas…); nome antigo em `oldName`.
- **Idade mínima: 16 anos.** Confirmada na primeira abertura.
- **Primeiro acesso**: Termos + Política (aceite) → idade → consentimento **separado e desmarcado por padrão** para diário/notas (LGPD art. 11, dado sensível). Versão dos termos em `LEGAL_VERSION` (`src/content/legal.ts`); mudou → app pede novo aceite. Consentimentos ficam registrados em `consent_log`.
- **Revisão doutrinal**: não há revisor ainda. Todo conteúdo explicativo tem `status` (`rascunho` | `em-revisao` | `aprovado`) e `fontes`; o app mostra etiqueta "em revisão" até aprovar. Processo em `docs/revisao-doutrinal.md`.
- **Tom**: acolhedor, sem "igrejês", sem culpa. O anjo nunca cobra; volta após sumiço = "Que bom te ver de novo!". Jesus não é personagem animado. Usar linguagem neutra de gênero quando possível ("Boas-vindas", não "Bem-vindo").
- **Plano de leitura**: nunca guarda "dívida". A leitura de hoje é recalculada a partir do que falta e do tempo que resta (`src/lib/plan/engine.ts`). Peso = minutos (palavras ÷ 170/min), não capítulos.
- **Visual**: ver "Identidade visual: Luz" abaixo. Contraste AA. Tokens em `src/theme/tokens.ts`. Na Fase 3, `accent` segue o tempo litúrgico.
- **Testes**: `node:test` via `tsx` (sem Jest), para lógica pura. `npm test`.
- **Onboarding = questionário** (nome, objetivos, experiência, momento na fé, tempo, horário), cada pergunta com "Pular" e opção de pular tudo; depois notificações, nome do anjo e uma **sugestão** de começo (trilha, plano ou explorar) — `src/lib/recommend.ts`. Trilhas não são mais impostas.
- **Check-in diário** (antecipado da Fase 2): a primeira atividade do dia (capítulo lido ou lição concluída) é o check-in → +10 talentos, +30 a cada 7 dias seguidos. **Ofensiva** = dias seguidos com check-in ou protegidos. **Velas** (50 talentos, máx. 2, 1 de presente) protegem dias perdidos automaticamente ao abrir o app. Sem velas, a ofensiva recomeça sem bronca. Lógica pura em `src/lib/streak.ts`.
- **Moeda**: "talentos" (parábola dos talentos) — confirmado. Ícone: moeda dourada antiga com uma cruz (`src/components/TalentIcon.tsx`), não diamante.
- **Notificações locais** (`src/lib/notifications.ts`): lembrete diário no horário escolhido, aviso de ofensiva em risco (20h30) e Angelus (6h/12h/18h), reagendadas para 7 dias a cada abertura/check-in/mudança. Funcionam no Expo Go.
- **Ofensiva com amigos**: depende de conta e servidor → Fase 4 (Supabase).
- **Identidade visual: "Luz"** (escolhida entre Luz, Vitral e Aurora). Fundo névoa `#F6F7FB`, azul mariano `#2F45D6`, dourado-luz `#F2B544`, tinta `#12142B`; Plus Jakarta Sans (interface, títulos em ExtraBold) + Newsreader (texto bíblico); cantos grandes (cartões 28 px), cartões sem contorno no tema claro; cartão principal azul. Anjo: **"Clássico de Natal"** (escolhido entre Clássico, Silhueta e Símbolo): asas de penas em camadas com borda ondulada, túnica azul em sino com gola e barra douradas, mãos segurando uma estrela dourada, cabelo e auréola (`onPrimary` = túnica branca sobre azul). Rejeitados antes: corpo redondo ("inseto") e asas em duas partes ("borboleta"). Ícone e splash em `assets/` gerados a partir do anjo. Capa de abertura (`src/components/Cover.tsx`) a cada abertura, no azul do splash; toque para pular.
- **Compartilhar para teste**: web (Netlify, `npm run web:build`, cabeçalhos COOP/COEP em `public/_headers`), APK Android (`npm run android:apk`, perfil `preview` do `eas.json`), TestFlight (exige Apple Developer). Ver `docs/compartilhar.md`.

## Estrutura
```
src/app/            telas (Expo Router). (tabs)/ = Hoje, Bíblia, Diário, Perfil
src/components/     UI básica (ui.tsx), Angel (SVG original), Passage (render do texto), Sheet
src/content/        conteúdo editorial: trilhas, glossário, introduções, notas, orações, termos, falas do anjo
src/db/bible.ts     consultas ao banco bíblico (somente leitura, assets/db/bible.db)
src/db/user.ts      banco do usuário (user.db) + migrações por PRAGMA user_version
src/lib/            lógica pura: plano, datas, cânon, salmos, formatação
src/store/          preferências (zustand + expo-sqlite/kv-store, síncrono)
scripts/bible/      pipeline do texto bíblico (OCR → limpeza → combinação → bible.db)
scripts/content/    planilha de revisão doutrinal
content/bible/      correções manuais do texto e listas para revisão
docs/               plano, texto bíblico, revisão doutrinal, qualidade do texto
```

## Comandos
- `npm start` — servidor do Expo (mesmo Wi-Fi; senão `npx expo start --tunnel ngrok` — `--tunnel` sozinho exige login Expo)
- `npm test` — testes · `npm run typecheck` — TypeScript
- `npm run bible:build -- <abibliasagrada/web/data/livros> <biblia-chat-server/corpus>` — regera o banco bíblico. **Depois, aumente `bibleDbName` em `src/config.ts`** para o app substituir a cópia antiga no aparelho.
- `npm run content:review-sheet` — gera `content/revisao-doutrinal/planilha.csv`

## Armadilhas conhecidas
- Na **web** (só usada para testes automatizados), o SQLite precisa de uma operação assíncrona antes das síncronas — tratado em `src/app/_layout.tsx` + `skipHydration` em `src/store/settings.ts`. A web não tem FTS5: a busca usa um LIKE de reserva. Não é alvo de produção.
- Migrações de `user.db`: nunca editar uma já publicada; sempre acrescentar.
- Correções do texto bíblico vão em `content/bible/correcoes.json` (nunca editar o banco à mão). Só corrigir erro de OCR; palavra reconstruída vai também em `conferir`.
- `src/config.ts` tem placeholders (responsável pelos dados, e-mail) que precisam ser preenchidos antes de publicar.

## Estado atual (Fase 1)
Feito: primeiro acesso com termos/idade/LGPD, onboarding (3 perguntas, nome do anjo, escolha de trilha), trilhas Primeiros Passos (7 lições) e Voltando para Casa (6 lições), leitor (fonte, claro/sépia/noturno, destaques em 4 cores, favoritos, notas, copiar/compartilhar texto, glossário tocável, "antes de ler"), plano de leitura (6 escopos, por prazo ou minutos/dia, dias da semana, recálculo sem penalizar, estender prazo), busca, versículos salvos, diário espiritual, privacidade (consentimentos, exportar, apagar tudo), introdução dos 73 livros, notas de Marcos e dos textos das trilhas, glossário (~70 termos).

Depois da Fase 1: questionário de onboarding com "pular", notificações locais, check-in diário com talentos, ofensiva e velas de proteção (telas `checkin`, `ofensiva`, `notificacoes`).

Pendente para fases seguintes: compartilhar versículo como **imagem** (Fase 2, com os fundos desbloqueáveis), lembretes (Fase 2), revisão do texto bíblico (contínua), revisão doutrinal (aguarda revisor).
