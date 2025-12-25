import React, { useEffect } from "react";
import { View, StyleSheet, Text, FlatList, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing, shadows } from "../theme";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export default function CartScreen({ navigation }: Props) {
  const { cart, getProductById, setCartQuantity, removeFromCart, cartItemCount, cartTotal, clearCart, loading, error, refreshCart } = useAppStore();

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <View style={styles.container}>
      <Header 
        title="Shopping Cart"
        rightComponent={
          <Text style={styles.itemCount}>
            {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
          </Text>
        }
      />

      {loading.cart ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      ) : error.cart ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error.cart}</Text>
          <Button
            title="Retry"
            onPress={refreshCart}
            style={styles.retryButton}
          />
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add products to get started</Text>
          <Button
            title="Browse Products"
            onPress={() => navigation.navigate("Products")}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading.cart}
                onRefresh={refreshCart}
                colors={[colors.primary]}
              />
            }
            renderItem={({ item }) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <Card variant="elevated" style={styles.cartItem}>
                  <View style={styles.itemContent}>
                    <View style={styles.itemImage}>
                      <Text style={styles.itemEmoji}>🌿</Text>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{product.name}</Text>
                      <Text style={styles.itemPrice}>₹{product.price}</Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={styles.quantityControls}>
                      <Button
                        title="-"
                        onPress={() => setCartQuantity(item.productId, item.quantity - 1).catch(console.error)}
                        size="small"
                        variant="outline"
                        style={styles.qtyButton}
                      />
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <Button
                        title="+"
                        onPress={() => setCartQuantity(item.productId, item.quantity + 1).catch(console.error)}
                        size="small"
                        variant="outline"
                        style={styles.qtyButton}
                      />
                    </View>
                    <Button
                      title="Remove"
                      onPress={() => removeFromCart(item.productId).catch(console.error)}
                      size="small"
                      variant="ghost"
                      style={[styles.removeButton]}
                      textStyle={{ color: colors.error }}
                    />
                  </View>
                </Card>
              );
            }}
          />

          <Card variant="elevated" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{cartItemCount}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>₹{cartTotal}</Text>
            </View>
          <Button
            title="Proceed to Checkout"
            onPress={() => navigation.navigate("Checkout")}
            fullWidth
            style={styles.checkoutButton}
          />
          <Button
            title="Clear Cart"
            onPress={() => clearCart().catch(console.error)}
            variant="ghost"
            size="small"
            style={styles.clearButton}
          />
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  itemCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
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
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  cartItem: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    minWidth: 40,
    marginHorizontal: spacing.xs,
  },
  quantity: {
    ...typography.h3,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: spacing.md,
  },
  summaryCard: {
    margin: spacing.xl,
    marginTop: spacing.md,
    padding: spacing.lg,
    ...shadows.large,
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
  summaryTotal: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryTotalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: "900",
  },
  checkoutButton: {
    marginTop: spacing.lg,
  },
  clearButton: {
    marginTop: spacing.sm,
  },
});
