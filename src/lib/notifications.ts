/**
 * Notificações LOCAIS (funcionam no Expo Go e sem internet).
 *
 * Estratégia: a cada abertura do app, a cada check-in e a cada mudança de
 * preferência, cancelamos tudo e agendamos os próximos 7 dias como datas
 * fixas. Assim os textos variam todo dia, e o lembrete de hoje some quando o
 * check-in já foi feito. (O iOS permite 64 agendamentos; usamos no máximo 35.)
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { NotificationPrefs } from '@/store/settings';

import { toISODate } from './dates';
import { isReginaCaeliTime } from './liturgy';

const DAYS_AHEAD = 7;
const RISK_TIME = { h: 20, m: 30 };
const ANGELUS = [6, 12, 18];

const supported = Platform.OS !== 'web';

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Lembretes do anjo: carinhosos, bem-humorados, nunca cobrando. */
export function dailyMessages(angel: string, name: string): { title: string; body: string }[] {
  const oi = name ? `${name}, ` : '';
  return [
    { title: `${angel} 😇`, body: `${oi}já separei suas asinhas de leitura. Bora pro capítulo de hoje?` },
    { title: `${angel} ☕`, body: 'Um café, uma pausa e uma palavra boa. Seus minutinhos com Deus estão te esperando.' },
    { title: `${angel} 🪽`, body: `${oi}tô aqui voando baixinho… que tal uma leitura curtinha agora?` },
    { title: `${angel} ✨`, body: 'Hoje tem um trecho lindo no seu plano. Vem ver comigo?' },
    { title: `${angel} 📖`, body: 'Cinco minutos já fazem diferença. Abre aí que eu leio junto!' },
    { title: `${angel} 💛`, body: `${oi}passando só pra lembrar: Deus tem algo pra te dizer hoje.` },
    { title: `${angel} 🕊️`, body: 'Respira fundo. Que tal terminar o dia com a Palavra?' },
  ];
}

const RISK_MESSAGES = [
  'Sua ofensiva ainda dá tempo de salvar hoje. Um capítulo e pronto! 🔥',
  'Psiu… falta só o check-in de hoje. Sem pressão, eu guardo seu lugar. 😇',
  'Antes de dormir, uma leitura rapidinha mantém sua ofensiva acesa. 🕯️',
];

export async function getPermission(): Promise<boolean> {
  if (!supported) return false;
  const current = await Notifications.getPermissionsAsync();
  return current.granted;
}

export async function requestPermission(): Promise<boolean> {
  if (!supported) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes do anjo',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

function at(base: Date, dayOffset: number, h: number, m: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
}

export interface ScheduleContext {
  prefs: NotificationPrefs;
  angelName: string;
  userName: string;
  /** Já fez o check-in hoje? */
  checkedInToday: boolean;
  /** Ofensiva atual (o aviso de risco só faz sentido se houver ofensiva). */
  streak: number;
}

/** Reagenda tudo. Seguro para chamar várias vezes. */
export async function rescheduleAll(ctx: ScheduleContext): Promise<number> {
  if (!supported) return 0;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const { prefs } = ctx;
  if (!prefs.enabled || !(await getPermission())) return 0;

  const now = new Date();
  const [hh, mm] = prefs.time.split(':').map(Number);
  const msgs = dailyMessages(ctx.angelName, ctx.userName);
  const jobs: { date: Date; title: string; body: string; url?: string }[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const skipToday = i === 0 && ctx.checkedInToday;
    if (prefs.daily && !skipToday) {
      const m = msgs[(now.getDate() + i) % msgs.length];
      jobs.push({ date: at(now, i, hh, mm), ...m, url: '/hoje' });
    }
    if (prefs.streakRisk && !skipToday && (i > 0 || ctx.streak > 0)) {
      jobs.push({
        date: at(now, i, RISK_TIME.h, RISK_TIME.m),
        title: ctx.angelName,
        body: RISK_MESSAGES[(now.getDate() + i) % RISK_MESSAGES.length],
        url: '/hoje',
      });
    }
    if (prefs.angelus) {
      // Do Domingo de Páscoa a Pentecostes, reza-se o Regina Caeli no lugar do Angelus.
      const regina = isReginaCaeliTime(toISODate(at(now, i, 12, 0)));
      for (const h of ANGELUS) {
        jobs.push({
          date: at(now, i, h, 0),
          title: regina ? 'Regina Caeli 🌸' : 'Angelus 🔔',
          body: regina
            ? 'Rainha do céu, alegrai-vos, aleluia! Toque para rezar.'
            : h === 12
              ? 'Meio-dia: um minutinho para rezar o Angelus? Toque para rezar.'
              : 'O anjo do Senhor anunciou a Maria… Toque para rezar.',
          url: regina ? '/oracao/regina-caeli' : '/oracao/angelus',
        });
      }
    }
  }

  const future = jobs.filter((j) => j.date.getTime() > now.getTime() + 60_000);
  for (const j of future) {
    await Notifications.scheduleNotificationAsync({
      content: { title: j.title, body: j.body, data: j.url ? { url: j.url } : {} },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: j.date, channelId: 'lembretes' },
    });
  }
  return future.length;
}

/** Ao tocar numa notificação, abre a tela indicada em `data.url` (ex.: a oração do Angelus). */
export function listenNotificationTaps(open: (url: string) => void): () => void {
  if (!supported) return () => {};
  const handle = (r: Notifications.NotificationResponse | null) => {
    const url = r?.notification.request.content.data?.url;
    if (typeof url === 'string') open(url);
  };
  // App aberto a partir de uma notificação (estava fechado).
  Notifications.getLastNotificationResponseAsync().then(handle).catch(() => {});
  const sub = Notifications.addNotificationResponseReceivedListener(handle);
  return () => sub.remove();
}
