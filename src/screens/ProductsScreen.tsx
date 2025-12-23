import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";

type Props = NativeStackScreenProps<RootStackParamList, "Products">;

export default function ProductsScreen({ navigation }: Props) {
  const { products, addToCart, cartItemCount } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity style={styles.cartPill} onPress={() => navigation.navigate("Cart")} activeOpacity={0.85}>
          <Text style={styles.cartPillText}>Cart: {cartItemCount}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productMeta}>
              ₹{item.price}
              {item.unit ? ` • ${item.unit}` : ""}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item.id, 1)}
              activeOpacity={0.85}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: { marginTop: 50,fontSize: 22, fontWeight: "800" },
  cartPill: { backgroundColor: "#1565C0", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  cartPillText: { color: "#fff", fontWeight: "800" },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 14,
    padding: 14,
    marginTop: 12
  },
  productName: { fontSize: 16, fontWeight: "800", color: "#1F1F1F" },
  productMeta: { marginTop: 6, color: "#2B2B2B" },
  addButton: { marginTop: 12, backgroundColor: "#2E7D32", paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "800" }
});
