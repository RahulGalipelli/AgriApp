import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useI18n } from "../i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

type PaymentMethod = "COD" | "UPI" | "CARD" | "NETBANKING";

export default function CheckoutScreen({ navigation }: Props) {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const { cart, cartItemCount, cartTotal, placeOrder } = useAppStore();
  const { t } = useI18n();

  const submit = async () => {
    if (cart.length === 0) {
      navigation.replace("Products");
      return;
    }
    if (!address.trim()) {
      Alert.alert(t("common.error"), t("checkout.enterAddress"));
      return;
    }
    try {
      const orderId = await placeOrder({ address });
    navigation.replace("OrderConfirmation", { orderId });
    } catch (error) {
      Alert.alert(t("common.error"), error instanceof Error ? error.message : t("checkout.placeOrderError"));
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t("checkout.title")} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.label}>{t("checkout.orderSummary")}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t("checkout.items")}</Text>
            <Text style={styles.summaryValue}>{cartItemCount}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t("checkout.total")}</Text>
            <Text style={styles.totalValue}>₹{cartTotal}</Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.formCard}>
      <Text style={styles.label}>{t("checkout.deliveryAddress")}</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder={t("checkout.addressPlaceholder")}
        style={styles.input}
            multiline
            numberOfLines={3}
          />
        </Card>

        <Card variant="elevated" style={styles.paymentCard}>
          <Text style={styles.label}>{t("checkout.paymentMethod")}</Text>
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
                  {method === "COD" ? t("checkout.cashOnDelivery") :
                   method === "UPI" ? t("checkout.upi") :
                   method === "CARD" ? t("checkout.card") :
                   t("checkout.netBanking")}
                </Text>
                {paymentMethod === method && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title={t("checkout.placeOrder")}
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
