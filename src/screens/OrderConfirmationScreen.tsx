import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";

type Props = NativeStackScreenProps<RootStackParamList, "OrderConfirmation">;

export default function OrderConfirmationScreen({ navigation, route }: Props) {
  const { orderId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmed</Text>
      <Text style={styles.subtitle}>Order ID: {orderId}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Tracking", { orderId })} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Track Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.replace("Home")} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginTop: 50 },
  subtitle: { marginTop: 12, color: "#2B2B2B" },
  button: { marginTop: 16, backgroundColor: "#2E7D32", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  secondary: { backgroundColor: "#1565C0" },
  buttonText: { color: "#fff", fontWeight: "700" }
});

