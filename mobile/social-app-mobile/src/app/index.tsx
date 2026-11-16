import { View, Text, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>P</Text>
          </View>

          <Text style={styles.brandName}>Pulse</Text>

          <Text style={styles.tagline}>Connect. Share. Stay in the loop.</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Welcome to Pulse!</Text>

          <Text style={styles.description}>
            Your community, your conversations, and everything happening around
            you in one place.
          </Text>
        </View>

        {/* Development Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Your app is ready!</Text>

          <Text style={styles.statusDescription}>
            Pulse Android project foundation has been initialized successfully.
          </Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusIndicator} />

            <Text style={styles.statusLabel}>Development mode</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with React Native and Expo
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "space-between",
    paddingVertical: SPACING.xl,
  },

  brandContainer: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: "800",
  },

  brandName: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.md,
  },

  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  welcomeContainer: {
    alignItems: "center",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },

  statusCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  statusDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },

  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    marginRight: SPACING.sm,
  },

  statusLabel: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
