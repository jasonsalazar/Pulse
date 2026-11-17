import { Text } from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";

import AppInput from "../../components/ui/AppInput";

import { useAppTheme } from "../../stores/themeStore";

export default function SearchScreen() {
  const theme = useAppTheme();

  return (
    <ScreenContainer>
      <ScreenHeader title="Discover" subtitle="Find people and communities" />

      <AppInput
        placeholder="Search Pulse..."
        autoCapitalize="none"
        returnKeyType="search"
      />

      <Text style={{ color: theme.textSecondary }}>
        Search results will appear here.
      </Text>
    </ScreenContainer>
  );
}
