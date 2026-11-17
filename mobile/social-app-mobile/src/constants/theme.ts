export type ThemeMode = "light" | "dark";

export const COLORS = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  primaryLight: "#EEF2FF",

  success: "#16A34A",
  danger: "#EF4444",
  warning: "#F59E0B",

  white: "#FFFFFF",
  black: "#000000",
};

export const THEMES = {
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",

    text: "#0F172A",
    textSecondary: "#64748B",

    border: "#E2E8F0",

    tabBar: "#FFFFFF",
    tabBarInactive: "#94A3B8",

    statusBar: "dark" as const,
  },

  dark: {
    background: "#0F172A",
    surface: "#1E293B",
    surfaceSecondary: "#334155",

    text: "#F8FAFC",
    textSecondary: "#94A3B8",

    border: "#334155",

    tabBar: "#1E293B",
    tabBarInactive: "#64748B",

    statusBar: "light" as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const TYPOGRAPHY = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  heading: 30,
};
