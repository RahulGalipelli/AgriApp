import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  OTP: { mobileNumber: string };
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "OTP">;

export const OTPScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (otp === "123456") { // Replace with real API verification
        navigation.replace("Home");
      } else {
        Alert.alert("Error", "Invalid OTP");
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text>OTP sent to {mobileNumber}</Text>

      <TextInput
        label="OTP"
        mode="outlined"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={verifyOTP}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Verify OTP
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, alignSelf: "center" },
  input: { marginBottom: 10 },
  button: { marginTop: 20 }
});
