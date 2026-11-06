# Verbum — Especificação técnica

Versão do documento: 5 de novembro de 2026 · Branch `claude/biblia-catolica-app-kyivax`

## 1. Visão geral
Aplicativo móvel (iOS e Android) para católicos lerem a Bíblia inteira com
constância e rezarem, com gamificação (check-in diário, ofensiva, talentos) e um
anjo da guarda como mascote. Funciona **offline e sem conta**: todos os dados
ficam no aparelho. O público principal são jovens adultos (18–35); idade mínima 16.

| Item | Valor |
|---|---|
| Plataformas | iOS, Android (web apenas para demonstração/testes) |
| Idioma | Português do Brasil |
| Arquitetura | Local-first, sem servidor (servidor previsto para a fase social) |
| Tamanho do pacote JS | ~3,6 MB (Hermes bytecode) + banco bíblico ~9,6 MB |
| Código-fonte | ~8.400 linhas TypeScript/TSX em `src/`, mais scripts de dados |

## 2. Linguagens e tecnologias

| Camada | Tecnologia | Versão |
|---|---|---|
| Linguagem | **TypeScript** (modo `strict`) | 6.0 |
| Interface | **React Native** + **React** | RN 0.88 · React 19.3 |
| Plataforma | **Expo SDK** (Continuous Native Generation; sem pastas `ios/`/`android/` versionadas) | 58 |
| Motor JS | Hermes | (do RN 0.88) |
| Navegação | **Expo Router** (rotas por arquivo em `src/app/`) | 58 |
| Banco de dados | **SQLite** via `expo-sqlite` (API síncrona), busca de texto **FTS5** | 58 |
| Estado | **Zustand** (persistência síncrona no kv-store do SQLite) | 5 |
| Gráficos | **react-native-svg** (anjo, ícones próprios) | 15.16 |
| Ícones | `@expo/vector-icons` (Ionicons, Material Community Icons) | 15 |
| Fontes | Plus Jakarta Sans (interface), Newsreader (texto bíblico) — SIL OFL | — |
| Notificações | `expo-notifications` (somente **locais**) | 58.1 |
| Outros módulos Expo | haptics, keep-awake, clipboard, sharing, file-system, splash-screen, font, asset | 58 |
| Build/distribuição | **EAS Build** (perfil `preview` → APK; `production` → lojas) | eas-cli ≥ 16 |
| Web (demo) | react-native-web + SQLite WebAssembly; hospedagem estática (Netlify) com COOP/COEP | 0.21 |
| Testes | `node:test` + `tsx` (lógica pura, sem Jest) | Node 22 |
| Pipeline de dados | TypeScript em Node: `node:sqlite`, dicionário pt-BR (`@cspell/dict-pt-br`, só em build), `diff` | — |

Todos os módulos nativos usados estão incluídos no **Expo Go**, então o app é
testável sem compilar código nativo.

## 3. Arquitetura

```
┌───────────────────────── App (React Native / Expo Router) ─────────────────────────┐
│  Telas (src/app)  ──  Componentes (src/components)  ──  Tema "Luz" (src/theme)     │
│        │                                                                            │
│        ├── Lógica pura (src/lib): plano de leitura · ofensiva · calendário         │
│        │     litúrgico · terço · cânon · Salmos · datas      ← coberta por testes   │
│        ├── Conteúdo editorial (src/content): trilhas, séries, orações, mistérios,  │
│        │     glossário, introduções, termos/LGPD                                    │
│        └── Dados (src/db)                                                           │
│              ├── bible.db  (somente leitura, embarcado, FTS5)                       │
│              └── user.db   (progresso, plano, notas, diário, ofensiva, talentos)    │
│  Preferências (src/store): zustand + kv-store SQLite (síncrono)                     │
│  Notificações locais (src/lib/notifications.ts): agenda 7 dias à frente             │
└─────────────────────────────────────────────────────────────────────────────────────┘
          ▲ gerado por
┌──────── Pipeline do texto bíblico (scripts/bible) ────────┐
│ 2 digitalizações OCR → separa versículos → limpa/atualiza  │
│ ortografia → combina leituras → correções manuais → .db    │
└────────────────────────────────────────────────────────────┘
```

