import { ScrollView , StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/global";

export default function CalendarScreen() {
    return (
        <ScrollView style={globalStyles.container}>
            <Text style={globalStyles.title}>Calendar</Text>
        </ScrollView>
    );
}
