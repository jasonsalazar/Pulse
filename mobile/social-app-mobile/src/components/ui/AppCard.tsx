import { ReactNode } from "react";

import { View, StyleSheet, ViewStyle } from "react-native";

import { RADIUS, SPACING } from "../../constants/theme";

import { useAppTheme } from "../../stores/themeStore";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export default function AppCard({
  children,
  style,
  padding = SPACING.md,
}: Props) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
});
