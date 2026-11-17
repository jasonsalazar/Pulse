import { View, Text, Pressable, StyleSheet } from "react-native";

import { Moon, Sun } from "lucide-react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";

import Avatar from "../../components/ui/Avatar";
import AppCard from "../../components/ui/AppCard";

import { SPACING } from "../../constants/theme";

import { useAppTheme, useThemeStore } from "../../stores/themeStore";

export default function ProfileScreen() {
  const theme = useAppTheme();

  const mode = useThemeStore((state) => state.mode);

  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="My Profile" subtitle="Your personal space" />

      <AppCard>
        <View style={styles.profile}>
          <Avatar name="John Doe" size={84} />

          <Text style={[styles.name, { color: theme.text }]}>John Doe</Text>

          <Text style={{ color: theme.textSecondary }}>@johndoe</Text>

          <Text style={[styles.bio, { color: theme.textSecondary }]}>
            Welcome to my Pulse profile!
          </Text>
        </View>
      </AppCard>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Appearance
      </Text>

      <Pressable
        onPress={toggleTheme}
        style={[
          styles.themeButton,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        {mode === "light" ? (
          <Moon color={theme.text} size={22} />
        ) : (
          <Sun color={theme.text} size={22} />
        )}

        <Text style={[styles.themeText, { color: theme.text }]}>
          Switch to {mode === "light" ? "Dark" : "Light"} Mode
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: SPACING.md,
  },

  bio: {
    marginTop: SPACING.md,
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: SPACING.md,
  },

  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderWidth: 1,
    borderRadius: 12,
  },

  themeText: {
    marginLeft: SPACING.md,
    fontSize: 15,
    fontWeight: "600",
  },
});
