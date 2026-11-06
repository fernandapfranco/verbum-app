/**
 * Falas do anjo da guarda. Personalidade: alegre, carinhoso, bem-humorado, um
 * pouco travesso, sempre respeitoso. NUNCA usa culpa, cobrança ou drama.
 */

export const DEFAULT_ANGEL_NAME = 'Gabi';

export function pick<T>(list: readonly T[], seed = Date.now()): T {
  return list[Math.abs(Math.floor(seed)) % list.length];
}

export function greeting(hour: number, name: string): string {
  const nome = name ? `, ${name}` : '';
  if (hour < 5) return `Ainda por aqui a essa hora${nome}? Que tal uma leitura curtinha antes de dormir?`;
  if (hour < 12) return pick([`Bom dia${nome}! Já separei suas asinhas de leitura. 😇`, `Bom dia${nome}! Que tal começar o dia com uma palavra boa?`, `Bom dia${nome}! O café e a Palavra estão servidos. ☕`], hour);
  if (hour < 18) return pick([`Boa tarde${nome}! Uma pausa com Deus cai bem agora.`, `Boa tarde${nome}! Bora pro próximo capítulo?`, `Boa tarde${nome}! Tô por aqui, voando baixinho. 🪽`], hour);
  return pick([`Boa noite${nome}! Que tal fechar o dia com um trecho tranquilo?`, `Boa noite${nome}! Uma leitura e depois descanso, combinado?`], hour);
}

export const WELCOME_BACK = [
  'Que bom te ver de novo! Senti sua falta por aqui. 💛',
  'Olha quem voltou! Vamos recomeçar do jeitinho que der.',
  'Oi! Que alegria ter você de volta. Nada de pressa: um passo de cada vez.',
];

export const PLAN_ADJUSTED = [
  'Ajustei seu plano para caber no seu ritmo. Sem stress! 💛',
  'A vida às vezes aperta. Reorganizei suas leituras com carinho.',
];

export const CHAPTER_DONE = [
  'Mais um capítulo no coração! ✨',
  'Que lindo! Cada leitura é um passo com Deus.',
  'Capítulo concluído! Até eu bati as asinhas de alegria. 🪽',
];

export const LESSON_DONE = [
  'Lição concluída! Tô orgulhoso de você. 😇',
  'Mais um passo na trilha! Bora pro próximo quando quiser.',
];

export const ONBOARDING = {
  hello: 'Eu sou o seu anjo da guarda aqui no Verbum. Vou caminhar com você pela Bíblia — sem pressa e sem cobrança.',
  questions: 'Antes de começar, posso te fazer três perguntinhas? É só pra eu te ajudar melhor.',
  name: 'Ah, e você pode me dar um nome! Como quer me chamar?',
};
