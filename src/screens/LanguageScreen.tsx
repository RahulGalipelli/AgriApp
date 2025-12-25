import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { Button } from "react-native-paper";
import { colors, typography, spacing } from "../theme";



const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.xxl,
      backgroundColor: colors.background
    },
    title: {
      ...typography.h1,
      marginTop: 30,
      marginBottom: spacing.xl,
      textAlign: "center",
      color: colors.textPrimary
    },
    langButton: {
      padding: spacing.md,
      borderRadius: spacing.sm,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      marginBottom: spacing.md
    },
    selected: {
      backgroundColor: colors.primaryLight
    },
    langText: {
      ...typography.bodyLarge,
      textAlign: "center",
      color: colors.textPrimary
    },
    audioRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.xl
    },
    audioText: {
      ...typography.body,
      color: colors.textPrimary
    },
    continueButton: {
      backgroundColor: colors.primary,
      padding: spacing.lg,
      borderRadius: spacing.md,
      marginTop: 30
    },
    backButton: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: spacing.md,
        marginTop: 30
      },
    continueText: {
      ...typography.button,
      color: colors.textOnPrimary,
      textAlign: "center"
    }
  });
  
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" }
];


export default function LanguageScreen({ navigation }: any) {
  const [selectedLang, setSelectedLang] = useState("en");
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const continueNext = async () => {
    await AsyncStorage.setItem("onboardingDone", "true");
    navigation.replace("Login");
  };
  
  const playAudioGuide = async () => {
    if (!audioEnabled) return;

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/welcome-en.mp3")
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) sound.unloadAsync();
      });
  };

  const continueApp = async () => {
    await AsyncStorage.setItem("language", selectedLang);
    await AsyncStorage.setItem("audioEnabled", JSON.stringify(audioEnabled));
    await AsyncStorage.setItem("onboardingDone", "true");

    navigation.replace("Login");
  };
  const backApp = async () => {
    await AsyncStorage.setItem("language", "");
    await AsyncStorage.setItem("audioEnabled", "");
    await AsyncStorage.setItem("onboardingDone", "false");

    navigation.replace("Splash");
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={backApp}><Text style={styles.continueText}>Back</Text></TouchableOpacity>
      <Text style={styles.title}>
        
        Choose Your Language</Text>

      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.langButton,
              selectedLang === item.code && styles.selected
            ]}
            onPress={() => {
              setSelectedLang(item.code);
              playAudioGuide();
            }}
          >
            <Text style={styles.langText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.audioRow}>
        <Text style={styles.audioText}>Audio Instructions</Text>
        <Switch value={audioEnabled} onValueChange={setAudioEnabled} />
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={continueApp}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
