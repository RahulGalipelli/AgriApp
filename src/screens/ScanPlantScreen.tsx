import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { colors, typography, spacing, shadows } from "../theme";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { useI18n } from "../i18n";

type Props = NativeStackScreenProps<RootStackParamList, "ScanPlant">;

export default function ScanPlantScreen({ navigation }: Props) {
  const { t } = useI18n();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  const processImage = async (uri: string) => {
    const manipResult = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG
    });
    setImageUri(manipResult.uri);
    navigation.navigate("Processing", { imageUri: manipResult.uri });
  };

  const takePhoto = async () => {
    if (hasCameraPermission === false) {
      Alert.alert(
        "Camera Permission Required",
        "Please grant camera permission to take photos. You can enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => ImagePicker.requestCameraPermissionsAsync() }
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
        aspect: [4, 3],
      });

      if (result.canceled) return;

      const originalUri = result.assets[0]?.uri;
      if (!originalUri) return;

      await processImage(originalUri);
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1
      });

      if (result.canceled) return;

      const originalUri = result.assets[0]?.uri;
      if (!originalUri) return;

      await processImage(originalUri);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const showImageSourceOptions = () => {
    Alert.alert(
      t("scanPlant.selectPlantImage"),
      t("scanPlant.selectPlantPhoto"),
      [
        {
          text: t("scanPlant.takePhoto"),
          onPress: takePhoto,
          style: "default"
        },
        {
          text: t("scanPlant.chooseFromGallery"),
          onPress: pickImage,
          style: "default"
        },
        {
          text: t("common.cancel"),
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("scanPlant.title")} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {imageUri ? (
          <Card variant="elevated" style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.imageActions}>
              <Button
                title={t("scanPlant.changeImage")}
                onPress={showImageSourceOptions}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title={t("scanPlant.analyzeImage")}
                onPress={() => navigation.navigate("Processing", { imageUri })}
                style={styles.actionButton}
              />
            </View>
          </Card>
        ) : (
          <>
            <Card variant="elevated" style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>📋 {t("scanPlant.tipsTitle")}</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{t("scanPlant.tip1")}</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{t("scanPlant.tip2")}</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{t("scanPlant.tip3")}</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{t("scanPlant.tip4")}</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{t("scanPlant.tip5")}</Text>
                </View>
              </View>
            </Card>

            <View style={styles.buttonContainer}>
              <Button
                title={`📷 ${t("scanPlant.takePhoto")}`}
                onPress={takePhoto}
                fullWidth
                style={styles.primaryButton}
              />
              <Button
                title={`🖼️ ${t("scanPlant.chooseFromGallery")}`}
                onPress={pickImage}
                variant="outline"
                fullWidth
                style={styles.secondaryButton}
              />
            </View>
          </>
        )}
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
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: spacing.md,
  },
  imageActions: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },
  actionButton: {
    flex: 1,
  },
  tipsCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight + "10",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  tipBullet: {
    ...typography.body,
    color: colors.primary,
    marginRight: spacing.sm,
    fontSize: 20,
    lineHeight: 24,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    marginTop: spacing.md,
  },
  secondaryButton: {
    marginTop: 0,
  },
});
