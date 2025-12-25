import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, typography, spacing, shadows } from "../theme";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

type Props = NativeStackScreenProps<RootStackParamList, "DetectionResult">;

function formatConfidence(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const percent = value <= 1 ? value * 100 : value;
  if (!Number.isFinite(percent)) return null;
  return `${percent.toFixed(1)}%`;
}

function extractIssues(result: Record<string, unknown>): Array<{ label: string; confidence?: number }> {
  const detections = result.detections;
  if (Array.isArray(detections)) {
    const mapped = detections
      .map((d) => (d && typeof d === "object" ? (d as any) : null))
      .filter((d): d is any => d !== null)
      .map((d) => ({
        label: typeof d.label === "string" ? d.label : "",
        confidence: typeof d.confidence === "number" ? d.confidence : undefined
      }))
      .filter((d) => d.label.trim().length > 0);
    if (mapped.length > 0) return mapped;
  }

  if (typeof result.disease_name === "string" && result.disease_name.trim().length > 0) {
    return [{ label: result.disease_name, confidence: typeof result.confidence === "number" ? result.confidence : undefined }];
  }

  return [];
}

export default function DetectionResultScreen({ navigation, route }: Props) {
  const { imageUri, result } = route.params;
  const resultObj = result as unknown as Record<string, unknown>;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const issues = useMemo(() => extractIssues(resultObj), [resultObj]);
  const confidenceText = useMemo(() => formatConfidence((resultObj as any).confidence), [resultObj]);

  const crop = typeof (resultObj as any).crop_type === "string" ? ((resultObj as any).crop_type as string) : undefined;
  const symptoms = typeof (resultObj as any).symptoms === "string" ? ((resultObj as any).symptoms as string) : undefined;

  // Generate audio text from diagnosis
  const audioText = useMemo(() => {
    const parts: string[] = [];
    if (crop) parts.push(`Crop type: ${crop}`);
    if (issues.length > 0) {
      parts.push(`Detected issues: ${issues.map(i => i.label).join(", ")}`);
    }
    if (symptoms) parts.push(`Symptoms: ${symptoms}`);
    const nextSteps = typeof resultObj.next_steps === "string" 
      ? resultObj.next_steps 
      : Array.isArray(resultObj.next_steps) 
        ? resultObj.next_steps.join(". ") 
        : "";
    if (nextSteps) parts.push(`Next steps: ${nextSteps}`);
    return parts.join(". ");
  }, [crop, issues, symptoms, resultObj]);

  useEffect(() => {
    AsyncStorage.getItem("audioEnabled").then(val => {
      setAudioEnabled(val !== "false");
    });
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const playAudio = async () => {
    if (!audioEnabled || !audioText) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      // Use text-to-speech or pre-recorded audio
      // For now, we'll use a simple approach with expo-speech if available
      // Otherwise, we can use a generic audio file
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../assets/audio/welcome-en.mp3") // Placeholder - should be generated TTS
      );
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync().catch(console.error);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Detection Result" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Card variant="elevated" style={styles.imageCard}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </Card>

        {crop && (
          <Card variant="outlined" style={styles.infoCard}>
            <Text style={styles.infoLabel}>Crop Type</Text>
            <Text style={styles.infoValue}>{crop}</Text>
          </Card>
        )}

        {issues.length > 0 ? (
          <Card variant="elevated" style={[styles.infoCard, styles.issueCard]}>
            <Text style={styles.sectionTitle}>Detected Issues</Text>
            {issues.map((i, idx) => (
              <View key={idx} style={styles.issueItem}>
                <Text style={styles.issueBullet}>•</Text>
                <View style={styles.issueContent}>
                  <Text style={styles.issueLabel}>{i.label}</Text>
                  {i.confidence !== undefined && (
                    <Text style={styles.issueConfidence}>
                      {formatConfidence(i.confidence)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        ) : (
          <Card variant="outlined" style={styles.infoCard}>
            <Text style={styles.noIssueText}>No issues detected</Text>
          </Card>
        )}

        {confidenceText && (
          <Card variant="outlined" style={styles.infoCard}>
            <Text style={styles.infoLabel}>Confidence</Text>
            <Text style={styles.confidenceValue}>{confidenceText}</Text>
          </Card>
        )}

        {symptoms && (
          <Card variant="elevated" style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Symptoms</Text>
            <Text style={styles.symptomsText}>{symptoms}</Text>
          </Card>
        )}

        {audioEnabled && audioText && (
          <Card variant="outlined" style={styles.audioCard}>
            <View style={styles.audioRow}>
              <Text style={styles.audioLabel}>Audio Diagnosis</Text>
              <TouchableOpacity
                onPress={isPlaying ? stopAudio : playAudio}
                style={styles.audioButton}
                activeOpacity={0.7}
              >
                <Text style={styles.audioButtonText}>
                  {isPlaying ? "⏸ Stop" : "▶ Play"}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="View Recommendations"
            onPress={() => navigation.navigate("Recommendations", { result })}
            fullWidth
            style={styles.primaryButton}
          />
          <Button
            title="Call Support"
            onPress={() => navigation.navigate("Support")}
            variant="outline"
            fullWidth
            style={styles.secondaryButton}
          />
        </View>
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
  },
  imageCard: {
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    resizeMode: "cover",
  },
  infoCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  issueCard: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  confidenceValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: "900",
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  issueItem: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  issueBullet: {
    ...typography.h3,
    color: colors.warning,
    marginRight: spacing.sm,
  },
  issueContent: {
    flex: 1,
  },
  issueLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  issueConfidence: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  noIssueText: {
    ...typography.body,
    color: colors.success,
    textAlign: "center",
    fontWeight: "700",
  },
  symptomsText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  actions: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
  audioCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  audioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  audioButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: colors.primary,
  },
  audioButtonText: {
    ...typography.buttonSmall,
    color: colors.textOnPrimary,
  },
});
