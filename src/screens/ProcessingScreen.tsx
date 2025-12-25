import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { analyzePlantImage } from "../api/plant";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

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
      <Header title="Processing" showBack={false} />
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.title}>Processing</Text>
        <Text style={styles.subtitle}>{statusText}</Text>
        {errorText ? (
          <>
            <Text style={styles.error}>{errorText}</Text>
            <Button
              title="Retry"
              onPress={run}
              style={styles.button}
            />
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
    padding: spacing.xl,
  },
  title: { 
    ...typography.h2, 
    marginTop: spacing.lg,
    color: colors.textPrimary,
  },
  subtitle: { 
    ...typography.body, 
    marginTop: spacing.xs, 
    color: colors.textSecondary 
  },
  error: { 
    marginTop: spacing.lg, 
    color: colors.error, 
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    ...typography.body,
  },
  button: { 
    marginTop: spacing.lg,
    minWidth: 200,
  },
  backButton: {
    marginTop: spacing.md,
    minWidth: 200,
  },
});

