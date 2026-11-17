import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

import { RADIUS, SPACING } from "../../constants/theme";

import { useAppTheme } from "../../stores/themeStore";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export default function AppInput({ label, error, style, ...props }: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}

      <TextInput
        {...props}
        placeholderTextColor={theme.textSecondary}
        selectionColor="#6366F1"
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.text,
            borderColor: error ? "#EF4444" : theme.border,
          },
          style,
        ]}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
  },

  error: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});
