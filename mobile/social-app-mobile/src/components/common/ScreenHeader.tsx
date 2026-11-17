import { View, Text, StyleSheet, Pressable } from "react-native";

import { ReactNode } from "react";

import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

import { COLORS, SPACING } from "../../constants/theme";

import { useAppTheme } from "../../stores/themeStore";

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: ReactNode;
}

export default function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  rightElement,
}: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={theme.text} />
          </Pressable>
        )}

        <View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },
});
