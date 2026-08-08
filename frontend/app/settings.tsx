import { ScrollView, View, Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, colors } from "./styles/global";

export default function SettingsScreen() {
  return (
    <ScrollView style={[globalStyles.container, {paddingTop: 70}]}>
      
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Link href="/(tabs)" asChild>
          <Pressable>
            <Ionicons name="arrow-back" size={25} color={colors.textPrimary}/>
          </Pressable>
        </Link>

        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 17,
            fontWeight: "600",
            color: colors.textPrimary,
          }}
        >
          Settings
        </Text>
      </View>
    </ScrollView>
  );
}