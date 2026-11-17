import { ReactNode } from "react";

import {
  StyleSheet,
  View,
  ScrollView,
  ScrollViewProps,
  ViewStyle,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../stores/themeStore";
import { SPACING } from "../../constants/theme";

interface Props {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
}

export default function ScreenContainer({
  children,
  scroll = false,
  contentStyle,
  scrollViewProps,
}: Props) {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {scroll ? (
        <ScrollView
          {...scrollViewProps}
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
  },
});
