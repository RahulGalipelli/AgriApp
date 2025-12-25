import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

type PaymentMethod = "COD" | "UPI" | "CARD" | "NETBANKING";

export default function CheckoutScreen({ navigation }: Props) {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const { cart, cartItemCount, cartTotal, placeOrder } = useAppStore();

  const submit = async () => {
    if (cart.length === 0) {
      navigation.replace("Products");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter a delivery address");
      return;
    }
    try {
      const orderId = await placeOrder({ address });
    navigation.replace("OrderConfirmation", { orderId });
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to place order");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.label}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{cartItemCount}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{cartTotal}</Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.formCard}>
      <Text style={styles.label}>Delivery Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="House, Street, Village, Pincode"
        style={styles.input}
            multiline
            numberOfLines={3}
          />
        </Card>

        <Card variant="elevated" style={styles.paymentCard}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            {(["COD", "UPI", "CARD", "NETBANKING"] as PaymentMethod[]).map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentOption,
                  paymentMethod === method && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === method && styles.paymentOptionTextSelected,
                  ]}
                >
                  {method === "COD" ? "💵 Cash on Delivery" :
                   method === "UPI" ? "📱 UPI" :
                   method === "CARD" ? "💳 Card" :
                   "🏦 Net Banking"}
                </Text>
                {paymentMethod === method && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title="Place Order"
          onPress={submit}
          fullWidth
          style={styles.button}
        />
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
  summaryCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  formCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  paymentCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: { 
    ...typography.h3, 
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  totalRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: "900",
  },
  input: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: spacing.md, 
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    ...typography.body,
    minHeight: 80,
    textAlignVertical: "top",
  },
  paymentOptions: {
    marginTop: spacing.sm,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundLight,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  paymentOptionTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  checkmark: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: "900",
  },
  button: { 
    marginTop: spacing.md,
  },
});
