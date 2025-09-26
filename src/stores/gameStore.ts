// src/stores/gameStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import confetti from 'canvas-confetti';

interface GameState {
  xp: number;
  showXpGain: boolean;
  xpGained: number;
  newBadges: string[];
  showLevelUp: boolean;
  newLevel: number;
  addXp: (points: number) => void;
  triggerXpGain: (xp: number) => void;
  triggerBadgeUnlock: (badges: string[]) => void;
  triggerLevelUp: (level: number) => void;
  clearNotifications: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      xp: 0,
      showXpGain: false,
      xpGained: 0,
      newBadges: [],
      showLevelUp: false,
      newLevel: 0,

      addXp: (points: number) =>
        set((state) => ({
          xp: state.xp + points,
        })),

      triggerXpGain: (xp: number) => {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        set({
          showXpGain: true,
          xpGained: xp,
        });

        setTimeout(() => {
          set({ showXpGain: false, xpGained: 0 });
        }, 3000);
      },

      triggerBadgeUnlock: (badges: string[]) =>
        set({ newBadges: badges }),

      triggerLevelUp: (level: number) =>
        set({ showLevelUp: true, newLevel: level }),

      clearNotifications: () =>
        set({ newBadges: [], showLevelUp: false }),
    }),
    {
      name: "game-storage", // key in localStorage
    }
  )
);
