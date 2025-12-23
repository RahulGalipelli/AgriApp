import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";

type Props = NativeStackScreenProps<RootStackParamList, "Recommendations">;

function toSteps(result: Record<string, unknown>): string[] {
  const nextSteps = result.next_steps;
  if (Array.isArray(nextSteps)) {
    const cleaned = nextSteps.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean);
    if (cleaned.length > 0) return cleaned;
  }
  const fallback: string[] = [];
  const symptoms = typeof result.symptoms === "string" ? result.symptoms.trim() : "";
  const prevention = typeof result.prevention === "string" ? result.prevention.trim() : "";
  const organic = typeof result.organic_treatment === "string" ? result.organic_treatment.trim() : "";
  if (symptoms) fallback.push(symptoms);
  if (organic) fallback.push(organic);
  if (prevention) fallback.push(prevention);
  return fallback.length > 0 ? fallback : ["No recommendations available."];
}

export default function RecommendationsScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const resultObj = result as unknown as Record<string, unknown>;
  const issue = typeof resultObj.disease_name === "string" ? (resultObj.disease_name as string) : "Issue";
  const organic =
    typeof resultObj.organic_treatment === "string" ? (resultObj.organic_treatment as string) : undefined;
  const chemical =
    typeof resultObj.chemical_treatment === "string" ? (resultObj.chemical_treatment as string) : undefined;
  const prevention = typeof resultObj.prevention === "string" ? (resultObj.prevention as string) : undefined;
  const steps = toSteps(resultObj);
  const { products, addToCart, cartItemCount } = useAppStore();
  const recommended = [...products].sort((a, b) => a.price - b.price).slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      <Text style={styles.subtitle}>{issue}</Text>

      <FlatList
        data={steps}
        keyExtractor={(item, idx) => `${idx}-${item}`}
        renderItem={({ item }) => <Text style={styles.bullet}>• {item}</Text>}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={styles.footer}>
            {organic ? (
              <>
                <Text style={styles.sectionTitle}>Organic treatment</Text>
                <Text style={styles.paragraph}>{organic}</Text>
              </>
            ) : null}
            {chemical ? (
              <>
                <Text style={styles.sectionTitle}>Chemical treatment</Text>
                <Text style={styles.paragraph}>{chemical}</Text>
              </>
            ) : null}
            {prevention ? (
              <>
                <Text style={styles.sectionTitle}>Prevention</Text>
                <Text style={styles.paragraph}>{prevention}</Text>
              </>
            ) : null}

            <Text style={styles.sectionTitle}>Recommended products</Text>
            {recommended.map((p) => (
              <View key={p.id} style={styles.productRow}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{p.name}</Text>
                  <Text style={styles.productMeta}>
                    ₹{p.price}
                    {p.unit ? ` • ${p.unit}` : ""}
                  </Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => addToCart(p.id, 1)} activeOpacity={0.85}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Products")} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Browse Products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")} activeOpacity={0.85}>
              <Text style={styles.cartButtonText}>Go to Cart ({cartItemCount})</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginTop: 30, textAlign: "center" },
  subtitle: { marginTop: 10, fontSize: 16, color: "#1F1F1F", textAlign: "center" },
  list: { paddingTop: 16, paddingBottom: 20 },
  bullet: { fontSize: 16, color: "#2B2B2B", marginBottom: 8 },
  button: { backgroundColor: "#2E7D32", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "800" },
  footer: { marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10, color: "#1F1F1F" },
  paragraph: { marginBottom: 14, color: "#2B2B2B", lineHeight: 20 },
  productRow: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  productInfo: { flex: 1, paddingRight: 10 },
  productName: { fontWeight: "800", color: "#1F1F1F" },
  productMeta: { marginTop: 6, color: "#2B2B2B" },
  addButton: { backgroundColor: "#1565C0", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  addButtonText: { color: "#fff", fontWeight: "800" },
  cartButton: { marginTop: 10, backgroundColor: "#E8EAF6", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  cartButtonText: { color: "#1F1F1F", fontWeight: "800" }
});
