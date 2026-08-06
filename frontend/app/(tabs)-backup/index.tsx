import { ScrollView, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function HomeScreen() {
  return (
      <ScrollView contentContainerStyle={globalStyles.container}>
        <Text style={globalStyles.title}>Baby Sleep Predictor</Text>
      </ScrollView>
  );
}
