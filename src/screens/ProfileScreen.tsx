import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile / Settings</Text>
      <Text style={styles.subtitle}>Settings integration comes next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 10, color: "#2B2B2B", textAlign: "center" }
});

