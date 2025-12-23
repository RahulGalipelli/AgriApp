import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AgriCure</Text>
      <Text style={styles.subtitle}>Choose an option</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("ScanPlant")} activeOpacity={0.85}>
        <Text style={styles.primaryButtonText}>Upload Photo (Scan Plant)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Products")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Shop Products</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Orders")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>My Orders & Tracking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Support")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Call / Video Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Community")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Community / Tips</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Profile / Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: { marginTop: 8, marginBottom: 22, fontSize: 16, textAlign: "center", color: "#2B2B2B" },
  primaryButton: { backgroundColor: "#2E7D32", padding: 14, borderRadius: 12, marginBottom: 12, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontWeight: "800" },
  button: { backgroundColor: "#1565C0", padding: 14, borderRadius: 12, marginBottom: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "800" }
});