### 3.1 Estrutura de pastas
```
src/app/            telas (Expo Router); (tabs)/ = Hoje, Bíblia, Orar, Diário, Perfil
src/components/     UI (ui.tsx), Angel (SVG), Passage, Sheet, Cover, WeekStrip, TalentIcon…
src/content/        conteúdo editorial versionado no código
src/db/             bible.ts (consultas) e user.ts (migrações + repositório)
src/lib/            regras de negócio puras + testes *.test.ts
src/store/          preferências e estado de sessão
scripts/bible/      geração do bible.db
scripts/content/    planilha de revisão doutrinal
content/bible/      correções manuais e listas de revisão do texto
docs/               plano, texto bíblico, revisão doutrinal, compartilhamento, esta especificação
assets/             ícones, splash, bible.db
```

## 4. Dados

### 4.1 `bible.db` (somente leitura, ~9,6 MB, copiado para o aparelho na 1ª abertura)
| Tabela | Conteúdo |
|---|---|
| `books` | 73 livros na ordem católica, nomes modernos e antigos, grupo, testamento |
| `chapters` | nº de versículos, palavras, minutos estimados (170 palavras/min), revisão, suspeitos |
| `verses` | texto de cada versículo + motivos de suspeita (OCR) |
| `verses_fts` | índice FTS5 (sem acentos) para a busca |
| `meta` | tradução, fonte, versão do build |

Tradução: **Pe. Antônio Pereira de Figueiredo** (domínio público), 35.809
versículos, ortografia atualizada automaticamente. Salmos na numeração da
Vulgata, exibidos como "Salmo 23 (22)".

### 4.2 `user.db` (dados da pessoa, migrações por `PRAGMA user_version`)
| Tabela | Uso |
|---|---|
| `reading_log` | capítulos lidos e data |
| `plans` | plano de leitura (configuração em JSON) |
| `highlights`, `favorites`, `notes` | marcações nos versículos |
| `journal` | diário espiritual |
| `trail_progress` | lições concluídas de trilhas e séries |
| `consent_log` | histórico de consentimentos (LGPD) |
| `checkins`, `protected_days` | check-in diário e dias protegidos por vela |
| `wallet` | extrato de talentos e velas (saldo = soma) |
| `prayer_log` | terços e Rosários rezados |

### 4.3 Preferências (kv-store)
Consentimento, respostas do questionário, nome do anjo e da pessoa, preferências
do leitor, preferências de notificação, último capítulo aberto.

## 5. Regras de negócio principais (todas em `src/lib`, com testes)
- **Plano de leitura** (`plan/engine.ts`): escopo (Bíblia, AT, NT, Evangelhos,
  Salmos+Provérbios intercalados, livro), por prazo ou minutos/dia e dias da
  semana. A leitura do dia é recalculada a partir do que falta, sem "dívida";
  permite estender o prazo mantendo o ritmo.
- **Ofensiva e talentos** (`streak.ts`): 1ª atividade do dia (capítulo, lição ou
  terço) = check-in, +10 talentos, +30 a cada 7 dias; velas (50 talentos, máx. 2)
  cobrem dias perdidos automaticamente.
- **Calendário litúrgico** (`liturgy.ts`): Páscoa (Meeus/Jones/Butcher), Advento,
  Cinzas, Pentecostes, Epifania e Batismo pela regra do Brasil, tempos e cores,
  período do Regina Caeli.
- **Terço** (`rosary.ts`): mistérios do dia (Rosarium Virginis Mariae 38),
  sequência de 53 Ave-Marias (terço) ou 203 (Rosário completo).
- **Evangelho do dia** (`lectionary.ts`): identifica o dia litúrgico (tempos,
  semanas, ciclo A/B/C, solenidades e festas, transferências do Brasil) e busca
  a referência na tabela do Lecionário (534 entradas, geradas cruzando duas
  compilações do Ordo Lectionum Missae). Verificado para todos os dias de 2026 a 2028.
- **Recomendação** (`recommend.ts`): sugestão de começo a partir do questionário.

