import { View, Text, Image, StyleSheet } from "react-native";

import { COLORS, RADIUS } from "../../constants/theme";

interface Props {
  uri?: string | null;
  name: string;
  size?: number;
}

export default function Avatar({ uri, name, size = 44 }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : (
        <Text
          style={[
            styles.initial,
            {
              fontSize: size * 0.4,
            },
          ]}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  initial: {
    color: COLORS.primaryDark,
    fontWeight: "800",
  },
});
