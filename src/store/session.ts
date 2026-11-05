import { create } from 'zustand';

/** Estado só desta sessão (não persiste): resultado da verificação da ofensiva ao abrir. */
export const useSession = create<{
  protectedNow: number;
  streakBroken: boolean;
  set: (s: { protectedNow: number; streakBroken: boolean }) => void;
}>((set) => ({
  protectedNow: 0,
  streakBroken: false,
  set: (s) => set(s),
}));
