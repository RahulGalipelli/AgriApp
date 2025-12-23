import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { useAppStore } from "../state/store";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

export default function CheckoutScreen({ navigation }: Props) {
  const [address, setAddress] = useState("");
  const { cart, cartItemCount, cartTotal, placeOrder } = useAppStore();

  const submit = () => {
    if (cart.length === 0) {
      navigation.replace("Products");
      return;
    }
    const orderId = placeOrder({ address });
    navigation.replace("OrderConfirmation", { orderId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.value}>
        Items: {cartItemCount} • Total: ₹{cartTotal}
      </Text>
      <Text style={styles.label}>Delivery Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="House, Street, Village, Pincode"
        style={styles.input}
      />
      <Text style={styles.label}>Payment</Text>
      <Text style={styles.value}>Cash on Delivery</Text>
      <TouchableOpacity style={styles.button} onPress={submit} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginTop: 10, textAlign: "center" },
  label: { marginTop: 18, fontWeight: "700", color: "#1F1F1F" },
  value: { marginTop: 8, color: "#2B2B2B" },
  input: { marginTop: 10, borderWidth: 1, borderColor: "#CFCFCF", borderRadius: 12, padding: 12 },
  button: { marginTop: 24, backgroundColor: "#2E7D32", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "800" }
});
