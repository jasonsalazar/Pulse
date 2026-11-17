import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeMode, THEMES } from "../constants/theme";

interface ThemeState {
  mode: ThemeMode;

  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",

      setMode: (mode) => set({ mode }),

      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "pulse-theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        mode: state.mode,
      }),
    },
  ),
);

export const useAppTheme = () => {
  const mode = useThemeStore((state) => state.mode);

  return THEMES[mode];
};
