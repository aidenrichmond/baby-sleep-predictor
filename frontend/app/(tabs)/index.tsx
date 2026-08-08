import { Pressable, ScrollView, Text, StyleSheet, View } from "react-native";
import { globalStyles, colors } from "../styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={[globalStyles.container, {paddingTop: 0, paddingHorizontal: 0}]}>

      <View style={styles.predictionBox}>
        <Text style={styles.predictionTitle}>Predicted Wake Time</Text>
        <Text style={styles.predictionText}>2:30 PM</Text>
      </View>

      <View style={styles.wrapper}>
        <Pressable
          onPress={() => router.push("/timer?type=feed")}
          style={[styles.box, { backgroundColor: colors.accentPink }]}
        >
          <Ionicons name="water-outline" size={30} color={colors.background} />
          <Text style={styles.text}>Log Feed</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/timer?type=sleep")}
          style={[styles.box, { backgroundColor: colors.accentPurple }]}
        >
          <Ionicons name="moon-outline" size={30} color={colors.background} />
          <Text style={styles.text}>Log Sleep</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 16,
    paddingHorizontal: 20,
  },

  box: {
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  text: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.background,
  },

  predictionBox: {
  width: "100%",
  backgroundColor: colors.card,
  padding: 60,
  marginBottom: 20,
  },

  predictionTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  predictionText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
