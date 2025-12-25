import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, ScrollView, ActivityIndicator, RefreshControl, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing, shadows } from "../theme";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useI18n } from "../i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export default function CartScreen({ navigation }: Props) {
  const { cart, getProductById, setCartQuantity, removeFromCart, cartItemCount, cartTotal, clearCart, loading, error, refreshCart } = useAppStore();
  const [isClearing, setIsClearing] = useState(false);
  const { t } = useI18n();

  // Initial load on mount only
  useEffect(() => {
    refreshCart().catch(console.error);
  }, []);

  const handleClearCart = () => {
    if (isClearing || loading.cart) return;
    
    Alert.alert(
      t("cart.clearCart"),
      t("cart.clearCartConfirm"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("cart.clearCart"),
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearCart();
            } catch (error) {
              Alert.alert(t("common.error"), t("cart.clearCartError"));
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title={t("cart.title")}
        rightComponent={
          <Text style={styles.itemCount}>
            {cartItemCount} {cartItemCount === 1 ? t("cart.item") : t("cart.items")}
          </Text>
        }
      />

      {loading.cart ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t("cart.loading")}</Text>
        </View>
      ) : error.cart ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error.cart}</Text>
          <Button
            title={t("common.retry")}
            onPress={refreshCart}
            style={styles.retryButton}
          />
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>{t("cart.empty")}</Text>
          <Text style={styles.emptyText}>{t("cart.addProductsToGetStarted")}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isClearing && !loading.cart}
            refreshControl={
              <RefreshControl
                refreshing={loading.cart && !isClearing}
                onRefresh={refreshCart}
                colors={[colors.primary]}
                enabled={!isClearing}
              />
            }
            renderItem={({ item }) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              const isDisabled = isClearing || loading.cart;
              return (
                <Card variant="elevated" style={[styles.cartItem, isDisabled && styles.disabledItem]}>
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
                        onPress={() => !isDisabled && setCartQuantity(item.productId, item.quantity - 1).catch(console.error)}
                        size="small"
                        variant="outline"
                        style={styles.qtyButton}
                        disabled={isDisabled}
                      />
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <Button
                        title="+"
                        onPress={() => !isDisabled && setCartQuantity(item.productId, item.quantity + 1).catch(console.error)}
                        size="small"
                        variant="outline"
                        style={styles.qtyButton}
                        disabled={isDisabled}
                      />
                    </View>
                    <Button
                      title={t("cart.remove")}
                      onPress={() => !isDisabled && removeFromCart(item.productId).catch(console.error)}
                      size="small"
                      variant="ghost"
                      style={[styles.removeButton]}
                      textStyle={{ color: colors.error }}
                      disabled={isDisabled}
                    />
                  </View>
                </Card>
              );
            }}
          />

          <Card variant="elevated" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("cart.itemsLabel")}</Text>
              <Text style={styles.summaryValue}>{cartItemCount}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>{t("cart.total")}</Text>
              <Text style={styles.summaryTotalValue}>₹{cartTotal}</Text>
            </View>
          <Button
            title={t("cart.proceedToCheckout")}
            onPress={() => !isClearing && !loading.cart && navigation.navigate("Checkout")}
            fullWidth
            style={styles.checkoutButton}
            disabled={isClearing || loading.cart}
          />
          <View style={styles.clearButtonContainer}>
            <Button
              title={t("cart.clearCart")}
              onPress={handleClearCart}
              variant="ghost"
              size="small"
              style={styles.clearButton}
              disabled={isClearing || loading.cart}
            />
            {isClearing && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.clearLoading}
              />
            )}
          </View>
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
  clearButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  clearButton: {
    marginRight: spacing.xs,
  },
  clearLoading: {
    marginLeft: spacing.xs,
  },
  disabledItem: {
    opacity: 0.5,
  },
});
