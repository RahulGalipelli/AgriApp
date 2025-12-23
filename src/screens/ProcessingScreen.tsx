import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { analyzePlantImage } from "../api/plant";

type Props = NativeStackScreenProps<RootStackParamList, "Processing">;

export default function ProcessingScreen({ navigation, route }: Props) {
  const { imageUri } = route.params;
  const [status, setStatus] = useState<"uploading" | "analyzing" | "failed">("uploading");
  const [errorText, setErrorText] = useState<string | null>(null);

  const statusText = useMemo(() => {
    if (status === "uploading") return "Uploading…";
    if (status === "analyzing") return "Analyzing…";
    return "Failed";
  }, [status]);

  const run = async () => {
    setErrorText(null);
    setStatus("uploading");
    try {
      setStatus("analyzing");
      const result = await analyzePlantImage(imageUri);
      navigation.replace("DetectionResult", { imageUri, result });
    } catch (e) {
      setStatus("failed");
      setErrorText(e instanceof Error ? e.message : "Unknown error");
    }
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7D32" />
      <Text style={styles.title}>Processing</Text>
      <Text style={styles.subtitle}>{statusText}</Text>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      {status === "failed" ? (
        <TouchableOpacity style={styles.button} onPress={run} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 16 },
  subtitle: { fontSize: 16, marginTop: 6, color: "#2B2B2B" },
  error: { marginTop: 10, color: "#B00020", textAlign: "center" },
  button: { marginTop: 18, backgroundColor: "#2E7D32", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "700" }
});

