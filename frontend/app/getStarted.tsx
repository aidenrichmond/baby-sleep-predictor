import { Image, Pressable, ScrollView, Text, StyleSheet} from "react-native";
import { router } from "expo-router";
import { globalStyles } from "./styles/global";
import { Ionicons } from "@expo/vector-icons";

export default function getStarted() {
    return (
        <ScrollView contentContainerStyle={globalStyles.container}>
            <Image
                source={require("../assets/images/baby-sleep.png")}
                style={styles.illustration}
                resizeMode="contain"
            />
            <Text style={globalStyles.title}>Welcome to the Baby Sleep Predictor!</Text>
            <Text style={globalStyles.subtitle}>
                Get to know your baby's sleep patterns and plan your day better.
            </Text>
            <Pressable
                style={[globalStyles.button, { flexDirection: "row", alignItems: "center", justifyContent: "center" }]}
                onPress={() => {
                    router.replace("/onboarding");
                }}
            >
                <Text style={globalStyles.buttonText}> Get Started </Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
            </Pressable>
        </ScrollView>
    );
}

export const styles = StyleSheet.create({
    illustration: {
        marginTop: 50,
        marginBottom: 100,
        alignSelf: "center",
        width: 300,
        height: 300,
    },
});
