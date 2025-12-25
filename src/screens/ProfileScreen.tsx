import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, typography, spacing, shadows } from "../theme";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

export default function ProfileScreen() {
  const [region, setRegion] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedRegion = await AsyncStorage.getItem("region");
    const savedPincode = await AsyncStorage.getItem("pincode");
    const savedLanguage = await AsyncStorage.getItem("language");
    const savedAudio = await AsyncStorage.getItem("audioEnabled");
    
    if (savedRegion) setRegion(savedRegion);
    if (savedPincode) setPincode(savedPincode);
    if (savedLanguage) setSelectedLanguage(savedLanguage);
    if (savedAudio !== null) setAudioEnabled(savedAudio === "true");
  };

  const saveSettings = async () => {
    await AsyncStorage.setItem("region", region);
    await AsyncStorage.setItem("pincode", pincode);
    await AsyncStorage.setItem("language", selectedLanguage);
    await AsyncStorage.setItem("audioEnabled", JSON.stringify(audioEnabled));
    Alert.alert("Success", "Settings saved successfully");
  };

  const submitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }
    // In a real app, this would send feedback to backend
    Alert.alert("Thank You", "Your feedback has been submitted");
    setFeedback("");
  };

  return (
    <View style={styles.container}>
      <Header title="Profile & Settings" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📍 Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Region/State"
            value={region}
            onChangeText={setRegion}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor={colors.textSecondary}
          />
        </Card>

        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🌐 Language</Text>
          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  selectedLanguage === lang.code && styles.languageButtonSelected,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang.code && styles.languageTextSelected,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔊 Audio Settings</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Enable Audio Instructions</Text>
            <Switch
              value={audioEnabled}
              onValueChange={setAudioEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primaryLight }}
              thumbColor={audioEnabled ? colors.primary : colors.gray[500]}
            />
          </View>
        </Card>

        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💬 Help & Feedback</Text>
          <TextInput
            style={[styles.input, styles.feedbackInput]}
            placeholder="Share your feedback or report an issue..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.textSecondary}
          />
          <Button
            title="Submit Feedback"
            onPress={submitFeedback}
            variant="outline"
            fullWidth
            style={styles.feedbackButton}
          />
        </Card>

        <Button
          title="Save Settings"
          onPress={saveSettings}
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  languageButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundLight,
    minWidth: 100,
    alignItems: "center",
  },
  languageButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  languageText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  languageTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  feedbackInput: {
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },
  feedbackButton: {
    marginTop: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

