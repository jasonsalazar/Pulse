import {
  ActivityIndicator,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { COLORS, RADIUS, SPACING } from "../../constants/theme";

import { useAppTheme } from "../../stores/themeStore";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: Props) {
  const theme = useAppTheme();

  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === "primary"
      ? COLORS.primary
      : variant === "danger"
        ? COLORS.danger
        : variant === "secondary"
          ? theme.surfaceSecondary
          : "transparent";

  const textColor =
    variant === "primary" || variant === "danger" ? COLORS.white : theme.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: variant === "outline" ? theme.border : backgroundColor,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          width: fullWidth ? "100%" : undefined,
        },
        variant === "outline" && styles.outline,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },

  outline: {
    borderWidth: 1,
  },

  text: {
    fontSize: 15,
    fontWeight: "700",
  },
});
