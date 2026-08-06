import { StyleSheet, Pressable, Text, TextInput, View } from "react-native";
import { globalStyles } from "./styles/global";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const OnboardingScreen = () => {
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const handleGetStarted = async () => {
        try {
            await AsyncStorage.setItem("babyName", name);
            await AsyncStorage.setItem(
                "birthDate",
                birthDate.toISOString()
            );
            await AsyncStorage.setItem("onboardingComplete", "true");

            router.replace("/(tabs)");
        } catch (e) {
            console.log("Error saving", e);
        }
    };

    return (
        <View style={[globalStyles.container, { padding: 20 }]}>

            <Text style={styles.title}>
                Welcome to the Baby Sleep Predictor! Please enter your baby's name and birthday to get started.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your baby's name"
                placeholderTextColor="gray"
                selectionColor="black"
                value={name}
                onChangeText={setName}
            />

            <Pressable
                style={styles.input}
                onPress={() => setShowPicker(true)}
            >
                <Text style={styles.inputText}>
                    {birthDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Text>
            </Pressable>

            {showPicker && (
                <>
                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="inline"
                        themeVariant="light"
                        textColor="black"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                setTempDate(selectedDate);
                            }
                        }}
                    />

                    <Pressable
                        onPress={() => {
                            setBirthDate(tempDate);
                            setShowPicker(false);
                        }}
                    >
                        <Pressable
                            style={styles.saveButton}
                            onPress={() => {
                                setBirthDate(tempDate);
                                setShowPicker(false);
                            }}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                    </Pressable>
                </>
            )}

            <Pressable
                onPress={handleGetStarted}
                disabled={!name}
            >
                <Pressable
                    style={[
                        styles.saveButton,
                        { backgroundColor: name ? "#4bd600" : "gray" },
                    ]}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.getStartedButton}>Get Started</Text>
                </Pressable>
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        color: "#4bd600",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 12,
        justifyContent: "center",
        backgroundColor: "white",
    },

    inputText: {
        color: "black",
    },

    saveButton: {
        marginTop: 15,
        height: 45,
        borderRadius: 12,
        backgroundColor: "#438afc",
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: 20,
        marginHorizontal: 12,
        marginBottom: 12,
    },

    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    getStartedButton: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default OnboardingScreen;
