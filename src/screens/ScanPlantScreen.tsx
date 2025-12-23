import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";

type Props = NativeStackScreenProps<RootStackParamList, "ScanPlant">;

export default function ScanPlantScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });

    if (result.canceled) return;

    const originalUri = result.assets[0]?.uri;
    if (!originalUri) return;

    const manipResult = await ImageManipulator.manipulateAsync(originalUri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG
    });

    setImageUri(manipResult.uri);
    navigation.navigate("Processing", { imageUri: manipResult.uri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photo</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{imageUri ? "Change Image" : "Select Plant Image"}</Text>
      </TouchableOpacity>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginTop: 24, marginBottom: 16 },
  button: { backgroundColor: "#2E7D32", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
  image: { width: 280, height: 280, resizeMode: "contain", marginTop: 20, borderRadius: 12 }
});

