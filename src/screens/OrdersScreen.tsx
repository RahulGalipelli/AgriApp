import React from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";

type Props = NativeStackScreenProps<RootStackParamList, "Orders">;

export default function OrdersScreen({ navigation }: Props) {
  const { orders } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.subtitle}>No orders yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Tracking", { orderId: item.id })}
              activeOpacity={0.85}
            >
              <Text style={styles.cardTitle}>{item.id}</Text>
              <Text style={styles.cardMeta}>Status: {item.status}</Text>
              <Text style={styles.cardMeta}>{new Date(item.createdAt).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginTop: 30, marginBottom: 12 },
  subtitle: { marginTop: 10, color: "#2B2B2B", textAlign: "center" },
  list: { paddingBottom: 20 },
  card: { borderWidth: 1, borderColor: "#E6E6E6", borderRadius: 14, padding: 14, marginTop: 12 },
  cardTitle: { fontWeight: "800", color: "#1F1F1F" },
  cardMeta: { marginTop: 6, color: "#2B2B2B" }
});
