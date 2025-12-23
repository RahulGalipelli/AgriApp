import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";

type Props = NativeStackScreenProps<RootStackParamList, "Tracking">;

export default function TrackingScreen({ route }: Props) {
  const { orderId } = route.params;
  const { getOrderById, getProductById } = useAppStore();
  const order = getOrderById(orderId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking</Text>
      <Text style={styles.subtitle}>Order ID: {orderId}</Text>
      {!order ? (
        <Text style={styles.subtitle}>Order not found.</Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Status: {order.status}</Text>
          <Text style={styles.subtitle}>Payment: {order.paymentMethod}</Text>
          <Text style={styles.subtitle}>Address: {order.address}</Text>
          <FlatList
            data={order.lines}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const product = getProductById(item.productId);
              return (
                <View style={styles.line}>
                  <Text style={styles.lineTitle}>{product?.name ?? item.productId}</Text>
                  <Text style={styles.lineMeta}>
                    Qty {item.quantity} • ₹{item.price} each
                  </Text>
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginTop: 35, marginBottom: 12 },
  subtitle: { marginTop: 10, color: "#2B2B2B" },
  list: { paddingTop: 8, paddingBottom: 20 },
  line: { borderWidth: 1, borderColor: "#E6E6E6", borderRadius: 14, padding: 14, marginTop: 12 },
  lineTitle: { fontWeight: "800", color: "#1F1F1F" },
  lineMeta: { marginTop: 6, color: "#2B2B2B" }
});
