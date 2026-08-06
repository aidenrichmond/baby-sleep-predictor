import { ScrollView , StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import { Link } from "expo-router"; 

export default function SettingsScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
    </ScrollView>
  );
}
