import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const HomeScreen = () => {
  const slideAnim = useRef(new Animated.Value(0)).current; // start position
  const [image, setImage] = useState<string | null>(null);
  const [disease, setDisease] = useState<string | null>(null);

  // Slide up animation
  const slideUp = () => {
    Animated.timing(slideAnim, {
      toValue: -300, // slide up by 300 units
      duration: 500,
      useNativeDriver: true
    }).start();
  };
  // Pick image from gallery or camera
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  
      if (status !== "granted") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          alert("Permission required to access gallery");
          return;
        }
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);            // ✅ YOU MISSED THIS
        analyzePlant(uri);
      }
    } catch (err) {
      console.log("ImagePicker error:", err);
    }
  };
  

  const analyzePlant = async (uri: string) => {
    const formData = new FormData();
  
    formData.append("file", {
      uri: uri,
      name: "plant.jpg",
      type: "image/jpeg",
    } as any);
  
    const response = await fetch("http://192.168.29.122:8000/plant/analyze", {
      method: "POST",
      body: formData,
      // ❌ DO NOT SET HEADERS
    });
  
    const data = await response.json();
    setDisease(data.disease);
  };
  
  

  return (
    <View style={styles.container}>
      {/* Welcome message */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.text}>Welcome to Agri App!</Text>
        <TouchableOpacity style={styles.button} onPress={slideUp}>
          <Text style={styles.buttonText}>Analyze Plant</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Slide-up panel */}
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}
  activeOpacity={0.7}>
          <Text style={styles.buttonText}>
            {image ? "Change Image" : "Upload Plant Image"}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        )}

        {disease && <Text style={styles.diseaseText}>{disease}</Text>}
      </Animated.View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  text: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  button: { marginTop: 20, backgroundColor: "#4CAF50", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  panel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center"
  },
  uploadButton: { backgroundColor: "#2196F3", padding: 12, borderRadius: 8, marginBottom: 15 },
  imagePreview: { width: 200, height: 200, resizeMode: "contain", marginBottom: 15 },
  diseaseText: { fontSize: 18, fontWeight: "bold", color: "red", textAlign: "center" }
});
