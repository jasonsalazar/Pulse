import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useAppTheme } from "../stores/themeStore";
import { COLORS } from "../constants/theme";

export default function RootLayout() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar style={theme.statusBar} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}
