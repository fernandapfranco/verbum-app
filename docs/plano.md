# Plano do Verbum (aprovado em 05/11/2026)

## Visão
App para católicos lerem a Bíblia inteira com constância, com gamificação no
estilo Duolingo, um anjo da guarda como mascote e recursos de oração diária.
Moderno e leve, com clima de recolhimento; nunca infantil nem caricato.

## Arquitetura
- Expo (TypeScript) + Expo Router; roda no Expo Go até a Fase 3.
- Local-first: `bible.db` (somente leitura, embarcado, com busca FTS5) e
  `user.db` (progresso, plano, destaques, notas, diário) via expo-sqlite.
- Preferências em zustand + kv-store do expo-sqlite.
- Fase 4: Supabase (São Paulo), com RLS; conta opcional até lá.

## Modelo de dados (Fase 1)
- `bible.db`: `books`, `chapters` (minutos estimados, revisão), `verses`
  (texto + motivos de suspeita), `verses_fts`, `meta`.
- `user.db`: `reading_log`, `plans` (config JSON), `highlights`, `favorites`,
  `notes`, `journal`, `trail_progress`, `consent_log`.
- Próximas fases: `xp_events`, `streak_days`, `wallet_ledger`, `inventory`,
  `achievements`, `prayer_log`, `quiz_answers`, `notification_prefs` (local) e,
  no Supabase, `profiles`, `friendships`, `encouragements`, `prayer_requests`,
  `groups`, `league_*`, `daily_summaries` (só agregados).

## Telas
Primeiro acesso (termos, idade 16+, LGPD) → onboarding → abas **Hoje**,
**Bíblia**, **Diário**, **Perfil** (a aba **Orar** entra na Fase 3 e **Amigos**
na Fase 4). Leitor, plano, trilhas/lições, busca, salvos, glossário,
privacidade, sobre o texto.

## Fases
| Fase | Escopo | Teste |
|---|---|---|
| 1 | Primeiro acesso, onboarding, trilhas, leitor, plano | Expo Go |
| 2 | Anjo animado, XP, níveis, streak + velas, talentos, loja, baú, conquistas, quiz, mapa da peregrinação, notificações locais, versículo como imagem | Expo Go |
| 3 | Calendário litúrgico por algoritmo (com particularidades do Brasil), cores do tema, Evangelho e santo do dia, terço/Rosário, Angelus/Regina Caeli, orações | Expo Go |
| 4 | Supabase: login, amigos (código/link/QR), incentivos, pedidos de oração, ligas, grupos, push remoto | development build (EAS) |

## Pontos de atenção
- Direitos autorais: ver `docs/texto-biblico.md`.
- Fidelidade doutrinal: ver `docs/revisao-doutrinal.md`.
- LGPD: convicção religiosa é dado sensível (art. 5º, II e art. 11).
- Acessibilidade: contraste AA, fonte do sistema, leitores de tela,
  "reduzir movimento" (Fase 2).
