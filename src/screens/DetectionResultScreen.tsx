import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";

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

  const issues = useMemo(() => extractIssues(resultObj), [resultObj]);
  const confidenceText = useMemo(() => formatConfidence((resultObj as any).confidence), [resultObj]);

  const crop = typeof (resultObj as any).crop_type === "string" ? ((resultObj as any).crop_type as string) : undefined;
  const symptoms = typeof (resultObj as any).symptoms === "string" ? ((resultObj as any).symptoms as string) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detection Result</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      {crop ? <Text style={styles.row}>Crop: {crop}</Text> : null}
      {issues.length === 0 ? <Text style={styles.row}>Issue: Diagnosis not available</Text> : null}
      {issues.length > 0 ? (
        <View style={styles.issues}>
          <Text style={styles.sectionTitle}>Detected issue(s)</Text>
          {issues.map((i) => (
            <Text key={i.label} style={styles.row}>
              • {i.label}
              {i.confidence !== undefined ? ` (${formatConfidence(i.confidence) ?? ""})` : ""}
            </Text>
          ))}
        </View>
      ) : null}
      {confidenceText ? <Text style={styles.row}>Confidence: {confidenceText}</Text> : null}
      {symptoms ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          <Text style={styles.bodyText}>{symptoms}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={() => navigation.navigate("Recommendations", { result })}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>View Recommendations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => navigation.navigate("Support")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Call Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginTop: 50, marginBottom: 12, textAlign: "center" },
  image: { width: "100%", height: 260, borderRadius: 14, resizeMode: "cover" },
  row: { marginTop: 10, fontSize: 16, color: "#1F1F1F" },
  issues: { marginTop: 8 },
  section: { marginTop: 14 },
  sectionTitle: { marginTop: 8, fontSize: 16, fontWeight: "800", color: "#1F1F1F" },
  bodyText: { marginTop: 8, fontSize: 15, color: "#2B2B2B", lineHeight: 20 },
  actions: { marginTop: 18, gap: 10 },
  button: { paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  primary: { backgroundColor: "#2E7D32" },
  secondary: { backgroundColor: "#1565C0" },
  buttonText: { color: "#fff", fontWeight: "800" }
});
