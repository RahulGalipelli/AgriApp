import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export default function CartScreen({ navigation }: Props) {
  const { cart, getProductById, setCartQuantity, removeFromCart, cartItemCount, cartTotal, clearCart } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.subtitle}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <View style={styles.line}>
                  <View style={styles.lineInfo}>
                    <Text style={styles.lineName}>{product.name}</Text>
                    <Text style={styles.lineMeta}>₹{product.price} • Qty {item.quantity}</Text>
                  </View>
                  <View style={styles.lineActions}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => setCartQuantity(item.productId, item.quantity - 1)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => setCartQuantity(item.productId, item.quantity + 1)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.qtyButton, styles.removeButton]}
                      onPress={() => removeFromCart(item.productId)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.qtyButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.summary}>
            <Text style={styles.summaryText}>Items: {cartItemCount}</Text>
            <Text style={styles.summaryText}>Total: ₹{cartTotal}</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Checkout")}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={clearCart} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginTop: 50, marginBottom: 12 },
  subtitle: { marginTop: 10, color: "#2B2B2B", textAlign: "center" },
  list: { paddingBottom: 10 },
  line: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 14,
    padding: 14,
    marginTop: 12
  },
  lineInfo: { flexDirection: "column" },
  lineName: { fontSize: 16, fontWeight: "800", color: "#1F1F1F" },
  lineMeta: { marginTop: 6, color: "#2B2B2B" },
  lineActions: { marginTop: 12, flexDirection: "row" },
  qtyButton: {
    backgroundColor: "#1565C0",
    width: 44,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  removeButton: { backgroundColor: "#B00020" },
  qtyButtonText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  summary: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryText: { fontWeight: "800", color: "#1F1F1F" },
  primaryButton: { marginTop: 16, backgroundColor: "#2E7D32", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontWeight: "800" },
  secondaryButton: { marginTop: 10, backgroundColor: "#E8EAF6", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  secondaryButtonText: { color: "#1F1F1F", fontWeight: "800" }
});
