import React, { useEffect } from "react";
import { View, StyleSheet, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Orders">;

export default function OrdersScreen({ navigation }: Props) {
  const { orders, loading, error, refreshOrders } = useAppStore();

  useEffect(() => {
    refreshOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="My Orders" />
      {loading.orders ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error.orders ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error.orders}</Text>
          <Button
            title="Retry"
            onPress={refreshOrders}
            style={styles.retryButton}
          />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Your order history will appear here</Text>
          <Button
            title="Browse Products"
            onPress={() => navigation.navigate("Products")}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading.orders}
              onRefresh={refreshOrders}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <Card
              variant="elevated"
              style={styles.card}
              onPress={() => navigation.navigate("Tracking", { orderId: item.id })}
            >
              <Text style={styles.cardTitle}>{item.id}</Text>
              <Text style={styles.cardMeta}>Status: {item.status}</Text>
              <Text style={styles.cardMeta}>{new Date(item.createdAt).toLocaleString()}</Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  list: { 
    padding: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl 
  },
  card: { 
    padding: spacing.lg, 
    marginBottom: spacing.md 
  },
  cardTitle: { 
    ...typography.button, 
    color: colors.textPrimary 
  },
  cardMeta: { 
    marginTop: spacing.xs, 
    color: colors.textSecondary 
  }
});
