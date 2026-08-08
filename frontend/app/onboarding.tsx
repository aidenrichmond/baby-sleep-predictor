import { Image, StyleSheet, Pressable, Text, TextInput, ScrollView } from "react-native";
import { globalStyles, colors } from "./styles/global";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";


const OnboardingScreen = () => {
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const handleGetStarted = async () => {
        if (!birthDate) return;

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
        <ScrollView style={globalStyles.container}>
            <Image
                source={require("../assets/images/baby-sleep.png")}
                style={styles.illustration}
                resizeMode="contain"
            />
            <Text style={globalStyles.title}>
                First we need some information about your baby!
            </Text>
            <Text style={globalStyles.subtitle}>
                Please enter your baby's name and birthday to get started.
            </Text>

            <TextInput
                style={globalStyles.input}
                placeholder="Enter your baby's name"
                placeholderTextColor={colors.textPlaceholder}
                value={name}
                onChangeText={setName}
            />

            <Pressable
                style={globalStyles.input}
                onPress={() => {
                setTempDate(birthDate || new Date());
                setShowPicker(true);
                }}
            >
                <Text
                    style={[
                        globalStyles.inputText,
                        {
                        color: birthDate
                            ? colors.textPrimary
                            : colors.textPlaceholder,
                        },
                    ]}
                >
                    {birthDate
                        ? birthDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })
                        : "Select baby's birthday"}
                </Text>
            </Pressable>

            {showPicker && (
                <>
                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="default"
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
                            style={[globalStyles.button, { backgroundColor: colors.secondary }]}
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
                disabled={!name || !birthDate}
            >
                <Pressable
                    style={[
                        styles.saveButton,
                        { backgroundColor: name && birthDate ? "#4bd600" : "gray" },
                    ]}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.getStartedButton}>Continue</Text>
                </Pressable>
            </Pressable>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    inputText: {
        color: "black",
    },

    saveButton: {
        marginTop: 15,
        height: 45,
        borderRadius: 25,
        backgroundColor: colors.secondary,
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: 30,
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
    illustration: {
        alignSelf: "center",
        width: 150,
        height: 150,
        marginBottom: 50,
    },
});

export default OnboardingScreen;
