import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { colors, typography, spacing, shadows } from "../theme";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export default function SupportScreen() {
  const supportPhone = "+919876543210"; // Replace with actual support number

  const makeCall = () => {
    const url = `tel:${supportPhone}`;
    Linking.openURL(url).catch(err => {
      Alert.alert("Error", "Could not make phone call");
    });
  };

  const makeVideoCall = () => {
    // For video calls, you can use:
    // - Zoom: zoommtg://zoom.us/join?confno=...
    // - Google Meet: https://meet.google.com/...
    // - Custom video SDK integration
    Alert.alert(
      "Video Support",
      "Video call feature will be available soon. For now, please use phone support.",
      [{ text: "OK" }]
    );
  };

  const openWhatsApp = () => {
    const message = "Hi, I need support with my plant disease detection.";
    const url = `whatsapp://send?phone=${supportPhone}&text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Support" />
      <View style={styles.content}>
        <Card variant="elevated" style={styles.card}>
          <Text style={styles.emoji}>📞</Text>
          <Text style={styles.title}>Get Expert Help</Text>
          <Text style={styles.subtitle}>
            Connect with our agricultural experts for personalized assistance
          </Text>
        </Card>

        <View style={styles.options}>
          <Button
            title="📞 Call Support"
            onPress={makeCall}
            fullWidth
            style={styles.button}
          />
          <Button
            title="📹 Video Call"
            onPress={makeVideoCall}
            variant="outline"
            fullWidth
            style={styles.button}
          />
          <Button
            title="💬 WhatsApp Support"
            onPress={openWhatsApp}
            variant="outline"
            fullWidth
            style={styles.button}
          />
        </View>

        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Support Hours</Text>
          <Text style={styles.infoText}>Monday - Saturday: 9 AM - 6 PM</Text>
          <Text style={styles.infoText}>Sunday: 10 AM - 4 PM</Text>
          <Text style={styles.infoText}>Phone: {supportPhone}</Text>
        </Card>
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
    padding: spacing.xl,
  },
  card: {
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: { 
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: { 
    ...typography.body,
    color: colors.textSecondary, 
    textAlign: "center",
    lineHeight: 22,
  },
  options: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  infoCard: {
    padding: spacing.lg,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

