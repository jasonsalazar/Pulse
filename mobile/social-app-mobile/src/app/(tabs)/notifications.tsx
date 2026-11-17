import { Text } from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";

import AppCard from "../../components/ui/AppCard";
import { useAppTheme } from "../../stores/themeStore";

export default function NotificationsScreen() {
  const theme = useAppTheme();

  return (
    <ScreenContainer>
      <ScreenHeader title="Notifications" subtitle="Stay updated" />

      <AppCard>
        <Text
          style={{
            color: theme.text,
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          You're all caught up!
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            marginTop: 8,
          }}
        >
          Your notifications will appear here.
        </Text>
      </AppCard>
    </ScreenContainer>
  );
}
