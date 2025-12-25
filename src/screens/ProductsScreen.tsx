import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";
import { colors, typography, spacing, shadows } from "../theme";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

type Props = NativeStackScreenProps<RootStackParamList, "Products">;

export default function ProductsScreen({ navigation }: Props) {
  const { products, addToCart, cartItemCount, loading, error, refreshProducts } = useAppStore();

  useEffect(() => {
    if (products.length === 0 && !loading.products) {
      refreshProducts();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header 
        title="Products" 
        rightComponent={
          <TouchableOpacity
            style={styles.cartBadge}
            onPress={() => navigation.navigate("Cart")}
            activeOpacity={0.8}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />
      
      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Browse treatment products</Text>
      </View>

      {loading.products ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error.products ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error.products}</Text>
          <Button
            title="Retry"
            onPress={refreshProducts}
            style={styles.retryButton}
          />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading.products}
              onRefresh={refreshProducts}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <Card variant="elevated" style={styles.productCard}>
              <View style={styles.productContent}>
                <View style={styles.productImage}>
                  <Text style={styles.productEmoji}>🌿</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                  {item.unit && (
                    <Text style={styles.productUnit}>{item.unit}</Text>
                  )}
                </View>
                <Button
                  title="Add"
                  onPress={() => addToCart(item.id, 1).catch(console.error)}
                  size="small"
                  style={styles.addButton}
                />
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyText}>No products available</Text>
              <Text style={styles.emptySubtext}>Check back later for new products</Text>
            </View>
          }
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
  subtitleContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cartBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...shadows.small,
  },
  cartIcon: {
    fontSize: 24,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    ...typography.buttonSmall,
    color: colors.textOnPrimary,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  productCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.medium,
  },
  productContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  productEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  productPrice: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  productUnit: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  addButton: {
    minWidth: 80,
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
