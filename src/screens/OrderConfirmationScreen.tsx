import React from "react";
import { View, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "OrderConfirmation">;

export default function OrderConfirmationScreen({ navigation, route }: Props) {
  const { orderId } = route.params;

  return (
    <View style={styles.container}>
      <Header title="Order Confirmed" showBack={false} />
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Card variant="elevated" style={styles.orderCard}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.orderId}>{orderId}</Text>
          </Card>
        </View>

        <View style={styles.actions}>
          <Button
            title="Track Order"
            onPress={() => navigation.replace("Tracking", { orderId })}
            fullWidth
            style={styles.button}
          />
          <Button
            title="Back to Home"
            onPress={() => navigation.replace("Home")}
            variant="outline"
            fullWidth
            style={styles.secondaryButton}
          />
        </View>
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
    justifyContent: "center",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: { 
    ...typography.h1, 
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  orderCard: {
    padding: spacing.lg,
    minWidth: "100%",
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  orderId: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: "700",
  },
  actions: {
    width: "100%",
  },
  button: { 
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});

