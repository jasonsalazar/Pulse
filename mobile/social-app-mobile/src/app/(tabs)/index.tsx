import { Text, View, StyleSheet } from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";

import Avatar from "../../components/ui/Avatar";
import AppCard from "../../components/ui/AppCard";
import AppButton from "../../components/ui/AppButton";

import { SPACING } from "../../constants/theme";

import { useAppTheme } from "../../stores/themeStore";

export default function HomeScreen() {
  const theme = useAppTheme();

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Pulse" subtitle="What's happening today?" />

      <AppCard>
        <View style={styles.userRow}>
          <Avatar name="John Doe" size={42} />

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>
              John Doe
            </Text>

            <Text style={{ color: theme.textSecondary }}>
              Share something with your community
            </Text>
          </View>
        </View>

        <AppButton title="Create a post" onPress={() => {}} />
      </AppCard>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Your feed
        </Text>

        <AppCard>
          <Text style={[styles.placeholderTitle, { color: theme.text }]}>
            Your social feed is coming soon!
          </Text>

          <Text
            style={[
              styles.placeholderDescription,
              { color: theme.textSecondary },
            ]}
          >
            Soon you'll be able to see posts, share updates, like posts, and
            interact with your community.
          </Text>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  userInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  section: {
    marginTop: SPACING.md,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },

  placeholderTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },

  placeholderDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
});