Testes: **66 casos** (`npm test`) cobrindo plano, ofensiva, liturgia, terço,
Salmos, cânon e limpeza do texto.

## 6. Funcionalidades entregues
- Primeiro acesso: Termos e Política (versionados), idade 16+, consentimento
  separado para dados sensíveis.
- Questionário de boas-vindas (pulável), notificações, nome do anjo, sugestão.
- Capa de abertura; identidade visual "Luz"; anjo "Clássico de Natal".
- Leitor: tamanho de fonte, claro/sépia/noturno, destaques, favoritos, notas,
  copiar/compartilhar, glossário tocável, notas "antes de ler", atalhos de oração.
- Bíblia com 73 livros, busca, versículos salvos.
- Trilhas Primeiros Passos (7) e Voltando para Casa (6); série do Advento (7).
- Plano de leitura; check-in, ofensiva, talentos, velas.
- Evangelho do dia (tela própria, cartão na tela Hoje e na aba Orar).
- Aba Orar: oração inicial/final, Vinde Espírito Santo, Angelus/Regina Caeli,
  básicas, marianas, ato de contrição; terço e Rosário guiados.
- Notificações locais: lembrete diário, ofensiva em risco, Angelus/Regina Caeli
  (abrem a oração ao tocar).
- Diário espiritual; privacidade (exportar JSON, apagar tudo).

## 7. Privacidade e segurança (LGPD)
- Nenhum dado sai do aparelho; sem conta, sem servidor, sem analytics, sem anúncios.
- Convicção religiosa tratada como **dado sensível** (art. 11): consentimento
  específico, desmarcado por padrão, revogável (revogar apaga diário e notas).
- Direitos do titular no app: ver consentimentos, exportar dados, apagar tudo.
- Pendências antes da loja: preencher responsável e e-mail do encarregado em
  `src/config.ts`; revisão jurídica dos Termos e da Política.

## 8. Acessibilidade
Contraste WCAG AA nas paletas; respeito ao tamanho de fonte do sistema (limite
1,6× na interface; texto bíblico sem limite); alvos de toque ≥ 44 pt; rótulos e
papéis para leitores de tela; contador do terço anunciado por voz; capa respeita
"Reduzir movimento".

## 9. Build, testes e distribuição
| Objetivo | Comando / caminho |
|---|---|
| Rodar no Expo Go | `npm install` → `npx expo start` (login Expo exigido pelo Expo Go atual) |
| Testes / tipos | `npm test` · `npm run typecheck` |
| Versão web (demo) | `npm run web:build` → pasta `dist/` → Netlify |
| APK Android | `npm run android:apk` (EAS Build, perfil `preview`) |
| iOS (TestFlight) | EAS Build `production` + `eas submit` (requer Apple Developer, US$ 99/ano) |
| Regerar Bíblia | `npm run bible:build -- <A> <B>` e aumentar `bibleDbName` |
| Planilha doutrinal | `npm run content:review-sheet` |

Identificadores: `app.verbum.biblia` (iOS e Android), esquema de link `verbum://`.

## 10. Limitações conhecidas
- **Texto bíblico** vindo de OCR: ~16% dos versículos marcados para revisão e
  162 ainda ausentes ([…]). Revisados à mão: trechos das trilhas e séries.
- **Conteúdo explicativo** (introduções, glossário, trilhas, séries, meditações
  do terço) em rascunho, aguardando revisor doutrinal.
- **Web**: sem notificações, busca lenta (sem FTS5), dados no navegador.
- **Expo Go**: notificações aparecem com nome/ícone do Expo Go (no app
  instalado aparecem como Verbum).
- Nada testado ainda em build nativo (APK/TestFlight).

## 11. Próximas etapas previstas
- Gamificação completa: XP, níveis, conquistas, baú semanal, quiz, mapa da
  peregrinação, loja de itens do anjo, versículo como imagem.
- Liturgia: 1ª leitura e salmo do dia, santo do dia, séries
  de Natal, Quaresma e Páscoa, cor do tema seguindo o tempo litúrgico.
- Social (Supabase, região São Paulo, RLS): conta, amigos, ofensiva com amigos,
  incentivos, pedidos de oração, grupos, ligas, push remoto (exige development build).
