import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, typography, spacing, shadows } from "../theme";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useI18n } from "../i18n";
import { updateUser } from "../api/user";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

export default function ProfileScreen() {
  const { t, language, setLanguage } = useI18n();
  const [region, setRegion] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | "ta" | "te" | "kn" | "ml">(language);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const loadSettings = async () => {
    const savedRegion = await AsyncStorage.getItem("region");
    const savedPincode = await AsyncStorage.getItem("pincode");
    const savedLanguage = await AsyncStorage.getItem("language");
    const savedAudio = await AsyncStorage.getItem("audioEnabled");
    
    if (savedRegion) setRegion(savedRegion);
    if (savedPincode) setPincode(savedPincode);
    if (savedLanguage && ["en", "hi", "ta", "te", "kn", "ml"].includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage as any);
    }
    if (savedAudio !== null) setAudioEnabled(savedAudio === "true");
  };

  const handleLanguageChange = async (langCode: "en" | "hi" | "ta" | "te" | "kn" | "ml") => {
    setSelectedLanguage(langCode);
    // Update i18n immediately for instant UI update
    await setLanguage(langCode);
    // Update backend
    try {
      await updateUser({ language: langCode });
    } catch (error) {
      console.error("Failed to update language in backend:", error);
      // Don't show error to user as local storage is already updated
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to local storage
      await AsyncStorage.setItem("region", region);
      await AsyncStorage.setItem("pincode", pincode);
      await AsyncStorage.setItem("language", selectedLanguage);
      await AsyncStorage.setItem("audioEnabled", JSON.stringify(audioEnabled));
      
      // Update backend (only language and name are stored in backend)
      await updateUser({
        language: selectedLanguage,
      });
      
      Alert.alert(t("common.success"), t("profile.settingsSaved"));
    } catch (error) {
      console.error("Failed to save settings:", error);
      Alert.alert(t("common.error"), error instanceof Error ? error.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const submitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert(t("common.error"), t("profile.enterFeedback"));
      return;
    }
    // In a real app, this would send feedback to backend
    Alert.alert(t("profile.thankYou"), t("profile.feedbackSubmitted"));
    setFeedback("");
  };

  return (
    <View style={styles.container}>
      <Header title={t("profile.title")} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t("profile.location")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("profile.region")}
            value={region}
            onChangeText={setRegion}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder={t("profile.pincode")}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor={colors.textSecondary}
          />
        </Card>

        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t("profile.language")}</Text>
          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  selectedLanguage === lang.code && styles.languageButtonSelected,
                ]}
                onPress={() => handleLanguageChange(lang.code as any)}
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
          <Text style={styles.sectionTitle}>{t("profile.audioSettings")}</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t("profile.enableAudioInstructions")}</Text>
            <Switch
              value={audioEnabled}
              onValueChange={setAudioEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primaryLight }}
              thumbColor={audioEnabled ? colors.primary : colors.gray[500]}
            />
          </View>
        </Card>

        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t("profile.helpFeedback")}</Text>
          <TextInput
            style={[styles.input, styles.feedbackInput]}
            placeholder={t("profile.feedbackPlaceholder")}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.textSecondary}
          />
          <Button
            title={t("profile.submitFeedback")}
            onPress={submitFeedback}
            variant="outline"
            fullWidth
            style={styles.feedbackButton}
          />
        </Card>

        <Button
          title={t("common.save")}
          onPress={saveSettings}
          fullWidth
          style={styles.saveButton}
          loading={saving}
          disabled={saving}
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

