import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import * as ordersAPI from "../api/orders";

type Props = NativeStackScreenProps<RootStackParamList, "Tracking">;

export default function TrackingScreen({ route }: Props) {
  const { orderId } = route.params;
  const { getProductById } = useAppStore();
  const [order, setOrder] = useState<ordersAPI.Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await ordersAPI.getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Order Tracking" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading order...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>❌</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : !order ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>❌</Text>
        <Text style={styles.subtitle}>Order not found.</Text>
          </View>
      ) : (
        <>
            <Card variant="elevated" style={styles.infoCard}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>{order.id}</Text>
            </Card>
            <Card variant="elevated" style={styles.infoCard}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{order.status.toUpperCase()}</Text>
            </Card>
            <Card variant="elevated" style={styles.infoCard}>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.value}>{order.payment_method || "Cash on Delivery"}</Text>
            </Card>
            {order.address && (
              <Card variant="elevated" style={styles.infoCard}>
                <Text style={styles.label}>Delivery Address</Text>
                <Text style={styles.value}>{order.address}</Text>
              </Card>
            )}
            <Card variant="elevated" style={styles.infoCard}>
              <Text style={styles.label}>Courier Information</Text>
              <Text style={styles.value}>Tracking ID: {order.id.slice(0, 8).toUpperCase()}</Text>
              <Text style={styles.courierText}>
                Your order will be delivered by our partner courier service.
                Expected delivery: 3-5 business days.
              </Text>
              <View style={styles.courierActions}>
                <Button
                  title="📱 WhatsApp Support"
                  onPress={() => {
                    const phone = "+919876543210"; // Replace with actual support number
                    const message = `Hi, I need help with my order ${order.id}`;
                    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
                    Linking.canOpenURL(url).then(supported => {
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        Alert.alert("Error", "WhatsApp is not installed");
                      }
                    });
                  }}
                  variant="outline"
                  size="small"
                  style={styles.courierButton}
                />
                <Button
                  title="📧 SMS Support"
                  onPress={() => {
                    const phone = "+919876543210"; // Replace with actual support number
                    const message = `Order ${order.id} - Need help`;
                    const url = `sms:${phone}?body=${encodeURIComponent(message)}`;
                    Linking.openURL(url).catch(err => {
                      Alert.alert("Error", "Could not open SMS");
                    });
                  }}
                  variant="outline"
                  size="small"
                  style={styles.courierButton}
                />
              </View>
            </Card>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.items.length === 0 ? (
              <Card variant="outlined" style={styles.infoCard}>
                <Text style={styles.emptyText}>No items in this order</Text>
              </Card>
            ) : (
              order.items.map((item) => (
                <Card key={item.product_id} variant="outlined" style={styles.line}>
                  <Text style={styles.lineTitle}>{item.product_name}</Text>
                  <Text style={styles.lineMeta}>
                    Qty {item.quantity} • ₹{item.price} each
                  </Text>
                </Card>
              ))
            )}
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
  },
  subtitle: { 
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  infoCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  line: { 
    padding: spacing.md, 
    marginBottom: spacing.sm 
  },
  lineTitle: { 
    ...typography.button, 
    color: colors.textPrimary 
  },
  lineMeta: { 
    marginTop: spacing.xs, 
    color: colors.textSecondary 
  },
  courierText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  courierActions: {
    flexDirection: "row",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  courierButton: {
    flex: 1,
  },
});
