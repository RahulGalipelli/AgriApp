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

type Props = NativeStackScreenProps<RootStackParamList, "ScanPlant">;

export default function ScanPlantScreen({ navigation }: Props) {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      "Select Image Source",
      "Choose how you want to add a plant photo",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
          style: "default"
        },
        {
          text: "Choose from Gallery",
          onPress: pickImage,
          style: "default"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Scan Plant" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>📸</Text>
          <Text style={styles.title}>Scan Plant</Text>
          <Text style={styles.subtitle}>
            Upload a photo of your plant to detect diseases and get treatment recommendations
          </Text>
        </View>

        {imageUri ? (
          <Card variant="elevated" style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.imageActions}>
              <Button
                title="Change Image"
                onPress={showImageSourceOptions}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Analyze Image"
                onPress={() => navigation.navigate("Processing", { imageUri })}
                style={styles.actionButton}
              />
            </View>
          </Card>
        ) : (
          <>
            <Card variant="elevated" style={styles.uploadCard}>
              <Text style={styles.uploadEmoji}>📸</Text>
              <Text style={styles.uploadText}>Scan Your Plant</Text>
              <Text style={styles.uploadHint}>
                Take a photo or select from gallery to detect plant diseases
              </Text>
            </Card>

            <View style={styles.buttonContainer}>
              <Button
                title="📷 Take Photo"
                onPress={takePhoto}
                fullWidth
                style={styles.primaryButton}
              />
              <Button
                title="🖼️ Choose from Gallery"
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
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.md,
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
  uploadCard: {
    padding: spacing.xxxl,
    marginBottom: spacing.lg,
    alignItems: "center",
    minHeight: 300,
    justifyContent: "center",
    backgroundColor: colors.gray[50],
  },
  uploadEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  uploadText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  uploadHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.md,
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
