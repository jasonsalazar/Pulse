import { Text, StyleSheet } from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";

import AppCard from "../../components/ui/AppCard";
import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";

import { SPACING } from "../../constants/theme";
import { useAppTheme } from "../../stores/themeStore";

export default function CreateScreen() {
  const theme = useAppTheme();

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Create post" subtitle="Share your thoughts" />

      <AppCard>
        <Text style={[styles.title, { color: theme.text }]}>
          What's on your mind?
        </Text>

        <AppInput
          placeholder="Write something..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={styles.textArea}
        />

        <AppButton title="Publish post" onPress={() => {}} />
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },

  textArea: {
    height: 150,
    paddingTop: SPACING.md,
  },
});
